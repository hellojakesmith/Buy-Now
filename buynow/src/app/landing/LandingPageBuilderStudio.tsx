import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, GripVertical, Image as ImageIcon, Link2, MessageSquareQuote, MousePointerClick, Plus, Save, ShoppingBag, Trash2, Type, X, FormInput, HelpCircle, Check, RefreshCw, Upload, Video } from "lucide-react";
import { apiRequest, buildApiUrl } from "../lib/api";
import type { LandingPageDocument } from "./LandingPageRenderer";
import { getTemplateMedia, type TemplateMediaAsset } from "./templateMedia";

type Section = LandingPageDocument["sections"][number];
type Block = Section["blocks"][number];
type Props = { pageId: string; initialDocument: LandingPageDocument; onBack: () => void; onPreview: (document: LandingPageDocument) => void };
type SectionType = Section["type"];
type ImageTarget = { kind: "block"; sectionId: string; blockIndex: number } | { kind: "background"; sectionId: string };

const SECTION_LIBRARY: Array<{ type: SectionType; label: string; description: string }> = [
  { type: "hero", label: "Hero", description: "Headline, supporting copy, image and primary action" },
  { type: "vsl", label: "VSL", description: "Video sales letter or sales video" },
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
  if (type === "vsl") return <Video size={18} />;
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
  if (type === "vsl") return { type: "text", text: "Watch the video to see how it works." };
  if (type === "benefits") return { type: "text", text: "Show visitors the outcomes they can expect." };
  if (type === "social-proof") return { type: "testimonial", quote: "Add a real customer result here.", author: "Customer name" };
  if (type === "faq") return { type: "faq", question: "What should visitors know before they take the next step?", answer: "Answer the most important question clearly and honestly." };
  if (type === "cta") return { type: "button", label: "Get started", action: { type: "url", url: "https://example.com" } };
  if (type === "form") return { type: "form", formId: "" };
  if (type === "product" || type === "offer") return { type: "product", productId: "" };
  return { type: "text", text: "Add content here" };
}

function makeSection(type: SectionType): Section {
  return {
    id: makeId(type),
    type,
    visible: true,
    blocks: [defaultBlock(type)],
    settings: type === "vsl" ? { videoUrl: "" } : {},
  };
}

