export const FORM_FIELD_TYPES = [
  "text", "email", "phone", "number", "textarea", "select", "multiselect", "radio", "checkbox", "date", "url",
] as const;
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export type FormFieldValidation = {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};

export type FormFieldConditional = {
  fieldKey: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
};

export type FormField = {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: FormFieldValidation;
  conditional?: FormFieldConditional;
  order: number;
};

export type EditableForm = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  successMessage?: string;
  successRedirectUrl?: string;
  status?: string;
  fields?: Array<{
    key?: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: string;
    validation?: FormFieldValidation;
    conditional?: FormFieldConditional;
    order?: number;
  }>;
  publishSettings?: { path?: string };
  submitAction?: { createContact?: boolean; createOpportunity?: boolean; pipelineStage?: string };
};

export function keyFromLabel(label: string, fallback = "field") {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || fallback;
}

export function normalizeEditorType(type: string): FormFieldType {
  const value = type.trim().toLowerCase();
  if (value === "email") return "email";
  if (value === "phone") return "phone";
  if (value === "number") return "number";
  if (value === "textarea" || value === "long text") return "textarea";
  if (value === "select" || value === "dropdown") return "select";
  if (value === "multiselect" || value === "multi-select") return "multiselect";
  if (value === "radio" || value === "multiple choice") return "radio";
  if (value === "checkbox" || value === "checkboxes") return "checkbox";
  if (value === "date") return "date";
  if (value === "url" || value === "website") return "url";
  return "text";
}
