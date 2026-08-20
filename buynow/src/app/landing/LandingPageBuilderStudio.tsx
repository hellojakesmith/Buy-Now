import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Link2,
  MessageSquareQuote,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  Type,
  X,
  FormInput,
  HelpCircle,
} from "lucide-react";
import { apiRequest } from "../lib/api";
import type { LandingPageDocument } from "./LandingPageRenderer";

type Section = LandingPageDocument["sections"][number];
type Block = Section["blocks"][number];

type Props = {
  pageId: string;
  initialDocument: LandingPageDocument;
  onBack: () => void;
  onPreview: () => void;
};

type SectionType = Section["type"];

const SECTION_LIBRARY: Array<{ type: SectionType; label: string; description: string }> = [
  { type: "hero", label: "Hero", description: "Headline, supporting copy and your primary action" },
  { type: "benefits", label: "Benefits", description: "Explain the outcomes and value" },
  { type: "social-proof", label: "Social proof", description: "Testimonials and trust signals" },
  { type: "offer", label: "Offer", description: "Present your offer and value" },
  { type: "faq", label: "FAQ", description: "Answer common objections" },
  { type: "form", label: "Lead form", description: "Connect a lead capture form" },
  { type: "product", label: "Product", description: "Show a product or offer" },
  { type: "cta", label: "CTA", description: "Give visitors one clear next action" },
  { type: "footer", label: "Footer", description: "Contact and brand details" },
];

function sectionLabel(type: SectionType) {
  return SECTION_LIBRARY.find((item) => item.type === type)?.label ?? "Section";
}

function iconForSection(type: SectionType) {
  if (type === "hero" || type === "benefits") return <Type size={18} />;
  if (type === "social-proof") return <MessageSquareQuote size={18} />;
  if (type === "faq") return <HelpCircle size={18} />;
  if (type === "form") return <FormInput size={18} />;
  if (type === "product" || type === "offer") return <ShoppingBag size={18} />;
  if (type === "cta") return <MousePointerClick size={18} />;
  return <ImageIcon size={18} />;
}

