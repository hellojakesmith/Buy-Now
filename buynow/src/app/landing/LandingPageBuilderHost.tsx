import { useEffect, useState } from "react";
import { ArrowRight, Check, Monitor, Sparkles, Smartphone, Tablet, X, Zap } from "lucide-react";
import { apiRequest } from "../lib/api";
import LandingPageBuilderStudio from "./LandingPageBuilderStudio";
import LandingPageRenderer, { type LandingPageDocument } from "./LandingPageRenderer";
import { createLandingPageDocument } from "./landingBuilder";

type CreatedPage = { _id: string; name: string; type: "landing" | "buy-now"; builderDocument?: LandingPageDocument; sections?: Array<{ type?: string; template?: string; formId?: string | null }> };
type LandingPageCreatedDetail = { page?: CreatedPage };
type AIBuildResponse = { document: LandingPageDocument; provider: "configured" | "fallback"; promptVersion: string };

function templateKeyForPage(page: CreatedPage): Parameters<typeof createLandingPageDocument>[0] {
  const template = page.sections?.find((section) => section.type === "hero")?.template;
  const mapping: Record<string, Parameters<typeof createLandingPageDocument>[0]> = { hero: "agency", consultation: "service-business", launch: "creator-brand", local: "local-business" };
  return mapping[template ?? ""] ?? "creator-brand";
}

function buildInitialDocument(page: CreatedPage): LandingPageDocument {
  if (page.builderDocument) return page.builderDocument;
  const document = createLandingPageDocument(templateKeyForPage(page));
  const formId = page.sections?.find((section) => section.type === "form")?.formId;
  if (formId) {
    document.sections.push({ id: "form-1", type: "form", visible: true, blocks: [{ type: "form", formId }], settings: {} });
    document.references.push({ type: "form", id: formId });
  }
  return document;
}

