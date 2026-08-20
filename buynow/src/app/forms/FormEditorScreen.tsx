import { useMemo, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { FORM_FIELD_TYPES, keyFromLabel, normalizeEditorType, type EditableForm, type FormField, type FormFieldType } from "./types";

const TYPE_LABELS: Record<FormFieldType, string> = {
  text: "Text",
  email: "Email",
  phone: "Phone",
  textarea: "Long text",
  select: "Dropdown",
  checkbox: "Checkbox",
  date: "Date",
};

function toFields(form: EditableForm | null): FormField[] {
  return (form?.fields ?? []).map((field, index) => ({
    key: field.key || keyFromLabel(field.label, `field_${index + 1}`),
    label: field.label,
    type: normalizeEditorType(field.type),
    required: Boolean(field.required),
    options: field.options,
    placeholder: field.placeholder,
    helpText: field.helpText,
    order: field.order ?? index,
  }));
}

export default function FormEditorScreen({
  goBack,
  onSave,
  onPublish,
  onUnpublish,
  form,
}: {
  goBack: () => void;
  onSave: (input: { name: string; description: string; successMessage: string; fields: FormField[] }) => Promise<void>;
  onPublish: (fields: FormField[]) => Promise<void>;
  onUnpublish?: () => Promise<void>;
  form: EditableForm | null;
}) {
  const [name, setName] = useState(form?.name ?? "New Lead Form");
  const [description, setDescription] = useState(form?.description ?? "Tell us a little about yourself.");
  const [successMessage, setSuccessMessage] = useState(form?.successMessage ?? "Thanks — we received your details.");
  const [fields, setFields] = useState<FormField[]>(toFields(form));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const published = form?.status === "published";

  const usedKeys = useMemo(() => new Set(fields.map((field) => field.key)), [fields]);

  function addField(type: FormFieldType) {
    const label = TYPE_LABELS[type];
    let key = keyFromLabel(label);
    let n = 2;
    while (usedKeys.has(key)) {
      key = `${keyFromLabel(label)}_${n}`;
      n += 1;
    }
    setFields((current) => [...current, {
      key,
      label,
      type,
      required: type === "email" || type === "text",
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
      order: current.length,
    }]);
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the form");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F5] flex-shrink-0">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]">
          <ChevronLeft size={18} color="#111111" />
        </button>
        <span className="font-bold text-[16px] text-[#111111] truncate px-2">{name}</span>
        <div className="flex gap-2">
          <button disabled={busy} onClick={() => void run(() => onSave({ name, description, successMessage, fields }))} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold bg-[#F7F8FC] text-[#111111]">Save</button>
          {published && onUnpublish ? (
            <button disabled={busy} onClick={() => void run(onUnpublish)} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold bg-[#FEF2F2] text-[#B91C1C]">Unpublish</button>
          ) : (
            <button disabled={busy} onClick={() => void run(() => onPublish(fields))} className="px-3 py-1.5 rounded-xl text-[13px] font-semibold text-white bg-[#0325D9]">Publish</button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Form name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Description</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" rows={2} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Success message</span>
          <input value={successMessage} onChange={(event) => setSuccessMessage(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" />
        </label>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Fields</div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.key} className="p-3.5 rounded-[14px] border border-[#EEF0F5] bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    value={field.label}
                    onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))}
                    className="flex-1 min-w-0 rounded-xl border border-[#E5E7EB] px-3 py-2 text-[14px] font-semibold"
                  />
                  <button onClick={() => setFields((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFF3E5]" aria-label={`Remove ${field.label}`}>
                    <Trash2 size={12} color="#FF8A00" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={field.type}
                    onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, type: event.target.value as FormFieldType, options: event.target.value === "select" ? item.options ?? ["Option 1"] : item.options } : item))}
                    className="flex-1 rounded-xl border border-[#E5E7EB] px-3 py-2 text-[12px]"
                  >
                    {FORM_FIELD_TYPES.map((type) => <option key={type} value={type}>{TYPE_LABELS[type]}</option>)}
                  </select>
                  <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#374151]">
                    <input type="checkbox" checked={Boolean(field.required)} onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, required: event.target.checked } : item))} />
                    Required
                  </label>
                </div>
                {field.type === "select" && (
                  <input
                    value={(field.options ?? []).join(", ")}
                    onChange={(event) => setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, options: event.target.value.split(",").map((part) => part.trim()).filter(Boolean) } : item))}
                    placeholder="Options, comma separated"
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-[12px]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Add field</div>
          <div className="grid grid-cols-3 gap-2">
            {FORM_FIELD_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => addField(type)} className="py-2.5 px-2 rounded-xl text-[11px] font-semibold text-center bg-[#F7F8FC] text-[#6B7280] border border-[#EEF0F5]">
                <Plus size={10} className="inline mr-1" />
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {error && <div role="alert" className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B91C1C]">{error}</div>}
        {published && form?.publishSettings?.path && (
          <div className="rounded-2xl bg-[#F7F8FC] px-4 py-3 text-[12px] text-[#6B7280]">
            Live at <span className="font-semibold text-[#0325D9]">{form.publishSettings.path}</span>
          </div>
        )}
      </div>
    </div>
  );
}
