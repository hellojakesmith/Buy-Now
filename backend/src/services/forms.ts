import { FormModel } from "../models/Form.js";
import { FormSubmissionModel } from "../models/FormSubmission.js";
import { OpportunityModel } from "../models/Opportunity.js";
import { createActivity } from "./activities.js";
import { createNotification } from "./notifications.js";
import { ensureDefaultPipeline } from "./seed.js";
import { upsertContactFromSubmission } from "./contacts.js";
import { AppError } from "../utils/http.js";
import { validateFormAnswers } from "../schemas/forms.js";

const DUPLICATE_WINDOW_MS = 1000 * 60 * 60 * 24;

export function publicFormView(form: { name: string; slug: string; description?: string | null; successMessage?: string | null; fields?: unknown[]; publishSettings?: unknown; stats?: unknown }) {
  return {
    name: form.name,
    slug: form.slug,
    description: form.description ?? "",
    successMessage: form.successMessage ?? "Thanks — we received your details.",
    fields: form.fields ?? [],
  };
}

export async function processFormSubmission(input: {
  workspaceId: string;
  ownerUserId: string;
  formId?: string;
  formSlug?: string;
  answers: unknown;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
  createOpportunity?: boolean;
}) {
  const form = input.formId
    ? await FormModel.findOne({ _id: input.formId, workspaceId: input.workspaceId })
    : await FormModel.findOne({ slug: input.formSlug, workspaceId: input.workspaceId });

  if (!form) {
    throw new AppError(404, "Form not found");
  }

  const answers = validateFormAnswers(form.fields ?? [], input.answers);
  const email = typeof answers.email === "string" ? answers.email : undefined;

  if (email) {
    const recent = await FormSubmissionModel.findOne({
      formId: form._id,
      email,
      submittedAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    }).sort({ submittedAt: -1 });

    if (recent) {
      await FormModel.updateOne({ _id: form._id }, { $inc: { "stats.submissions": 1 } });
      return { form, submission: recent, contact: null, opportunity: null, duplicate: true };
    }
  }

  const shouldCreateContact = form.submitAction?.createContact !== false;
  const contact = shouldCreateContact
    ? await upsertContactFromSubmission({
        workspaceId: input.workspaceId,
        ownerUserId: input.ownerUserId,
        source: form.name,
        answers,
      })
    : null;

  const submission = await FormSubmissionModel.create({
    workspaceId: input.workspaceId,
    formId: form._id,
    contactId: contact?._id,
    email,
    sourceUrl: input.sourceUrl,
    answers,
    metadata: input.metadata ?? {},
    status: "processed",
  });

  await FormModel.updateOne({ _id: form._id }, { $inc: { "stats.submissions": 1 } });

  if (contact) {
    await createActivity({
      workspaceId: input.workspaceId,
      actorUserId: input.ownerUserId,
      contactId: String(contact._id),
      type: "submission",
      title: "Form submitted",
      body: `${contact.name} submitted ${form.name}`,
      payload: { submissionId: String(submission._id), formId: String(form._id) },
    });
  }

  let opportunity = null;
  const shouldCreateOpportunity = input.createOpportunity ?? form.submitAction?.createOpportunity;
  if (shouldCreateOpportunity && contact) {
    const pipeline = await ensureDefaultPipeline(input.workspaceId, input.ownerUserId);
    const stageKey = form.submitAction?.pipelineStage ?? "new";
    opportunity = await OpportunityModel.create({
      workspaceId: input.workspaceId,
      pipelineId: pipeline._id,
      contactId: contact._id,
      ownerUserId: input.ownerUserId,
      title: answers.title ? String(answers.title) : `${form.name} Opportunity`,
      value: Number(answers.value ?? 0),
      currency: "USD",
      stageKey,
      status: "open",
      source: form.name,
      probability: stageKey === "won" ? 100 : 25,
    });

    await createActivity({
      workspaceId: input.workspaceId,
      actorUserId: input.ownerUserId,
      contactId: String(contact._id),
      opportunityId: String(opportunity._id),
      type: "system",
      title: "Opportunity created",
      body: `${opportunity.title} created from form submission`,
    });
  }

  await createNotification({
    workspaceId: input.workspaceId,
    userId: input.ownerUserId,
    type: "form-submission",
    title: "New form submission",
    body: `${contact?.name ?? "Someone"} submitted ${form.name}`,
    link: `/forms/${form._id}`,
    payload: { formId: String(form._id), contactId: contact ? String(contact._id) : undefined },
  });

  return { form, submission, contact, opportunity, duplicate: false };
}
