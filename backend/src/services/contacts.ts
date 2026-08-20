import { ContactModel } from "../models/Contact.js";

export async function upsertContactFromSubmission(input: {
  workspaceId: string;
  ownerUserId: string;
  source: string;
  answers: Record<string, unknown>;
}) {
  const answers = input.answers ?? {};
  const firstName = String(answers.firstName ?? answers.first_name ?? "").trim();
  const lastName = String(answers.lastName ?? answers.last_name ?? "").trim();
  const composedName = [firstName, lastName].filter(Boolean).join(" ");
  const name = String(answers.name ?? answers.fullName ?? composedName ?? "New Lead").trim() || "New Lead";
  const email = String(answers.email ?? "").trim().toLowerCase();
  const phone = String(answers.phone ?? answers.telephone ?? "").trim();
  const company = String(answers.company ?? "").trim();
  const interest = String(answers.interest ?? answers.service ?? answers.topic ?? answers.message ?? "").trim();

  const filter: Record<string, unknown> = { workspaceId: input.workspaceId };
  if (email) filter.email = email;
  else if (phone) filter.phone = phone;
  else {
    return ContactModel.create({
      workspaceId: input.workspaceId,
      ownerUserId: input.ownerUserId,
      source: input.source,
      kind: "lead",
      status: "new",
      name,
      phone: phone || undefined,
      company: company || undefined,
      interest: interest || undefined,
      lastActivityAt: new Date(),
    });
  }

  return ContactModel.findOneAndUpdate(
    filter,
    {
      $set: {
        lastActivityAt: new Date(),
        ...(company ? { company } : {}),
        ...(interest ? { interest } : {}),
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
      },
      $setOnInsert: {
        workspaceId: input.workspaceId,
        ownerUserId: input.ownerUserId,
        source: input.source,
        kind: "lead",
        status: "new",
        name,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}
