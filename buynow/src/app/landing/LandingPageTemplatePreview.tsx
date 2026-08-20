import type { CSSProperties } from "react";
import { ArrowRight, Check, ChevronDown, MapPin, Play, Quote, Sparkles, Star, Users } from "lucide-react";
import type { LandingPageDocument } from "./LandingPageRenderer";

type Props = {
  document: LandingPageDocument;
  onClose: () => void;
};

const templateMeta: Record<string, { label: string; eyebrow: string; accent: string; soft: string }> = {
  "creator-brand": { label: "Creator Brand", eyebrow: "CREATOR • PERSONAL BRAND", accent: "#7C3AED", soft: "#F5F3FF" },
  coach: { label: "Coach", eyebrow: "COACHING • TRANSFORMATION", accent: "#0F766E", soft: "#F0FDFA" },
  "service-business": { label: "Service Business", eyebrow: "SERVICE • RESULTS", accent: "#1D4ED8", soft: "#EFF6FF" },
  agency: { label: "Agency", eyebrow: "AGENCY • GROWTH", accent: "#111827", soft: "#F3F4F6" },
  "local-business": { label: "Local Business", eyebrow: "LOCAL • TRUSTED", accent: "#B45309", soft: "#FFFBEB" },
  "lead-magnet": { label: "Lead Magnet", eyebrow: "FREE RESOURCE", accent: "#BE185D", soft: "#FDF2F8" },
  waitlist: { label: "Waitlist", eyebrow: "COMING SOON", accent: "#4338CA", soft: "#EEF2FF" },
  "product-offer": { label: "Product Offer", eyebrow: "PRODUCT • OFFER", accent: "#047857", soft: "#ECFDF5" },
};

function metaFor(document: LandingPageDocument) {
  return templateMeta[document.metadata.templateKey ?? "creator-brand"] ?? templateMeta["creator-brand"];
}

export default function LandingPageTemplatePreview({ document, onClose }: Props) {
  const meta = metaFor(document);
  const primary = document.theme.colors.primary ?? meta.accent;
  const surface = document.theme.colors.surface ?? "#FFFFFF";
  const text = document.theme.colors.text ?? "#111111";
  const muted = document.theme.colors.muted ?? "#6B7280";
  const style: CSSProperties = { background: surface, color: text };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 p-0 sm:p-6">
      <div className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[28px]">
        <header className="flex shrink-0 items-center justify-between border-b border-[#EEF0F5] bg-white px-4 py-3">
          <div><div className="text-[13px] font-black">Preview</div><div className="text-[11px] text-[#9CA3AF]">{meta.label}</div></div>
          <button type="button" onClick={onClose} className="rounded-xl bg-[#F7F8FC] px-4 py-2 text-[12px] font-bold">Close</button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto" style={style}>
          {document.sections.filter((section) => section.visible).map((section, sectionIndex) => (
            <section key={section.id} className="px-5 py-10" style={{ background: sectionIndex % 2 === 0 ? surface : meta.soft }}>
              <div className="mx-auto max-w-xl space-y-5">
                {section.type === "hero" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.16em]" style={{ color: primary }}><Sparkles size={13} /> {meta.eyebrow}</div>
                    <div className="space-y-3">{section.blocks.map((block, index) => <Block key={index} block={block} primary={primary} muted={muted} />)}</div>
                  </div>
                )}
                {section.type !== "hero" && section.blocks.map((block, index) => <Block key={index} block={block} primary={primary} muted={muted} />)}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function Block({ block, primary, muted }: { block: LandingPageDocument["sections"][number]["blocks"][number]; primary: string; muted: string }) {
  if (block.type === "text") return <p className="text-[16px] leading-7" style={{ color: muted }}>{block.text}</p>;
  if (block.type === "button") return <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[14px] font-black text-white shadow-lg" style={{ background: primary }}>{block.label}<ArrowRight size={16} /></button>;
  if (block.type === "testimonial") return <blockquote className="rounded-3xl bg-white p-6 shadow-sm"><Quote size={22} style={{ color: primary }} /><p className="mt-3 text-[17px] font-bold leading-7">“{block.quote}”</p><footer className="mt-4 text-[12px] font-bold" style={{ color: muted }}>{block.author}</footer></blockquote>;
  if (block.type === "faq") return <details className="rounded-2xl border border-black/5 bg-white p-4"><summary className="flex cursor-pointer items-center justify-between text-[14px] font-black">{block.question}<ChevronDown size={16} /></summary><p className="mt-3 text-[13px] leading-5" style={{ color: muted }}>{block.answer}</p></details>;
  if (block.type === "image") return <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-3xl bg-black/5 text-center text-[12px] font-semibold" style={{ background: `linear-gradient(135deg, ${meta.soft}, ${surface})` }}>{block.alt || "Your image"}</div>;
  if (block.type === "form") return <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-[15px] font-black">Get started</div><div className="mt-1 text-[12px]" style={{ color: muted }}>Lead form connected: {block.formId || "Select a form"}</div><div className="mt-5 space-y-2"><div className="h-11 rounded-xl border border-black/10" /><div className="h-11 rounded-xl border border-black/10" /><div className="h-11 rounded-xl" style={{ background: primary }} /></div></div>;
  return <div className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-center gap-2 text-[10px] font-black tracking-wider" style={{ color: primary }}><Star size={13} /> FEATURED OFFER</div><div className="mt-3 text-[22px] font-black">Your product</div><div className="mt-2 text-[13px]" style={{ color: muted }}>Product connected: {block.productId || "Select a product"}</div><div className="mt-5 flex items-center justify-between"><span className="text-[24px] font-black">$99</span><button type="button" className="rounded-xl px-4 py-2.5 text-[12px] font-bold text-white" style={{ background: primary }}>Buy now</button></div></div>;
}