function makeId(type: string) {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultBlock(type: SectionType): Block {
  if (type === "hero") return { type: "text", text: "Your headline goes here" };
  if (type === "benefits") return { type: "text", text: "Show visitors the outcomes they can expect." };
  if (type === "social-proof") return { type: "testimonial", quote: "Add a real customer result here.", author: "Customer name" };
  if (type === "faq") return { type: "faq", question: "What should visitors know before they take the next step?", answer: "Answer the most important question clearly and honestly." };
  if (type === "cta") return { type: "button", label: "Get started", action: { type: "url", url: "https://example.com" } };
  if (type === "form") return { type: "form", formId: "" };
  if (type === "product" || type === "offer") return { type: "product", productId: "" };
  return { type: "text", text: "Add content here" };
}

function makeSection(type: SectionType): Section {
  return { id: makeId(type), type, visible: true, blocks: [defaultBlock(type)], settings: {} };
}

export default function LandingPageBuilderStudio({ pageId, initialDocument, onBack, onPreview }: Props) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSection = useMemo(
    () => document.sections.find((section) => section.id === selectedId) ?? null,
    [document.sections, selectedId],
  );

  function updateDocument(updater: (current: LandingPageDocument) => LandingPageDocument) {
    setDocument((current) => updater(current));
    setSavedAt(null);
  }

  function updateSection(sectionId: string, updater: (section: Section) => Section) {
    updateDocument((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === sectionId ? updater(section) : section),
    }));
  }

  function updateBlock(sectionId: string, blockIndex: number, updater: (block: Block) => Block) {
    updateSection(sectionId, (section) => ({
      ...section,
      blocks: section.blocks.map((block, index) => index === blockIndex ? updater(block) : block),
    }));
  }

  function addBlock(sectionId: string, block: Block) {
    updateSection(sectionId, (section) => ({ ...section, blocks: [...section.blocks, block] }));
  }

  function addSection(type: SectionType) {
    const section = makeSection(type);
    updateDocument((current) => ({ ...current, sections: [...current.sections, section] }));
    setShowLibrary(false);
    setSelectedId(section.id);
  }

  function deleteSection(sectionId: string) {
    updateDocument((current) => ({ ...current, sections: current.sections.filter((section) => section.id !== sectionId) }));
    setSelectedId(null);
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    updateDocument((current) => {
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
      await apiRequest(`/pages/${pageId}`, {
        method: "PATCH",
        body: JSON.stringify({ builderVersion: document.schemaVersion, builderDocument: document }),
      });
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save page");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-28 text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#EEF0F5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Back">
            <ChevronLeft size={19} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="text-[16px] font-black">Landing Page</div>
            <div className="text-[11px] text-[#9CA3AF]">{saving ? "Saving…" : savedAt ? "Saved just now" : "Unsaved changes"}</div>
          </div>
          <button type="button" onClick={onPreview} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Preview">
            <Eye size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-4">
        <div className="mb-4 rounded-[24px] bg-gradient-to-br from-[#0325D9] to-[#7448F6] p-5 text-white shadow-[0_16px_32px_rgba(3,37,217,0.18)]">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Mobile page builder</div>
          <h1 className="mt-2 text-[24px] font-black leading-tight">Tap a section to edit it.</h1>
          <p className="mt-2 text-[13px] leading-5 text-white/80">Everything is editable from your phone. Select a section, change its content, then save or preview.</p>
        </div>

        <div className="space-y-3">
          {document.sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-[20px] border border-[#EEF0F5] bg-white p-4 shadow-sm"
              style={{ opacity: section.visible ? 1 : 0.55 }}
            >
              <div className="flex items-center gap-3">
                <GripVertical size={17} className="shrink-0 text-[#C4C9D4]" />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#0325D9]">{iconForSection(section.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-black">{sectionLabel(section.type)}</div>
                  <div className="mt-0.5 text-[11px] text-[#9CA3AF]">{section.blocks.length} block{section.blocks.length === 1 ? "" : "s"} · position {index + 1}</div>
                </div>
                <button type="button" onClick={() => setSelectedId(section.id)} className="shrink-0 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[12px] font-black text-white">Edit</button>
              </div>
              <button type="button" onClick={() => setSelectedId(section.id)} className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#F7F8FC] px-3 py-2.5 text-left">
                <span className="truncate text-[12px] text-[#6B7280]">{section.blocks.map((block) => blockSummary(block)).join(" · ")}</span>
                <ChevronRight size={15} className="ml-2 shrink-0 text-[#9CA3AF]" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setShowLibrary(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] px-4 py-4 text-[14px] font-bold text-[#0325D9]">
          <Plus size={18} /> Add section
        </button>

        {error && <div role="alert" className="mt-3 rounded-xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EEF0F5] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          <button type="button" onClick={onPreview} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F7F8FC] px-4 py-3.5 text-[13px] font-bold"><Eye size={16} /> Preview</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="flex flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[13px] font-bold text-white disabled:opacity-60"><Save size={16} /> {saving ? "Saving…" : "Save changes"}</button>
        </div>
      </div>

      {showLibrary && (
        <div className="fixed inset-0 z-[120] flex items-end bg-black/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Add section">
          <div className="max-h-[82vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-4 flex items-center justify-between">
              <div><div className="text-[18px] font-black">Add a section</div><div className="mt-1 text-[12px] text-[#6B7280]">Choose a proven building block.</div></div>
              <button type="button" onClick={() => setShowLibrary(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={17} /></button>
            </div>
            <div className="space-y-2">
              {SECTION_LIBRARY.map((item) => (
                <button key={item.type} type="button" onClick={() => addSection(item.type)} className="flex w-full items-center gap-3 rounded-2xl border border-[#EEF0F5] bg-white p-4 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#0325D9]">{iconForSection(item.type)}</div>
                  <div className="min-w-0 flex-1"><div className="text-[13px] font-black">{item.label}</div><div className="mt-0.5 text-[11px] leading-4 text-[#6B7280]">{item.description}</div></div>
                  <ChevronRight size={16} className="text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSection && (
        <SectionEditor
          section={selectedSection}
          onClose={() => setSelectedId(null)}
          onDelete={() => deleteSection(selectedSection.id)}
          onMoveUp={() => moveSection(selectedSection.id, -1)}
          onMoveDown={() => moveSection(selectedSection.id, 1)}
          onUpdate={(updater) => updateSection(selectedSection.id, updater)}
          onUpdateBlock={(index, updater) => updateBlock(selectedSection.id, index, updater)}
          onAddBlock={(block) => addBlock(selectedSection.id, block)}
        />
      )}
    </div>
  );
}

function blockSummary(block: Block) {
  if (block.type === "text") return block.text || "Text";
  if (block.type === "testimonial") return block.quote || "Testimonial";
  if (block.type === "faq") return block.question || "FAQ";
  if (block.type === "button") return block.label || "Button";
  if (block.type === "image") return block.alt || "Image";
  if (block.type === "form") return block.formId ? `Form: ${block.formId}` : "Connect a lead form";
  return block.productId ? `Product: ${block.productId}` : "Connect a product";
}

function SectionEditor({
  section,
  onClose,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onUpdateBlock,
  onAddBlock,
}: {
  section: Section;
  onClose: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (updater: (section: Section) => Section) => void;
  onUpdateBlock: (index: number, updater: (block: Block) => Block) => void;
  onAddBlock: (block: Block) => void;
}) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  return (
    <div className="fixed inset-0 z-[110] flex items-end bg-black/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Edit ${sectionLabel(section.type)}`}>
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-10 border-b border-[#EEF0F5] bg-white px-5 py-3">
          <div className="mx-auto h-1 w-10 rounded-full bg-[#D9DDE6]" />
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close editor"><X size={17} /></button>
            <div className="min-w-0 flex-1"><div className="text-[17px] font-black">Edit {sectionLabel(section.type)}</div><div className="text-[11px] text-[#9CA3AF]">Changes are kept in the page draft.</div></div>
            <button type="button" onClick={onDelete} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D64545]" aria-label="Delete section"><Trash2 size={16} /></button>
          </div>
        </div>

        <div className="space-y-3 px-5 pt-4">
          <div className="flex gap-2">
            <button type="button" onClick={onMoveUp} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#F7F8FC] px-3 py-3 text-[12px] font-semibold"><ChevronUp size={15} /> Move up</button>
            <button type="button" onClick={onMoveDown} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#F7F8FC] px-3 py-3 text-[12px] font-semibold"><ChevronDown size={15} /> Move down</button>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-[#EEF0F5] p-4">
            <div><div className="text-[13px] font-bold">Show this section</div><div className="mt-1 text-[11px] text-[#6B7280]">Hide it without deleting your work.</div></div>
            <input type="checkbox" checked={section.visible} onChange={(event) => onUpdate((current) => ({ ...current, visible: event.target.checked }))} className="h-5 w-5 accent-[#0325D9]" />
          </label>

          <div className="rounded-2xl border border-[#EEF0F5] p-4">
            <div className="mb-3 text-[13px] font-black">Content</div>
            <div className="space-y-3">
              {section.blocks.map((block, index) => (
                <BlockEditor key={`${section.id}-${index}`} block={block} onChange={(updater) => onUpdateBlock(index, updater)} onDelete={() => onUpdate((current) => ({ ...current, blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index) }))} />
              ))}
            </div>

            <button type="button" onClick={() => setShowBlockMenu((current) => !current)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9D3FF] bg-[#F4F6FF] px-3 py-3 text-[12px] font-bold text-[#0325D9]"><Plus size={15} /> Add content block</button>
            {showBlockMenu && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <BlockAddButton label="Text" onClick={() => { onAddBlock({ type: "text", text: "Add your copy here" }); setShowBlockMenu(false); }} />
                <BlockAddButton label="Button" onClick={() => { onAddBlock({ type: "button", label: "Get started", action: { type: "url", url: "https://example.com" } }); setShowBlockMenu(false); }} />
                <BlockAddButton label="Testimonial" onClick={() => { onAddBlock({ type: "testimonial", quote: "Add a customer result here.", author: "Customer name" }); setShowBlockMenu(false); }} />
                <BlockAddButton label="FAQ" onClick={() => { onAddBlock({ type: "faq", question: "What should visitors know?", answer: "Answer clearly." }); setShowBlockMenu(false); }} />
                <BlockAddButton label="Image" onClick={() => { onAddBlock({ type: "image", assetId: "", alt: "" }); setShowBlockMenu(false); }} />
                <BlockAddButton label="Form" onClick={() => { onAddBlock({ type: "form", formId: "" }); setShowBlockMenu(false); }} />
                <BlockAddButton label="Product" onClick={() => { onAddBlock({ type: "product", productId: "" }); setShowBlockMenu(false); }} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#EEF0F5] bg-[#F7F8FC] p-4">
            <div className="flex items-center gap-2 text-[12px] font-bold"><MoreHorizontal size={15} /> Advanced controls are coming to this section editor.</div>
            <div className="mt-1 text-[11px] leading-4 text-[#6B7280]">Theme, media library, AI generation, SEO, analytics and real Form/Product pickers remain part of the next CB-3 passes.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockEditor({ block, onChange, onDelete }: { block: Block; onChange: (updater: (block: Block) => Block) => void; onDelete: () => void }) {
  return (
    <div className="rounded-2xl bg-[#F7F8FC] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6B7280]">{block.type}</div>
        <button type="button" onClick={onDelete} className="text-[11px] font-bold text-[#D64545]">Remove</button>
      </div>

      {block.type === "text" && <textarea value={block.text} onChange={(event) => onChange((current) => ({ ...current, text: event.target.value }))} className="min-h-24 w-full resize-none rounded-xl border border-[#E6E8EE] bg-white p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Write your copy…" />}

      {block.type === "testimonial" && <div className="space-y-2"><textarea value={block.quote} onChange={(event) => onChange((current) => ({ ...current, quote: event.target.value }))} className="min-h-20 w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[14px]" placeholder="Customer quote" /><input value={block.author} onChange={(event) => onChange((current) => ({ ...current, author: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Customer name" /></div>}

      {block.type === "faq" && <div className="space-y-2"><input value={block.question} onChange={(event) => onChange((current) => ({ ...current, question: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px] font-semibold" placeholder="Question" /><textarea value={block.answer} onChange={(event) => onChange((current) => ({ ...current, answer: event.target.value }))} className="min-h-20 w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Answer" /></div>}

      {block.type === "button" && <div className="space-y-2"><input value={block.label} onChange={(event) => onChange((current) => ({ ...current, label: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px] font-bold" placeholder="Button label" /><div className="flex items-center gap-2 rounded-xl border border-[#E6E8EE] bg-white px-3"><Link2 size={15} className="text-[#9CA3AF]" /><input value={block.action.type === "url" ? block.action.url : ""} onChange={(event) => onChange((current) => current.type === "button" ? { ...current, action: { type: "url", url: event.target.value } } : current)} className="min-w-0 flex-1 py-3 text-[13px] outline-none" placeholder="https://your-site.com" /></div></div>}

      {block.type === "image" && <div className="space-y-2"><input value={block.assetId} onChange={(event) => onChange((current) => ({ ...current, assetId: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Media asset ID" /><input value={block.alt} onChange={(event) => onChange((current) => ({ ...current, alt: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Image description / alt text" /></div>}

      {block.type === "form" && <div className="space-y-2"><div className="text-[11px] leading-4 text-[#6B7280]">Enter an existing Lead Form ID. A visual picker will replace this field in the next integration pass.</div><input value={block.formId} onChange={(event) => onChange((current) => ({ ...current, formId: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Form ID" /></div>}

      {block.type === "product" && <div className="space-y-2"><div className="text-[11px] leading-4 text-[#6B7280]">Enter an existing Product ID. A visual product picker will replace this field in the next integration pass.</div><input value={block.productId} onChange={(event) => onChange((current) => ({ ...current, productId: event.target.value }))} className="w-full rounded-xl border border-[#E6E8EE] bg-white p-3 text-[13px]" placeholder="Product ID" /></div>}
    </div>
  );
}

function BlockAddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-xl border border-[#EEF0F5] bg-white px-3 py-3 text-[12px] font-bold text-[#374151]">{label}</button>;
}
