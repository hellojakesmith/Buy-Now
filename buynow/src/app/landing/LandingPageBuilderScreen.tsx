import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, GripVertical, MoreHorizontal, Plus, Save, Sparkles, Trash2, Type, Image as ImageIcon, MessageSquareQuote, HelpCircle, FormInput, ShoppingBag, MousePointerClick } from "lucide-react";
import { apiRequest } from "../lib/api";

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

type SectionType = "hero" | "content" | "benefits" | "social-proof" | "offer" | "faq" | "form" | "product" | "cta" | "footer" | "custom";

type Section = {
  id: string;
  type: SectionType;
  visible: boolean;
  blocks: Block[];
  settings: Record<string, unknown>;
};

type BuilderDocument = {
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

type Props = {
  pageId: string;
  initialDocument: BuilderDocument;
  onBack: () => void;
  onPreview: () => void;
};

const SECTION_LIBRARY: Array<{ type: SectionType; label: string; description: string }> = [
  { type: "hero", label: "Hero", description: "Headline, supporting copy and primary CTA" },
  { type: "benefits", label: "Benefits", description: "Explain why the offer matters" },
  { type: "social-proof", label: "Social proof", description: "Testimonials and trust signals" },
  { type: "offer", label: "Offer", description: "Present the offer and value" },
  { type: "faq", label: "FAQ", description: "Answer purchase objections" },
  { type: "form", label: "Lead form", description: "Connect an existing form" },
  { type: "product", label: "Product", description: "Connect an existing product" },
  { type: "cta", label: "CTA", description: "One clear next action" },
  { type: "footer", label: "Footer", description: "Contact and brand details" },
];

function sectionTitle(type: SectionType) {
  return SECTION_LIBRARY.find((item) => item.type === type)?.label ?? "Section";
}

function defaultBlock(type: SectionType): Block {
  if (type === "hero") return { type: "text", text: "Your headline goes here" };
  if (type === "benefits") return { type: "text", text: "Show your audience the outcomes they can expect." };
  if (type === "social-proof") return { type: "testimonial", quote: "Add a real customer result here.", author: "Customer name" };
  if (type === "faq") return { type: "faq", question: "What should customers know?", answer: "Answer the most important question clearly." };
  if (type === "cta") return { type: "button", label: "Get started", action: { type: "url", url: "https://example.com" } };
  return { type: "text", text: "Add content here" };
}

function makeSection(type: SectionType): Section {
  return { id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, visible: true, blocks: [defaultBlock(type)], settings: {} };
}

export default function LandingPageBuilderScreen({ pageId, initialDocument, onBack, onPreview }: Props) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(initialDocument.sections[0]?.id ?? null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSection = useMemo(
    () => document.sections.find((section) => section.id === selectedSectionId) ?? null,
    [document.sections, selectedSectionId],
  );

  function updateSection(sectionId: string, update: (section: Section) => Section) {
    setDocument((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === sectionId ? update(section) : section),
    }));
  }

  function addSection(type: SectionType) {
    const next = makeSection(type);
    setDocument((current) => ({ ...current, sections: [...current.sections, next] }));
    setSelectedSectionId(next.id);
    setShowLibrary(false);
  }

  function removeSection(sectionId: string) {
    setDocument((current) => ({ ...current, sections: current.sections.filter((section) => section.id !== sectionId) }));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    setDocument((current) => {
      const index = current.sections.findIndex((section) => section.id === sectionId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.sections.length) return current;
      const sections = [...current.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...current, sections };
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await apiRequest(`/pages/${pageId}`, { method: "PATCH", body: JSON.stringify({ builderVersion: 1, builderDocument: document }) });
      setSavedAt(Date.now());
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save page");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-28 text-[#111111]">
      <div className="sticky top-0 z-40 border-b border-[#EEF0F5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Back">
            <ChevronLeft size={19} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="text-[16px] font-black">Landing Page</div>
            <div className="text-[11px] text-[#9CA3AF]">{saving ? "Saving…" : savedAt ? "Saved just now" : "Draft"}</div>
          </div>
          <button onClick={onPreview} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Preview">
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="mb-4 rounded-[24px] bg-gradient-to-br from-[#0325D9] to-[#7448F6] p-5 text-white shadow-[0_16px_32px_rgba(3,37,217,0.18)]">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70"><Sparkles size={14} /> Mobile page builder</div>
          <div className="mt-2 text-[24px] font-black leading-tight">Build a polished page without a desktop canvas.</div>
          <div className="mt-2 text-[13px] leading-5 text-white/80">Edit one section at a time, connect real forms or products, then preview and publish.</div>
        </div>

        <div className="space-y-3">
          {document.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setSelectedSectionId(section.id)}
              className="w-full rounded-[20px] border bg-white p-4 text-left shadow-sm"
              style={{ borderColor: selectedSectionId === section.id ? "#0325D9" : "#EEF0F5", opacity: section.visible ? 1 : 0.55 }}
            >
              <div className="flex items-center gap-3">
                <GripVertical size={17} className="text-[#C4C9D4]" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#0325D9]">
                  {section.type === "hero" ? <Type size={18} /> : section.type === "form" ? <FormInput size={18} /> : section.type === "product" ? <ShoppingBag size={18} /> : section.type === "social-proof" ? <MessageSquareQuote size={18} /> : section.type === "faq" ? <HelpCircle size={18} /> : section.type === "cta" ? <MousePointerClick size={18} /> : <ImageIcon size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-black">{sectionTitle(section.type)}</div>
                  <div className="mt-0.5 text-[11px] text-[#9CA3AF]">{section.blocks.length} content block{section.blocks.length === 1 ? "" : "s"} · position {index + 1}</div>
                </div>
                <ChevronRight size={17} className="text-[#9CA3AF]" />
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => setShowLibrary(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] px-4 py-4 text-[14px] font-bold text-[#0325D9]">
          <Plus size={18} /> Add section
        </button>

        {selectedSection && (
          <div className="mt-4 rounded-[22px] border border-[#EEF0F5] bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-black">{sectionTitle(selectedSection.type)}</div>
                <div className="text-[11px] text-[#9CA3AF]">Focused mobile editing</div>
              </div>
              <button onClick={() => removeSection(selectedSection.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D64545]" aria-label="Delete section"><Trash2 size={16} /></button>
            </div>

            {selectedSection.blocks.map((block, blockIndex) => (
              <div key={`${selectedSection.id}-${blockIndex}`} className="rounded-[16px] bg-[#F7F8FC] p-3">
                {block.type === "text" && (
                  <textarea
                    value={block.text}
                    onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "text" ? { ...item, text: event.target.value } : item) }))}
                    className="min-h-24 w-full resize-none rounded-xl border border-[#E6E8EE] bg-white p-3 text-[14px] outline-none focus:border-[#0325D9]"
                    placeholder="Write your copy…"
                  />
                )}
                {block.type === "testimonial" && (
                  <div className="space-y-2">
                    <textarea value={block.quote} onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "testimonial" ? { ...item, quote: event.target.value } : item) }))} className="min-h-20 w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[14px]" placeholder="Customer quote" />
                    <input value={block.author} onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "testimonial" ? { ...item, author: event.target.value } : item) }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Customer name" />
                  </div>
                )}
                {block.type === "faq" && (
                  <div className="space-y-2">
                    <input value={block.question} onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "faq" ? { ...item, question: event.target.value } : item) }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px] font-semibold" placeholder="Question" />
                    <textarea value={block.answer} onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "faq" ? { ...item, answer: event.target.value } : item) }))} className="min-h-20 w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Answer" />
                  </div>
                )}
                {block.type === "button" && (
                  <input value={block.label} onChange={(event) => updateSection(selectedSection.id, (section) => ({ ...section, blocks: section.blocks.map((item, index) => index === blockIndex && item.type === "button" ? { ...item, label: event.target.value } : item) }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px] font-bold" placeholder="Button label" />
                )}
                {block.type !== "text" && block.type !== "testimonial" && block.type !== "faq" && block.type !== "button" && (
                  <div className="flex items-center gap-2 text-[12px] text-[#6B7280]"><MoreHorizontal size={15} /> Connect this block from the next configuration step.</div>
                )}
              </div>
            ))}

            <div className="mt-3 flex gap-2">
              <button onClick={() => moveSection(selectedSection.id, -1)} className="flex-1 rounded-xl bg-[#F7F8FC] px-3 py-3 text-[12px] font-semibold">Move up</button>
              <button onClick={() => moveSection(selectedSection.id, 1)} className="flex-1 rounded-xl bg-[#F7F8FC] px-3 py-3 text-[12px] font-semibold">Move down</button>
            </div>
          </div>
        )}

        {error && <div className="mt-3 rounded-xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EEF0F5] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button onClick={() => void save()} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#F7F8FC] px-4 py-3.5 text-[14px] font-bold disabled:opacity-50"><Save size={17} /> {saving ? "Saving…" : "Save draft"}</button>
          <button onClick={onPreview} className="flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-[#0325D9] px-4 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(3,37,217,0.22)]"><Eye size={17} /> Preview</button>
        </div>
      </div>

      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowLibrary(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] bg-white p-5 pb-8" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E5E7EB]" />
            <div className="mb-4 text-[20px] font-black">Add a section</div>
            <div className="space-y-2">
              {SECTION_LIBRARY.map((item) => (
                <button key={item.type} onClick={() => addSection(item.type)} className="w-full rounded-[18px] border border-[#EEF0F5] bg-[#FAFBFF] p-4 text-left">
                  <div className="text-[14px] font-black">{item.label}</div>
                  <div className="mt-1 text-[12px] text-[#6B7280]">{item.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
