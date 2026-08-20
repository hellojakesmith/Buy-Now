import { z } from "zod";
import { AppError } from "../utils/errors.js";

export const FORM_FIELD_TYPES = [
  "text", "email", "phone", "number", "textarea", "select", "multiselect", "radio", "checkbox", "date", "url",
] as const;
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

const LEGACY_TYPE_MAP: Record<string, FormFieldType> = {
  text: "text",
  "short text": "text",
  "long text": "textarea",
  textarea: "textarea",
  email: "email",
  phone: "phone",
  number: "number",
  select: "select",
  dropdown: "select",
  "multiple choice": "radio",
  multiselect: "multiselect",
  "multi-select": "multiselect",
  radio: "radio",
  checkbox: "checkbox",
  checkboxes: "checkbox",
  date: "date",
  url: "url",
  website: "url",
};

export function normalizeFieldType(type: string): FormFieldType {
  return LEGACY_TYPE_MAP[type.trim().toLowerCase()] ?? "text";
}

export function fieldKeyFromLabel(label: string, fallback = "field") {
  const key = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return key || fallback;
}

const validationSchema = z.object({
  minLength: z.coerce.number().int().min(0).max(5000).optional(),
  maxLength: z.coerce.number().int().min(1).max(5000).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
}).optional();

const conditionalSchema = z.object({
  fieldKey: z.string().trim().min(1).max(80),
  operator: z.enum(["equals", "not_equals", "contains"]),
  value: z.string().max(500),
}).optional();

export const formFieldSchema = z.object({
  key: z.string().trim().min(1).max(80).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Field keys must start with a letter"),
  label: z.string().trim().min(1).max(120),
  type: z.string().trim().min(1).max(40).transform(normalizeFieldType),
  required: z.boolean().optional().default(false),
  options: z.array(z.string().trim().min(1).max(120)).max(50).optional(),
  placeholder: z.string().trim().max(200).optional(),
  helpText: z.string().trim().max(400).optional(),
  validation: validationSchema,
  conditional: conditionalSchema,
  order: z.coerce.number().int().min(0).max(500).optional(),
});

export const submitActionSchema = z.object({
  createContact: z.boolean().optional(),
  createOpportunity: z.boolean().optional(),
  pipelineStage: z.string().trim().max(80).optional(),
  notificationEmail: z.string().trim().email().max(254).optional(),
});

export const publishSettingsSchema = z.object({
  path: z.string().trim().max(200).optional(),
  qrCodeEnabled: z.boolean().optional(),
  embedEnabled: z.boolean().optional(),
});

export const formBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  description: z.string().max(5000).optional(),
  successMessage: z.string().trim().max(500).optional(),
  successRedirectUrl: z.string().url().max(2000).optional(),
  fields: z.array(formFieldSchema).max(100).optional(),
  submitAction: submitActionSchema.optional(),
  publishSettings: publishSettingsSchema.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const formPatchSchema = formBodySchema.partial();

export const publishFormSchema = z.object({
  publishSettings: publishSettingsSchema.optional(),
});

export const publicSubmissionSchema = z.object({
  answers: z.record(z.unknown()).optional(),
  sourceUrl: z.string().url().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
  createOpportunity: z.boolean().optional(),
}).passthrough();

const emailValue = z.string().trim().email().max(254);
const phoneValue = z.string().trim().min(7).max(40);
const dateValue = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const urlValue = z.string().trim().url().max(2000);

function stringLengthIssues(label: string, value: string, validation: { minLength?: number; maxLength?: number } | undefined, issues: Array<{ key: string; message: string }>, key: string) {
  if (validation?.minLength != null && value.length < validation.minLength) {
    issues.push({ key, message: `${label} must be at least ${validation.minLength} characters` });
  }
  if (validation?.maxLength != null && value.length > validation.maxLength) {
    issues.push({ key, message: `${label} must be no more than ${validation.maxLength} characters` });
  }
}

export type FormFieldInput = z.infer<typeof formFieldSchema>;

export function validateFormAnswers(
  fields: Array<{ key: string; label: string; type: string; required?: boolean; options?: string[]; validation?: { minLength?: number; maxLength?: number; min?: number; max?: number } }>,
  raw: unknown,
) {
  const incoming = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const answers: Record<string, unknown> = {};
  const issues: Array<{ key: string; message: string }> = [];

  for (const field of fields) {
    const type = normalizeFieldType(field.type);
    const value = incoming[field.key] ?? incoming[field.label];
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);

    if (empty) {
      if (field.required) issues.push({ key: field.key, message: `${field.label} is required` });
      continue;
    }

    if (type === "email") {
      const parsed = emailValue.safeParse(String(value));
      if (!parsed.success) issues.push({ key: field.key, message: `${field.label} must be a valid email` });
      else answers[field.key] = parsed.data.toLowerCase();
      continue;
    }

    if (type === "phone") {
      const parsed = phoneValue.safeParse(String(value).replace(/[^\d+()\-\s]/g, ""));
      if (!parsed.success) issues.push({ key: field.key, message: `${field.label} must be a valid phone number` });
      else answers[field.key] = parsed.data.trim();
      continue;
    }

    if (type === "number") {
      const parsed = z.coerce.number().finite().safeParse(value);
      if (!parsed.success) {
        issues.push({ key: field.key, message: `${field.label} must be a valid number` });
      } else {
        if (field.validation?.min != null && parsed.data < field.validation.min) issues.push({ key: field.key, message: `${field.label} must be at least ${field.validation.min}` });
        if (field.validation?.max != null && parsed.data > field.validation.max) issues.push({ key: field.key, message: `${field.label} must be no more than ${field.validation.max}` });
        answers[field.key] = parsed.data;
      }
      continue;
    }

    if (type === "date") {
      const parsed = dateValue.safeParse(String(value).slice(0, 10));
      if (!parsed.success) issues.push({ key: field.key, message: `${field.label} must be a date` });
      else answers[field.key] = parsed.data;
      continue;
    }

    if (type === "url") {
      const parsed = urlValue.safeParse(String(value));
      if (!parsed.success) issues.push({ key: field.key, message: `${field.label} must be a valid URL` });
      else answers[field.key] = parsed.data;
      continue;
    }

    if (type === "select" || type === "radio") {
      const selected = String(value);
      if (field.options?.length && !field.options.includes(selected)) {
        issues.push({ key: field.key, message: `${field.label} must be one of the allowed options` });
      } else {
        answers[field.key] = selected;
      }
      continue;
    }

    if (type === "multiselect") {
      const selected = Array.isArray(value) ? value.map(String) : String(value).split(",").map((part) => part.trim()).filter(Boolean);
      if (field.options?.length && selected.some((item) => !field.options?.includes(item))) {
        issues.push({ key: field.key, message: `${field.label} contains an invalid option` });
      } else {
        answers[field.key] = selected.slice(0, 50);
      }
      continue;
    }

    if (type === "checkbox") {
      answers[field.key] = value === true || value === "true" || value === "on" || value === "yes";
      continue;
    }

    const text = String(value).slice(0, 5000);
    stringLengthIssues(field.label, text, field.validation, issues, field.key);
    answers[field.key] = text;
  }

  if (issues.length) throw new AppError(400, "Invalid form submission", { issues });

  if (incoming.name && !answers.name) answers.name = String(incoming.name);
  if (incoming.email && !answers.email) {
    const parsed = emailValue.safeParse(String(incoming.email));
    if (parsed.success) answers.email = parsed.data.toLowerCase();
  }

  return answers;
}
