import type { CSSProperties } from "react";

type Action =
  | { type: "url"; url: string }
  | { type: "form"; formId: string }
  | { type: "product"; productId: string }
  | { type: "buy-now"; pageId: string };

type Block =
  | { type: "text"; text: string }
  | { type: "image"; assetId: string; alt: string }
  | { type: "button"; label: string; action: Action }
  | { type: "form"; formId: string }
  | { type: "product"; productId: string }
  | { type: "testimonial"; quote: string; author: string }
  | { type: "faq"; question: string; answer: string };

type Section = {
  id: string;
  type: string;
  visible: boolean;
  blocks: Block[];
  settings: Record<string, unknown>;
};

export type LandingPageDocument = {
  schemaVersion: 1;
  sections: Section[];
  theme: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    buttons: Record<string, unknown>;
    spacing: Record<string, number>;
    radius: Record<string, number>;
  };
  references: Array<{ type: "form" | "product" | "page"; id: string }>;
  metadata: { templateKey?: string; aiGenerated: boolean; aiPromptVersion?: string };
};

function buttonStyle(theme: LandingPageDocument["theme"]): CSSProperties {
  return {
    background: theme.colors.primary ?? "#0325D9",
    color: theme.colors.primaryText ?? "#FFFFFF",
    borderRadius: theme.radius.button ?? 14,
  };
}

export default function LandingPageRenderer({ document, interactive = false }: { document: LandingPageDocument; interactive?: boolean }) {
  const surface = document.theme.colors.surface ?? "#FFFFFF";
  const text = document.theme.colors.text ?? "#111111";
  const muted = document.theme.colors.muted ?? "#6B7280";

  return (
    <main style={{ background: surface, color: text, fontFamily: document.theme.typography.fontFamily ?? "Inter, system-ui, sans-serif" }}>
      {document.sections.filter((section) => section.visible).map((section) => (
        <section key={section.id} className="mx-auto w-full max-w-2xl px-5 py-8" data-section-type={section.type}>
          <div className="space-y-4">
            {section.blocks.map((block, index) => {
              if (block.type === "text") return <p key={index} className={section.type === "hero" ? "text-[28px] font-black leading-tight" : "text-[15px] leading-6"}>{block.text}</p>;
              if (block.type === "image") return <div key={index} className="overflow-hidden rounded-2xl bg-[#F7F8FC] p-8 text-center text-xs text-[#9CA3AF]" data-asset-id={block.assetId}>{block.alt || "Image"}</div>;
              if (block.type === "testimonial") return <blockquote key={index} className="rounded-2xl bg-[#F7F8FC] p-5"><p className="text-[15px] leading-6">“{block.quote}”</p><cite className="mt-3 block text-[12px] font-semibold not-italic" style={{ color: muted }}>{block.author}</cite></blockquote>;
              if (block.type === "faq") return <details key={index} className="rounded-2xl border border-[#EEF0F5] p-4"><summary className="cursor-pointer text-[14px] font-bold">{block.question}</summary><p className="mt-3 text-[13px] leading-5" style={{ color: muted }}>{block.answer}</p></details>;
              if (block.type === "form") return <div key={index} className="rounded-2xl border border-[#DCE5FF] bg-[#F7F8FF] p-5 text-center"><div className="text-[14px] font-black">Lead form</div><div className="mt-1 text-[12px]" style={{ color: muted }}>Connected form: {block.formId}</div></div>;
              if (block.type === "product") return <div key={index} className="rounded-2xl border border-[#EEF0F5] bg-white p-5 shadow-sm"><div className="text-[14px] font-black">Product</div><div className="mt-1 text-[12px]" style={{ color: muted }}>Connected product: {block.productId}</div></div>;
              return (
                <button
                  key={index}
                  type="button"
                  disabled={!interactive}
                  onClick={() => {
                    if (block.action.type === "url" && interactive) window.open(block.action.url, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full px-5 py-3.5 text-[14px] font-bold shadow-sm"
                  style={buttonStyle(document.theme)}
                >
                  {block.label}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
