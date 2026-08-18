import { ContactModel } from "../models/Contact.js";
export async function upsertContactFromSubmission(input: {
  workspaceId: string;
  ownerUserId: string;
  source: string;
  answers: Record<string, unknown>;
  submissionStatus?: "new" | "processed" | "ignored";
}) {
  const answers = input.answers ?? {};
  const name = String(answers.name ?? answers.fullName ?? answers.firstName ?? "New Lead").trim();
  const email = String(answers.email ?? "").trim().toLowerCase();
  const phone = String(answers.phone ?? answers.telephone ?? "").trim();
  const company = String(answers.company ?? "").trim();
  const interest = String(answers.interest ?? answers.service ?? answers.topic ?? "").trim();

  const filter: Record<string, unknown> = { workspaceId: input.workspaceId };
  if (email) {
    filter.email = email;
  } else if (phone) {
    filter.phone = phone;
  } else {
    filter.name = name;
  }

  const update = {
    workspaceId: input.workspaceId,
    ownerUserId: input.ownerUserId,
    source: input.source,
    kind: "lead",
    status: "new",
    name,
    email: email || undefined,
    phone: phone || undefined,
    company: company || undefined,
    interest: interest || undefined,
    lastActivityAt: new Date(),
  };

  const contact = await ContactModel.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return contact;
}
