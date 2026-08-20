import { FormEvent, useEffect, useMemo, useState } from "react";
import { API_BASE, errorMessageFromBody } from "../lib/api";
import type { FormField } from "./types";
import { normalizeEditorType } from "./types";

type PublicFormPayload = {
  name: string;
  slug: string;
  description?: string;
  successMessage?: string;
  fields: FormField[];
};

export function publicFormSlugFromPath(pathname = window.location.pathname) {
  const match = pathname.match(/^\/f\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

function isVisible(field: FormField, values: Record<string, unknown>) {
  const condition = field.conditional;
  if (!condition) return true;
  const current = values[condition.fieldKey];
  const normalized = Array.isArray(current) ? current.join(", ") : String(current ?? "");
  if (condition.operator === "equals") return normalized === condition.value;
  if (condition.operator === "not_equals") return normalized !== condition.value;
  return normalized.toLowerCase().includes(condition.value.toLowerCase());
}

export default function PublicForm({ slug }: { slug: string }) {
  const [form, setForm] = useState<PublicFormPayload | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(`${API_BASE}/public/forms/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(errorMessageFromBody(await response.text(), "Form not found"));
        return response.json() as Promise<{ form: PublicFormPayload }>;
      })
      .then((payload) => {
        if (!cancelled) setForm(payload.form);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load this form");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const visibleFields = useMemo(() => form?.fields?.filter((field) => isVisible(field, values)) ?? [], [form, values]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSubmitting(true);
    setError(null);
    try {
      const answers: Record<string, unknown> = {};
      for (const field of form.fields ?? []) {
        if (!isVisible(field, values)) continue;
        const value = values[field.key];
        answers[field.key] = normalizeEditorType(field.type) === "checkbox" ? Boolean(value) : value ?? "";
      }
      const response = await fetch(`${API_BASE}/public/forms/${encodeURIComponent(slug)}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, sourceUrl: window.location.href }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Unable to submit this form");
      setSuccess(body.successMessage || form.successMessage || "Thanks — we received your details.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit this form");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] text-sm font-semibold text-[#6B7280]">Loading form…</div>;

  if (!form) {
    return <main className="min-h-screen bg-[#F7F8FC] px-4 py-16"><div className="mx-auto max-w-md rounded-[28px] bg-white p-8 text-center shadow-sm"><div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0325D9]">Buy Now</div><h1 className="mt-3 text-2xl font-black">Form unavailable</h1><p className="mt-2 text-sm text-[#6B7280]">{error ?? "This form is not published."}</p></div></main>;
  }

  if (success) {
    return <main className="min-h-screen bg-[#F7F8FC] px-4 py-16"><div className="mx-auto max-w-md rounded-[28px] bg-white p-8 text-center shadow-sm"><div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0325D9]">Buy Now</div><h1 className="mt-3 text-2xl font-black">You're all set</h1><p className="mt-2 text-sm leading-6 text-[#6B7280]">{success}</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-10">
      <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[28px] border border-[#EEF0F5] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)] sm:p-8">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0325D9]">Buy Now</div>
        <h1 className="mt-2 text-[28px] font-black tracking-tight text-[#111111]">{form.name}</h1>
        {form.description && <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">{form.description}</p>}
        <div className="mt-6 space-y-5">
          {visibleFields.map((field) => {
            const type = normalizeEditorType(field.type);
            const value = values[field.key];
            return (
              <label key={field.key} className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#374151]">{field.label}{field.required ? " *" : ""}</span>
                {type === "textarea" ? (
                  <textarea required={field.required} placeholder={field.placeholder} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none focus:border-[#0325D9]" rows={4} value={String(value ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} />
                ) : type === "select" ? (
                  <select required={field.required} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none focus:border-[#0325D9]" value={String(value ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}><option value="">Select…</option>{(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}</select>
                ) : type === "radio" ? (
                  <div className="space-y-2">{(field.options ?? []).map((option) => <span key={option} className="flex items-center gap-2 text-sm text-[#374151]"><input type="radio" name={field.key} required={field.required && !value} checked={value === option} onChange={() => setValues((current) => ({ ...current, [field.key]: option }))} />{option}</span>)}</div>
                ) : type === "multiselect" ? (
                  <div className="space-y-2">{(field.options ?? []).map((option) => { const selected = Array.isArray(value) ? value.map(String) : []; return <span key={option} className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" checked={selected.includes(option)} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.checked ? [...selected, option] : selected.filter((item) => item !== option) }))} />{option}</span>; })}</div>
                ) : type === "checkbox" ? (
                  <span className="flex items-center gap-2 text-sm text-[#374151]"><input type="checkbox" required={field.required} checked={Boolean(value)} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.checked }))} />{field.helpText || field.label}</span>
                ) : (
                  <input required={field.required} type={type === "email" ? "email" : type === "phone" ? "tel" : type === "number" ? "number" : type === "date" ? "date" : type === "url" ? "url" : "text"} placeholder={field.placeholder} min={field.type === "number" ? field.validation?.min : undefined} max={field.type === "number" ? field.validation?.max : undefined} minLength={field.validation?.minLength} maxLength={field.validation?.maxLength} className="w-full rounded-2xl border border-[#E5E7EB] px-3 py-3 text-[14px] outline-none focus:border-[#0325D9]" value={String(value ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} />
                )}
                {field.helpText && type !== "checkbox" && <span className="mt-1 block text-[11px] text-[#9CA3AF]">{field.helpText}</span>}
              </label>
            );
          })}
        </div>
        {error && <div role="alert" className="mt-4 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B91C1C]">{error}</div>}
        <button disabled={submitting} className="mt-6 w-full rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[14px] font-bold text-white disabled:opacity-60">{submitting ? "Sending…" : "Submit"}</button>
      </form>
    </main>
  );
}
