import type { CSSProperties, ReactNode } from "react";

type Action = { type: "url"; url: string } | { type: "form"; formId: string } | { type: "product"; productId: string } | { type: "buy-now"; pageId: string };
type Block =
  | { type: "text"; text: string }
  | { type: "image"; assetId: string; alt: string }
  | { type: "button"; label: string; action: Action }
  | { type: "form"; formId: string }
  | { type: "product"; productId: string }
  | { type: "testimonial"; quote: string; author: string }
  | { type: "faq"; question: string; answer: string };
type Section = { id: string; type: string; visible: boolean; blocks: Block[]; settings: Record<string, unknown> };
export type LandingPageDocument = { schemaVersion: 1; sections: Section[]; theme: { colors: Record<string, string>; typography: Record<string, string>; buttons: Record<string, unknown>; spacing: Record<string, number>; radius: Record<string, number> }; references: Array<{ type: "form" | "product" | "page"; id: string }>; metadata: { templateKey?: string; aiGenerated: boolean; aiPromptVersion?: string } };
function buttonStyle(theme: LandingPageDocument["theme"]): CSSProperties { return { background: theme.colors.primary ?? "#0325D9", color: theme.colors.primaryText ?? "#FFFFFF", borderRadius: theme.radius.button ?? 14 }; }
function sectionShell(type: string, theme: LandingPageDocument["theme"]): string { if (type === "hero") return "rounded-[28px] px-5 py-10"; if (type === "benefits") return "rounded-[24px] border p-6"; if (type === "social-proof") return "rounded-[24px] p-1"; if (type === "offer" || type === "product") return "rounded-[24px] border p-6"; if (type === "faq") return "rounded-[24px] border p-4"; if (type === "cta") return "rounded-[28px] px-5 py-8 text-center"; return "px-1 py-4"; }
function sectionBackground(type: string, theme: LandingPageDocument["theme"]): CSSProperties { const primary = theme.colors.primary ?? "#0325D9"; if (type === "hero" || type === "cta") return { background: `linear-gradient(135deg, ${primary}, ${theme.colors.text ?? "#111111"})`, color: theme.colors.primaryText ?? "#FFFFFF" }; if (type === "benefits" || type === "faq") return { background: theme.colors.surface ?? "#FFFFFF", borderColor: `${primary}22` }; return { background: theme.colors.surface ?? "#FFFFFF" }; }
function renderBlock(block: Block, index: number, section: Section, document: LandingPageDocument, interactive: boolean, muted: string): ReactNode {
  const theme = document.theme;
  if (block.type === "text") return <p key={index} className={section.type === "hero" ? "text-[30px] font-black leading-[1.05] tracking-tight" : section.type === "cta" ? "text-[15px] leading-6" : "text-[15px] leading-6"} style={{ color: section.type === "hero" || section.type === "cta" ? theme.colors.primaryText : undefined }}>{block.text}</p>;
  if (block.type === "image") return <div key={index} className="flex min-h-40 items-center justify-center overflow-hidden rounded-2xl bg-black/5 p-8 text-center text-xs" style={{ color: muted }} data-asset-id={block.assetId}>{block.alt || "Image"}</div>;
  if (block.type === "testimonial") return <blockquote key={index} className="rounded-2xl border p-5" style={{ borderColor: `${theme.colors.primary ?? "#0325D9"}22`, background: theme.colors.surface }}><p className="text-[16px] font-semibold leading-6">“{block.quote}”</p><cite className="mt-3 block text-[12px] font-semibold not-italic" style={{ color: muted }}>{block.author}</cite></blockquote>;
  if (block.type === "faq") return <details key={index} className="rounded-2xl border bg-white/80 p-4"><summary className="cursor-pointer text-[14px] font-bold">{block.question}</summary><p className="mt-3 text-[13px] leading-5" style={{ color: muted }}>{block.answer}</p></details>;
  if (block.type === "form") return <div key={index} className="rounded-2xl border border-[#DCE5FF] bg-white p-5"><div className="text-[14px] font-black">Lead capture</div><div className="mt-1 text-[12px]" style={{ color: muted }}>{block.formId ? `Connected form: ${block.formId}` : "Connect a lead form from the editor"}</div></div>;
  if (block.type === "product") return <div key={index} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-[14px] font-black">Product offer</div><div className="mt-1 text-[12px]" style={{ color: muted }}>{block.productId ? `Connected product: ${block.productId}` : "Connect a product from the editor"}</div></div>;
  return <button key={index} type="button" disabled={!interactive} onClick={() => { if (block.action.type === "url" && interactive) window.open(block.action.url, "_blank", "noopener,noreferrer"); }} className="w-full px-5 py-3.5 text-[14px] font-bold shadow-sm" style={buttonStyle(theme)}>{block.label}</button>;
}

export default function LandingPageRenderer({ document, interactive = false }: { document: LandingPageDocument; interactive?: boolean }) {
  const surface = document.theme.colors.surface ?? "#FFFFFF";
  const text = document.theme.colors.text ?? "#111111";
  const muted = document.theme.colors.muted ?? "#6B7280";
  return <main style={{ background: surface, color: text, fontFamily: document.theme.typography.fontFamily ?? "Inter, system-ui, sans-serif" }}>
    {document.sections.filter((section) => section.visible).map((section) => <section key={section.id} className="mx-auto w-full max-w-2xl px-4 py-3" data-section-type={section.type}>
      <div className={sectionShell(section.type, document.theme)} style={sectionBackground(section.type, document.theme)}>
        <div className="space-y-4">{section.blocks.map((block, index) => renderBlock(block, index, section, document, interactive, muted))}</div>
      </div>
    </section>)}
  </main>;
}
