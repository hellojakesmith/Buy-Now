export const FORM_FIELD_TYPES = ["text", "email", "phone", "textarea", "select", "checkbox", "date"] as const;
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export type FormField = {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  order: number;
};

export type EditableForm = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  successMessage?: string;
  status?: string;
  fields?: Array<{ key?: string; label: string; type: string; required?: boolean; options?: string[]; placeholder?: string; helpText?: string; order?: number }>;
  publishSettings?: { path?: string };
  submitAction?: { createContact?: boolean; createOpportunity?: boolean };
};

export function keyFromLabel(label: string) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "field";
}

export function normalizeEditorType(type: string): FormFieldType {
  const value = type.trim().toLowerCase();
  if (value === "email") return "email";
  if (value === "phone") return "phone";
  if (value === "textarea" || value === "long text") return "textarea";
  if (value === "select" || value === "dropdown" || value === "multiple choice") return "select";
  if (value === "checkbox" || value === "checkboxes") return "checkbox";
  if (value === "date") return "date";
  return "text";
}