export default function LandingPageBuilderStudio({ pageId, initialDocument, onBack, onPreview }: Props) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSection = useMemo(() => document.sections.find((section) => section.id === selectedId) ?? null, [document.sections, selectedId]);
  const templateKey = document.metadata.templateKey ?? "creator-brand";

  function updateDocument(updater: (current: LandingPageDocument) => LandingPageDocument) {
    setDocument((current) => updater(current));
    setSavedAt(null);
  }

  function updateSection(sectionId: string, updater: (section: Section) => Section) {
    updateDocument((current) => ({ ...current, sections: current.sections.map((section) => section.id === sectionId ? updater(section) : section) }));
  }

  function updateBlock(sectionId: string, blockIndex: number, updater: (block: Block) => Block) {
    updateSection(sectionId, (section) => ({ ...section, blocks: section.blocks.map((block, index) => index === blockIndex ? updater(block) : block) }));
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

  function applyImage(asset: TemplateMediaAsset) {
    if (!imageTarget) return;
    if (imageTarget.kind === "background") {
      updateSection(imageTarget.sectionId, (section) => ({ ...section, settings: { ...section.settings, backgroundAssetId: asset.id, backgroundImageUrl: undefined } }));
    } else {
      updateBlock(imageTarget.sectionId, imageTarget.blockIndex, (block) => block.type === "image" ? { ...block, assetId: asset.id, src: undefined, alt: block.alt || asset.alt } : block);
    }
    setImageTarget(null);
  }

  function applyCustomImage(url: string) {
    if (!imageTarget) return;
    const trimmed = url.trim();
    try { new URL(trimmed); } catch { return; }
    if (imageTarget.kind === "background") {
      updateSection(imageTarget.sectionId, (section) => ({ ...section, settings: { ...section.settings, backgroundAssetId: undefined, backgroundImageUrl: trimmed } }));
    } else {
      updateBlock(imageTarget.sectionId, imageTarget.blockIndex, (block) => block.type === "image" ? { ...block, assetId: `custom-${Date.now()}`, src: trimmed } : block);
    }
    setImageTarget(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await apiRequest(`/pages/${pageId}`, { method: "PATCH", body: JSON.stringify({ builderVersion: document.schemaVersion, builderDocument: document }) });
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save page");
    } finally {
      setSaving(false);
    }
  }

  return <div className="min-h-screen bg-[#F7F8FC] pb-28 text-[#111111]">
    <header className="sticky top-0 z-40 border-b border-[#EEF0F5] bg-white/95 px-4 py-3 backdrop-blur"><div className="flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Back"><ChevronLeft size={19} /></button><div className="min-w-0 flex-1 text-center"><div className="text-[16px] font-black">Landing Page</div><div className="text-[11px] text-[#9CA3AF]">{saving ? "Saving…" : savedAt ? "Saved just now" : "Unsaved changes"}</div></div><button type="button" onClick={() => onPreview(document)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Preview"><Eye size={18} /></button></div></header>
    <main className="mx-auto max-w-2xl px-4 pt-4"><div className="mb-4 rounded-[24px] bg-gradient-to-br from-[#0325D9] to-[#7448F6] p-5 text-white shadow-[0_16px_32px_rgba(3,37,217,0.18)]"><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Mobile page builder</div><h1 className="mt-2 text-[24px] font-black leading-tight">Build your page in minutes.</h1><p className="mt-2 text-[13px] leading-5 text-white/80">Tap any section to edit it. Tap an image to replace it. Preview anytime — your changes stay live until you save.</p></div>
      <div className="space-y-3">{document.sections.map((section, index) => <div key={section.id} className="rounded-[20px] border border-[#EEF0F5] bg-white p-4 shadow-sm" style={{ opacity: section.visible ? 1 : 0.55 }}><div className="flex items-center gap-3"><GripVertical size={17} className="shrink-0 text-[#C4C9D4]" /><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#0325D9]">{iconForSection(section.type)}</div><div className="min-w-0 flex-1"><div className="text-[14px] font-black">{sectionLabel(section.type)}</div><div className="mt-0.5 text-[11px] text-[#9CA3AF]">{section.blocks.length} block{section.blocks.length === 1 ? "" : "s"} · position {index + 1}</div></div><button type="button" onClick={() => setSelectedId(section.id)} className="shrink-0 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[12px] font-black text-white">Edit</button></div><button type="button" onClick={() => setSelectedId(section.id)} className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#F7F8FC] px-3 py-2.5 text-left"><span className="truncate text-[12px] text-[#6B7280]">{section.blocks.map((block) => blockSummary(block)).join(" · ")}</span><ChevronRight size={15} className="ml-2 shrink-0 text-[#9CA3AF]" /></button></div>)}</div>
      <button type="button" onClick={() => setShowLibrary(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] px-4 py-4 text-[14px] font-bold text-[#0325D9]"><Plus size={18} /> Add section</button>{error && <div role="alert" className="mt-3 rounded-xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}</main>
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EEF0F5] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur"><div className="mx-auto flex max-w-2xl gap-2"><button type="button" onClick={() => onPreview(document)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F7F8FC] px-4 py-3.5 text-[13px] font-bold"><Eye size={16} /> Preview</button><button type="button" onClick={() => void save()} disabled={saving} className="flex flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[13px] font-bold text-white disabled:opacity-60"><Save size={16} /> {saving ? "Saving…" : "Save changes"}</button></div></div>
    {showLibrary && <SectionLibrary onClose={() => setShowLibrary(false)} onSelect={addSection} />}{selectedSection && <SectionEditor section={selectedSection} onClose={() => setSelectedId(null)} onDelete={() => deleteSection(selectedSection.id)} onMoveUp={() => moveSection(selectedSection.id, -1)} onMoveDown={() => moveSection(selectedSection.id, 1)} onUpdate={(updater) => updateSection(selectedSection.id, updater)} onUpdateBlock={(index, updater) => updateBlock(selectedSection.id, index, updater)} onAddBlock={(block) => addBlock(selectedSection.id, block)} onImage={(target) => setImageTarget(target)} />}{imageTarget && <MediaPickerSheet templateKey={templateKey} onClose={() => setImageTarget(null)} onSelectStarter={applyImage} onUseUrl={applyCustomImage} />}
  </div>;
}

function SectionLibrary({ onClose, onSelect }: { onClose: () => void; onSelect: (type: SectionType) => void }) {
  return <div className="fixed inset-0 z-[120] flex items-end bg-black/35 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Add section"><div className="max-h-[82vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"><div className="mb-4 flex items-center justify-between"><div><div className="text-[18px] font-black">Add a section</div><div className="mt-1 text-[12px] text-[#6B7280]">Choose a proven building block.</div></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={17} /></button></div><div className="space-y-2">{SECTION_LIBRARY.map((item) => <button key={item.type} type="button" onClick={() => onSelect(item.type)} className="flex w-full items-center gap-3 rounded-2xl border border-[#EEF0F5] bg-white p-4 text-left"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9EDFF] text-[#0325D9]">{iconForSection(item.type)}</div><div className="min-w-0 flex-1"><div className="text-[13px] font-black">{item.label}</div><div className="mt-0.5 text-[11px] leading-4 text-[#6B7280]">{item.description}</div></div><ChevronRight size={16} className="text-[#9CA3AF]" /></button>)}</div></div></div>;
}

function blockSummary(block: Block) {
  if (block.type === "text") return block.text || "Text";
  if (block.type === "testimonial") return block.quote || "Testimonial";
  if (block.type === "faq") return block.question || "FAQ";
  if (block.type === "button") return block.label || "Button";
  if (block.type === "image") return block.src ? "Custom image" : block.alt || "Starter image";
  if (block.type === "form") return block.formId ? `Form: ${block.formId}` : "Connect a lead form";
  return block.productId ? `Product: ${block.productId}` : "Connect a product";
}

function SectionEditor({ section, onClose, onDelete, onMoveUp, onMoveDown, onUpdate, onUpdateBlock, onAddBlock, onImage }: { section: Section; onClose: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void; onUpdate: (updater: (section: Section) => Section) => void; onUpdateBlock: (index: number, updater: (block: Block) => Block) => void; onAddBlock: (block: Block) => void; onImage: (target: ImageTarget) => void }) {
  const update = (index: number, patch: Partial<Block>) => onUpdateBlock(index, (block) => ({ ...block, ...patch } as Block));
  const hasImage = section.blocks.some((block) => block.type === "image");
  const videoUrl = typeof section.settings.videoUrl === "string" ? section.settings.videoUrl : "";

  return <div className="fixed inset-0 z-[140] flex items-end bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"><div className="mb-4 flex items-center justify-between"><div><div className="text-[18px] font-black">Edit {sectionLabel(section.type)}</div><div className="mt-1 text-[12px] text-[#6B7280]">Make one change at a time. Preview whenever you want.</div></div><button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={17} /></button></div>
    <div className="mb-4 flex gap-2"><button onClick={onMoveUp} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#F7F8FC] py-2.5 text-[12px] font-bold"><ChevronUp size={15} /> Move up</button><button onClick={onMoveDown} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#F7F8FC] py-2.5 text-[12px] font-bold"><ChevronDown size={15} /> Move down</button><button onClick={() => onUpdate((current) => ({ ...current, visible: !current.visible }))} className="flex-1 rounded-xl bg-[#F7F8FC] py-2.5 text-[12px] font-bold">{section.visible ? "Hide" : "Show"}</button></div>
    {section.type === "hero" && <button type="button" onClick={() => onImage({ kind: "background", sectionId: section.id })} className="mb-4 flex w-full items-center justify-between rounded-2xl border border-[#DCE5FF] bg-[#F5F7FF] p-4 text-left"><span><span className="block text-[13px] font-black">Hero background</span><span className="mt-1 block text-[11px] text-[#6B7280]">Use a starter photo, upload from your device, or paste an image URL.</span></span><RefreshCw size={17} className="text-[#0325D9]" /></button>}
    {section.type === "vsl" && <div className="mb-4 rounded-2xl border border-[#DCE5FF] bg-[#F5F7FF] p-4"><div className="flex items-center gap-2 text-[13px] font-black"><Video size={16} className="text-[#0325D9]" /> Video sales letter</div><p className="mt-1 text-[11px] leading-4 text-[#6B7280]">Use a YouTube, Loom, or Vimeo URL. The shared preview will embed supported video hosts automatically.</p><input value={videoUrl} onChange={(e) => onUpdate((current) => ({ ...current, settings: { ...current.settings, videoUrl: e.target.value } }))} className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-[13px] outline-none focus:border-[#0325D9]" placeholder="https://www.loom.com/share/..." inputMode="url" /></div>}
    {section.blocks.map((block, index) => <div key={index} className="rounded-2xl border border-[#EEF0F5] p-4"><div className="mb-3 flex items-center justify-between"><div className="text-[12px] font-black text-[#6B7280]">Content {index + 1}</div>{block.type === "image" && <button type="button" onClick={() => onImage({ kind: "block", sectionId: section.id, blockIndex: index })} className="rounded-xl bg-[#E9EDFF] px-3 py-2 text-[11px] font-black text-[#0325D9]"><RefreshCw size={13} className="mr-1 inline" /> Change image</button>}</div>{block.type === "text" && <textarea value={block.text} onChange={(e) => update(index, { text: e.target.value })} rows={4} className="w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Write your copy" />}{block.type === "testimonial" && <div className="space-y-2"><textarea value={block.quote} onChange={(e) => update(index, { quote: e.target.value })} rows={3} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Customer quote" /><input value={block.author} onChange={(e) => update(index, { author: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Customer name" /></div>}{block.type === "faq" && <div className="space-y-2"><input value={block.question} onChange={(e) => update(index, { question: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] font-bold outline-none focus:border-[#0325D9]" placeholder="Question" /><textarea value={block.answer} onChange={(e) => update(index, { answer: e.target.value })} rows={3} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Answer" /></div>}{block.type === "button" && <div className="space-y-2"><input value={block.label} onChange={(e) => update(index, { label: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] font-bold outline-none focus:border-[#0325D9]" placeholder="Button label" /><div className="relative"><Link2 size={15} className="absolute left-3 top-3.5 text-[#9CA3AF]" /><input value={block.action.type === "url" ? block.action.url : ""} onChange={(e) => update(index, { action: { type: "url", url: e.target.value } })} className="w-full rounded-xl border border-[#E5E7EB] p-3 pl-9 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Button link" /></div></div>}{block.type === "image" && <div className="space-y-2"><div className="overflow-hidden rounded-xl bg-[#F7F8FC]">{block.src ? <img src={block.src} alt={block.alt} className="h-36 w-full object-cover" /> : <div className="flex h-28 items-center justify-center text-[12px] text-[#6B7280]">Starter template image</div>}</div><input value={block.alt} onChange={(e) => update(index, { alt: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Describe this image" /></div>}{block.type === "form" && <input value={block.formId} onChange={(e) => update(index, { formId: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Form ID" />}{block.type === "product" && <input value={block.productId} onChange={(e) => update(index, { productId: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-[14px] outline-none focus:border-[#0325D9]" placeholder="Product ID" />}</div>)}
    {!hasImage && (section.type === "hero" || section.type === "content" || section.type === "benefits") && <button type="button" onClick={() => onAddBlock({ type: "image", assetId: "creator-hero", alt: "" })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] py-3 text-[12px] font-bold text-[#0325D9]"><ImageIcon size={15} /> Add image</button>}
    <div className="mt-5 flex gap-2"><button onClick={onDelete} className="flex-1 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] py-3.5 text-[13px] font-bold text-[#B91C1C]"><Trash2 size={15} className="mr-1 inline" /> Delete section</button><button onClick={onClose} className="flex-1 rounded-2xl bg-[#0325D9] py-3.5 text-[13px] font-bold text-white">Done</button></div>
  </div></div>;
}

function MediaPickerSheet({ templateKey, onClose, onSelectStarter, onUseUrl }: { templateKey: string; onClose: () => void; onSelectStarter: (asset: TemplateMediaAsset) => void; onUseUrl: (url: string) => void }) {
  const [url, setUrl] = useState(""); const [error, setError] = useState<string | null>(null); const [uploading, setUploading] = useState(false); const media = getTemplateMedia(templateKey);
  function useUrl() { if (!url.trim()) return; try { new URL(url.trim()); } catch { setError("Enter a valid image URL."); return; } onUseUrl(url); }
  async function uploadFromDevice(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 25 * 1024 * 1024) { setError("Images must be 25 MB or smaller."); return; }
    setUploading(true);
    try {
      const formData = new FormData(); formData.append("file", file); formData.append("kind", "image"); formData.append("purpose", "page"); formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));
      const result = await apiRequest<{ media: { _id: string } }>("/media", { method: "POST", body: formData });
      onUseUrl(buildApiUrl(`/media/${result.media._id}`));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to upload image."); }
    finally { setUploading(false); }
  }
  return <div className="fixed inset-0 z-[180] flex items-end bg-black/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Choose image"><div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"><div className="mb-4 flex items-center justify-between"><div><div className="text-[19px] font-black">Choose an image</div><div className="mt-1 text-[12px] text-[#6B7280]">Pick a starter, upload from your device, or use an image URL.</div></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={17} /></button></div><div className="mb-5 grid grid-cols-2 gap-3"><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] p-5 text-center"><input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => { void uploadFromDevice(e.target.files?.[0]); e.currentTarget.value = ""; }} /><div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0325D9] shadow-sm"><Upload size={20} /></div><span className="mt-3 text-[13px] font-black text-[#0325D9]">Upload from device</span><span className="mt-1 text-[10px] text-[#6B7280]">JPG, PNG, WebP · up to 25 MB</span></label><button type="button" onClick={() => document.getElementById("landing-image-url")?.focus()} className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F8FC] text-[#0325D9]"><Link2 size={20} /></div><span className="mt-3 text-[13px] font-black">Use image URL</span><span className="mt-1 text-[10px] text-[#6B7280]">Paste a hosted image</span></button></div>{uploading && <div className="mb-4 rounded-2xl bg-[#F4F6FF] p-3 text-center text-[12px] font-bold text-[#0325D9]">Uploading image…</div>}{error && <div role="alert" className="mb-4 rounded-xl bg-[#FFF1F1] p-3 text-[11px] font-semibold text-[#B42318]">{error}</div>}<div className="mb-5"><div className="mb-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">Template images</div><div className="grid grid-cols-2 gap-3">{media.map((asset) => <button key={asset.id} type="button" onClick={() => onSelectStarter(asset)} className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white text-left"><img src={asset.url} alt={asset.alt} className="h-28 w-full object-cover transition-transform group-active:scale-[0.98]" /><div className="flex items-center justify-between p-3"><span className="text-[11px] font-bold capitalize">{asset.kind}</span><Check size={14} className="text-[#0325D9]" /></div></button>)}</div></div><div className="border-t border-[#EEF0F5] pt-5"><div className="mb-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#9CA3AF]">Image URL</div><div className="relative"><Link2 size={15} className="absolute left-3 top-3.5 text-[#9CA3AF]" /><input id="landing-image-url" value={url} onChange={(e) => { setUrl(e.target.value); setError(null); }} className="w-full rounded-2xl border border-[#E5E7EB] p-3 pl-9 text-[13px] outline-none focus:border-[#0325D9]" placeholder="https://example.com/image.jpg" inputMode="url" /></div><button type="button" onClick={useUrl} disabled={!url.trim() || uploading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0325D9] py-3.5 text-[13px] font-black text-white disabled:opacity-40">Use this image <ChevronRight size={16} /></button><p className="mt-3 text-center text-[10px] leading-4 text-[#9CA3AF]">Uploaded images are saved to your workspace. URL images remain linked to the URL you provide.</p></div></div></div>;
}