function AIBuildSheet({ initialTemplate, onClose, onApply }: { initialTemplate?: string; onClose: () => void; onApply: (document: LandingPageDocument, provider: AIBuildResponse["provider"]) => void }) {
  const [prompt, setPrompt] = useState("");
  const [templateKey, setTemplateKey] = useState(initialTemplate ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quickStarts = [
    "I'm a fitness coach helping women 30+ lose weight with personalized coaching. I want applications from Instagram.",
    "I'm a consultant selling a premium service. I need a polished lead-generation page that gets visitors to book a call.",
    "I sell a digital product and want a mobile-first sales page with benefits, proof, FAQs, and a strong buy CTA.",
  ];

  async function generate() {
    if (prompt.trim().length < 10) { setError("Tell us a little more about what you are launching."); return; }
    setLoading(true); setError(null);
    try {
      const response = await apiRequest<AIBuildResponse>("/ai/landing-page", { method: "POST", body: JSON.stringify({ prompt: prompt.trim(), templateKey: templateKey || undefined }) });
      onApply(response.document, response.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't generate the page. Try again.");
    } finally { setLoading(false); }
  }

  return <div className="fixed inset-0 z-[300] flex items-end bg-black/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Build landing page with AI">
    <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div><div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEE9FF] px-3 py-1 text-[11px] font-black text-[#5B21B6]"><Sparkles size={13} /> AI BUILD</div><h2 className="mt-3 text-[25px] font-black leading-tight">Tell Buy Now what you want to launch.</h2><p className="mt-2 text-[13px] leading-5 text-[#6B7280]">We'll turn your idea into a mobile-first page you can review, edit, add photos to, and publish.</p></div><button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={18} /></button></div>
        <label className="block text-[12px] font-black text-[#111111]">What are you building?</label>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} maxLength={6000} placeholder="Example: I'm a fitness coach selling an 8-week transformation program for women 30+. I want visitors to watch my VSL and apply for coaching." className="mt-2 w-full resize-none rounded-[20px] border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[14px] leading-6 outline-none focus:border-[#0325D9]" />
        <div className="mt-3 flex flex-wrap gap-2">{quickStarts.map((item) => <button key={item} type="button" onClick={() => setPrompt(item)} className="rounded-full border border-[#E4E7EF] bg-white px-3 py-2 text-left text-[11px] font-semibold text-[#4B5563]">{item.length > 68 ? `${item.slice(0, 68)}…` : item}</button>)}</div>
        <div className="mt-5"><div className="text-[12px] font-black">Starting direction <span className="font-normal text-[#9CA3AF]">(optional)</span></div><div className="mt-2 grid grid-cols-2 gap-2">{[["", "AI chooses"], ["fitness-coach", "Fitness Coach"], ["coach", "Coach"], ["product-offer", "Product Offer"]].map(([value, label]) => <button key={value || "auto"} type="button" onClick={() => setTemplateKey(value)} className={`rounded-2xl border px-3 py-3 text-left text-[12px] font-bold ${templateKey === value ? "border-[#0325D9] bg-[#F1F4FF] text-[#0325D9]" : "border-[#EEF0F5] bg-white text-[#374151]"}`}>{templateKey === value && <Check size={14} className="mb-1" />}{label}</button>)}</div></div>
        {error && <div role="alert" className="mt-4 rounded-2xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}
        <div className="mt-5 rounded-2xl bg-[#F7F8FC] p-4"><div className="flex items-start gap-3"><Zap size={17} className="mt-0.5 text-[#7448F6]" /><div className="text-[12px] leading-5 text-[#4B5563]"><strong className="text-[#111111]">After AI builds it:</strong> review the page, tap any section to edit it, tap any image to upload from your phone or use a URL, then preview and save.</div></div></div>
        <button type="button" onClick={() => void generate()} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0325D9] px-4 py-4 text-[14px] font-black text-white shadow-[0_10px_24px_rgba(3,37,217,0.22)] disabled:opacity-60">{loading ? <><Sparkles size={17} className="animate-pulse" /> Building your page…</> : <>Build my page <ArrowRight size={17} /></>}</button>
      </div>
    </div>
  </div>;
}

export default function LandingPageBuilderHost() {
  const [page, setPage] = useState<CreatedPage | null>(null);
  const [document, setDocument] = useState<LandingPageDocument | null>(null);
  const [previewDocument, setPreviewDocument] = useState<LandingPageDocument | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIBuildResponse["provider"] | null>(null);

  useEffect(() => {
    async function openBuilder(detail: LandingPageCreatedDetail) {
      if (!detail.page || detail.page.type !== "landing") return;
      setLoading(true); setError(null);
      try {
        const response = await apiRequest<{ page: CreatedPage }>(`/pages/${detail.page._id}`);
        const initialDocument = buildInitialDocument(response.page);
        if (!response.page.builderDocument) await apiRequest(`/pages/${response.page._id}`, { method: "PATCH", body: JSON.stringify({ builderVersion: 1, builderDocument: initialDocument }) });
        setPage(response.page); setDocument(initialDocument); setShowAI(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open the landing page editor");
      } finally { setLoading(false); }
    }
    const handleCreated = (event: Event) => { void openBuilder((event as CustomEvent<LandingPageCreatedDetail>).detail); };
    window.addEventListener("buynow:landing-page-created", handleCreated);
    return () => window.removeEventListener("buynow:landing-page-created", handleCreated);
  }, []);

  if (!page || !document) {
    if (!loading && !error) return null;
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">{loading && <div className="text-[15px] font-bold text-[#111111]">Opening your landing page editor…</div>}{error && <><div className="text-[15px] font-bold text-[#111111]">We couldn't open the editor</div><div className="mt-2 text-[13px] leading-5 text-[#6B7280]">{error}</div><button onClick={() => setError(null)} className="mt-4 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[13px] font-bold text-white">Close</button></>}</div></div>;
  }

  const previewWidth = device === "mobile" ? "w-[390px]" : device === "tablet" ? "w-[768px] max-w-full" : "w-full max-w-[1180px]";
  return <div className="fixed inset-0 z-[100] bg-white">
    <LandingPageBuilderStudio pageId={page._id} initialDocument={document} onBack={() => { setPage(null); setDocument(null); setPreviewDocument(null); setShowAI(false); }} onPreview={setPreviewDocument} />
    {showAI && <AIBuildSheet initialTemplate={document.metadata.templateKey} onClose={() => setShowAI(false)} onApply={(nextDocument, provider) => { setDocument(nextDocument); setAiProvider(provider); setShowAI(false); }} />}
    {!showAI && aiProvider && <button type="button" onClick={() => setShowAI(true)} className="fixed bottom-[88px] right-4 z-[160] flex items-center gap-2 rounded-full bg-[#111111] px-4 py-3 text-[12px] font-black text-white shadow-xl"><Sparkles size={15} /> Build with AI</button>}
    {previewDocument && <div className="fixed inset-0 z-[200] flex flex-col bg-[#111111]/70 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Landing page preview"><header className="mx-auto flex w-full max-w-[1180px] shrink-0 items-center justify-between rounded-t-2xl bg-white px-4 py-3 shadow-sm"><div><div className="text-[15px] font-black">Preview</div><div className="text-[11px] text-[#9CA3AF]">{page.name} · current edits</div></div><div className="flex items-center gap-1 rounded-xl bg-[#F7F8FC] p-1">{([['mobile', Smartphone], ['tablet', Tablet], ['desktop', Monitor]] as const).map(([key, Icon]) => <button key={key} type="button" onClick={() => setDevice(key)} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold ${device === key ? "bg-white text-[#111111] shadow-sm" : "text-[#6B7280]"}`}><Icon size={14} />{key[0].toUpperCase() + key.slice(1)}</button>)}<button type="button" onClick={() => setPreviewDocument(null)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white" aria-label="Close preview"><X size={17} /></button></div></header><div className="min-h-0 flex-1 overflow-auto bg-[#ECEEF3] p-3 sm:p-8"><div className={`mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-all ${previewWidth}`}><LandingPageRenderer document={previewDocument} interactive /></div></div><footer className="mx-auto w-full max-w-[1180px] shrink-0 rounded-b-2xl border-t border-[#EEF0F5] bg-white px-4 py-2.5 text-center text-[11px] font-semibold text-[#6B7280]">Live preview · unsaved changes included · switch devices to check responsive presentation</footer></div>}
  </div>;
}
