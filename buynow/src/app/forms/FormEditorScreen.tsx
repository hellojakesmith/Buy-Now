import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, Copy, Eye, Plus, Trash2, X } from "lucide-react";
import { FORM_FIELD_TYPES, keyFromLabel, normalizeEditorType, type EditableForm, type FormField, type FormFieldType } from "./types";

const TYPE_LABELS: Record<FormFieldType, string> = {
  text: "Short text",
  email: "Email",
  phone: "Phone",
  number: "Number",
  textarea: "Long text",
  select: "Dropdown",
  multiselect: "Multi-select",
  radio: "Multiple choice",
  checkbox: "Checkbox",
  date: "Date",
  url: "Website URL",
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
    validation: field.validation,
    conditional: field.conditional,
    order: field.order ?? index,
  }));
}

function FieldPreview({ field }: { field: FormField }) {
  const common = "w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-[13px] text-[#374151]";
  if (field.type === "textarea") return <textarea rows={3} placeholder={field.placeholder || "Type your answer…"} className={common} readOnly />;
  if (field.type === "select") return <select className={common} defaultValue=""><option value="">Select an option…</option>{(field.options ?? []).map((option) => <option key={option}>{option}</option>)}</select>;
  if (field.type === "radio") return <div className="space-y-2">{(field.options ?? []).map((option) => <label key={option} className="flex items-center gap-2 text-[13px] text-[#374151]"><input type="radio" name={field.key} />{option}</label>)}</div>;
  if (field.type === "multiselect") return <div className="space-y-2">{(field.options ?? []).map((option) => <label key={option} className="flex items-center gap-2 text-[13px] text-[#374151]"><input type="checkbox" />{option}</label>)}</div>;
  if (field.type === "checkbox") return <label className="flex items-center gap-2 text-[13px] text-[#374151]"><input type="checkbox" />{field.helpText || field.label}</label>;
  const inputType = field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text";
  return <input type={inputType} placeholder={field.placeholder || "Type your answer…"} className={common} readOnly />;
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
  const [preview, setPreview] = useState(false);
  const published = form?.status === "published";

  const usedKeys = useMemo(() => new Set(fields.map((field) => field.key)), [fields]);

  function updateField(index: number, patch: Partial<FormField>) {
    setFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function addField(type: FormFieldType) {
    const label = TYPE_LABELS[type];
    const baseKey = keyFromLabel(label);
    let key = baseKey;
    let n = 2;
    while (usedKeys.has(key)) {
      key = `${baseKey}_${n}`;
      n += 1;
    }
    setFields((current) => [...current, {
      key,
      label,
      type,
      required: type === "email" || type === "text",
      options: ["select", "multiselect", "radio"].includes(type) ? ["Option 1", "Option 2"] : undefined,
      order: current.length,
    }]);
  }

  function moveField(index: number, direction: -1 | 1) {
    setFields((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next.map((field, order) => ({ ...field, order }));
    });
  }

  function duplicateField(index: number) {
    setFields((current) => {
      const source = current[index];
      const baseKey = `${source.key}_copy`;
      let key = baseKey;
      let n = 2;
      while (current.some((field) => field.key === key)) {
        key = `${baseKey}_${n}`;
        n += 1;
      }
      const copy = { ...source, key, label: `${source.label} (copy)` };
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next.map((field, order) => ({ ...field, order }));
    });
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

  if (preview) {
    return (
      <div className="min-h-full bg-[#F7F8FC] pb-8">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EEF0F5] bg-white/95 px-4 py-3 backdrop-blur">
          <button onClick={() => setPreview(false)} className="flex items-center gap-2 rounded-xl bg-[#F7F8FC] px-3 py-2 text-[13px] font-semibold"><X size={15} />Close preview</button>
          <span className="text-[13px] font-bold">Mobile preview</span>
          <div className="w-20" />
        </div>
        <div className="mx-auto mt-6 max-w-[390px] px-4">
          <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0325D9]">Buy Now</div>
            <h1 className="mt-2 text-[24px] font-black tracking-tight text-[#111111]">{name}</h1>
            {description && <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">{description}</p>}
            <div className="mt-5 space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <div className="mb-1.5 text-[12px] font-bold text-[#374151]">{field.label}{field.required ? " *" : ""}</div>
                  <FieldPreview field={field} />
                  {field.helpText && field.type !== "checkbox" && <div className="mt-1 text-[10px] text-[#9CA3AF]">{field.helpText}</div>}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-[#0325D9] px-4 py-3.5 text-center text-[13px] font-bold text-white">Submit</div>
            <p className="mt-3 text-center text-[11px] text-[#9CA3AF]">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EEF0F5] bg-white/95 px-4 py-3 backdrop-blur">
        <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F8FC]"><ChevronLeft size={18} color="#111111" /></button>
        <span className="max-w-[140px] truncate px-2 text-[16px] font-bold text-[#111111]">{name}</span>
        <div className="flex gap-2">
          <button onClick={() => setPreview(true)} className="flex h-9 items-center gap-1.5 rounded-xl bg-[#F7F8FC] px-3 text-[12px] font-semibold"><Eye size={14} />Preview</button>
          <button disabled={busy} onClick={() => void run(() => onSave({ name, description, successMessage, fields }))} className="rounded-xl bg-[#111111] px-3 py-1.5 text-[12px] font-semibold text-white">Save</button>
          {published && onUnpublish ? (
            <button disabled={busy} onClick={() => void run(onUnpublish)} className="rounded-xl bg-[#FEF2F2] px-3 py-1.5 text-[12px] font-semibold text-[#B91C1C]">Unpublish</button>
          ) : (
            <button disabled={busy} onClick={() => void run(() => onPublish(fields))} className="rounded-xl bg-[#0325D9] px-3 py-1.5 text-[12px] font-semibold text-white">Publish</button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        <section className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">Basics</div>
          <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Form name</span><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" /></label>
          <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" rows={2} /></label>
          <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#374151]">Success message</span><input value={successMessage} onChange={(event) => setSuccessMessage(event.target.value)} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none" /></label>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between"><div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">Fields · {fields.length}</div><span className="text-[10px] text-[#9CA3AF]">Drag-and-drop is intentionally avoided on mobile</span></div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.key} className="rounded-[18px] border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button disabled={index === 0} onClick={() => moveField(index, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7F8FC] disabled:opacity-30" aria-label="Move field up"><ArrowUp size={12} /></button>
                    <button disabled={index === fields.length - 1} onClick={() => moveField(index, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7F8FC] disabled:opacity-30" aria-label="Move field down"><ArrowDown size={12} /></button>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <input value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-[14px] font-semibold" />
                    <div className="flex gap-2">
                      <select value={field.type} onChange={(event) => updateField(index, { type: event.target.value as FormFieldType, options: ["select", "multiselect", "radio"].includes(event.target.value) ? field.options ?? ["Option 1", "Option 2"] : field.options })} className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] px-3 py-2 text-[12px]">
                        {FORM_FIELD_TYPES.map((type) => <option key={type} value={type}>{TYPE_LABELS[type]}</option>)}
                      </select>
                      <label className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#F7F8FC] px-2.5 text-[11px] font-semibold text-[#374151]"><input type="checkbox" checked={Boolean(field.required)} onChange={(event) => updateField(index, { required: event.target.checked })} />Required</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => duplicateField(index)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7F8FC]" aria-label="Duplicate field"><Copy size={12} /></button>
                    <button onClick={() => setFields((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, order) => ({ ...item, order })))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3E5]" aria-label={`Remove ${field.label}`}><Trash2 size={12} color="#FF8A00" /></button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input value={field.placeholder ?? ""} onChange={(event) => updateField(index, { placeholder: event.target.value })} placeholder="Placeholder" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                  <input value={field.helpText ?? ""} onChange={(event) => updateField(index, { helpText: event.target.value })} placeholder="Help text" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                </div>

                {["select", "multiselect", "radio"].includes(field.type) && (
                  <input value={(field.options ?? []).join(", ")} onChange={(event) => updateField(index, { options: event.target.value.split(",").map((part) => part.trim()).filter(Boolean) })} placeholder="Options, comma separated" className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                )}

                {["text", "email", "phone", "textarea", "url"].includes(field.type) && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input type="number" min={0} value={field.validation?.minLength ?? ""} onChange={(event) => updateField(index, { validation: { ...field.validation, minLength: event.target.value ? Number(event.target.value) : undefined } })} placeholder="Min chars" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                    <input type="number" min={1} value={field.validation?.maxLength ?? ""} onChange={(event) => updateField(index, { validation: { ...field.validation, maxLength: event.target.value ? Number(event.target.value) : undefined } })} placeholder="Max chars" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                  </div>
                )}

                {field.type === "number" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input type="number" value={field.validation?.min ?? ""} onChange={(event) => updateField(index, { validation: { ...field.validation, min: event.target.value ? Number(event.target.value) : undefined } })} placeholder="Minimum" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                    <input type="number" value={field.validation?.max ?? ""} onChange={(event) => updateField(index, { validation: { ...field.validation, max: event.target.value ? Number(event.target.value) : undefined } })} placeholder="Maximum" className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">Add field</div>
          <div className="grid grid-cols-3 gap-2">
            {FORM_FIELD_TYPES.map((type) => <button key={type} type="button" onClick={() => addField(type)} className="rounded-xl border border-[#EEF0F5] bg-[#F7F8FC] px-2 py-2.5 text-center text-[10px] font-semibold text-[#6B7280]"><Plus size={10} className="mr-1 inline" />{TYPE_LABELS[type]}</button>)}
          </div>
        </section>

        {error && <div role="alert" className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B91C1C]">{error}</div>}
        {published && form?.publishSettings?.path && <div className="rounded-2xl bg-[#F7F8FC] px-4 py-3 text-[12px] text-[#6B7280]">Live at <span className="font-semibold text-[#0325D9]">{form.publishSettings.path}</span></div>}
      </div>
    </div>
  );
}
