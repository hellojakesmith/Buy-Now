import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowRight, Check, ImagePlus, Monitor, Sparkles, Smartphone, Tablet, Upload, X } from "lucide-react";
import { apiRequest, buildApiUrl } from "../lib/api";
import LandingPageBuilderStudio from "./LandingPageBuilderStudio";
import LandingPageRenderer, { type LandingPageDocument } from "./LandingPageRenderer";
import { createLandingPageDocument } from "./landingBuilder";

type CreatedPage = { _id: string; name: string; type: "landing" | "buy-now"; builderDocument?: LandingPageDocument; sections?: Array<{ type?: string; template?: string; formId?: string | null }> };
type LandingPageCreatedDetail = { page?: CreatedPage };
type AIBuildResponse = { document: LandingPageDocument; provider: "configured" | "fallback"; promptVersion: string };
type UploadedAsset = { id: string; name: string; url: string; alt: string };
type BuildInputs = { goal: string; audience: string; offer: string; outcome: string; price: string; cta: string; vslUrl: string; formUrl: string; templateKey: string; assets: UploadedAsset[] };

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

function sectionLabel(type: string) { return type === "social-proof" ? "Social proof" : type === "cta" ? "Call to action" : type === "faq" ? "FAQ" : type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " "); }

function attachAssets(document: LandingPageDocument, assets: UploadedAsset[], fitness: boolean) {
  if (!assets.length) return document;
  const next = structuredClone(document);
  const hero = next.sections.find((section) => section.type === "hero");
  if (hero) {
    const existingImage = hero.blocks.findIndex((block) => block.type === "image");
    const image = { type: "image" as const, assetId: `uploaded-${assets[0].id}`, src: assets[0].url, alt: assets[0].alt };
    if (existingImage >= 0) hero.blocks[existingImage] = image;
    else hero.blocks.unshift(image);
  }
  if (fitness && assets.length >= 2) {
    let proof = next.sections.find((section) => section.type === "social-proof");
    if (!proof) {
      proof = { id: "ai-transformations", type: "social-proof", visible: true, blocks: [], settings: {} };
      const heroIndex = next.sections.findIndex((section) => section.type === "hero");
      next.sections.splice(heroIndex + 1, 0, proof);
    }
    proof.blocks = [...assets.slice(1, 4).map((asset) => ({ type: "image" as const, assetId: `uploaded-${asset.id}`, src: asset.url, alt: asset.alt })), { type: "testimonial" as const, quote: "Add the real client transformation story here.", author: "Client transformation" }];
  }
  return next;
}

function AIBuildSheet({ onClose, onApply }: { onClose: () => void; onApply: (document: LandingPageDocument, provider: AIBuildResponse["provider"], inputs: BuildInputs) => void }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("fitness");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [outcome, setOutcome] = useState("");
  const [price, setPrice] = useState("");
  const [cta, setCta] = useState("");
  const [vslUrl, setVslUrl] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [templateKey, setTemplateKey] = useState("fitness-coach");
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const goalOptions = [["fitness", "🏋️ Fitness Coach", "Get coaching applications"], ["leads", "🎯 Generate Leads", "Capture qualified prospects"], ["sell", "🛍️ Sell Something", "Drive purchases"], ["book", "📅 Book Calls", "Turn visitors into appointments"]];
  const templateOptions = [["fitness-coach", "Fitness Coach"], ["coach", "Coach"], ["product-offer", "Product Offer"], ["creator-brand", "Creator Brand"]];

  async function uploadAsset(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 25 * 1024 * 1024) { setError("Images must be 25 MB or smaller."); return; }
    setUploading(true); setError(null);
    try {
      const formData = new FormData(); formData.append("file", file); formData.append("kind", "image"); formData.append("purpose", "page"); formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));
      const result = await apiRequest<{ media: { _id: string } }>("/media", { method: "POST", body: formData });
      setAssets((current) => [...current, { id: result.media._id, name: file.name, url: buildApiUrl(`/media/${result.media._id}`), alt: file.name.replace(/\.[^/.]+$/, "") }].slice(0, 6));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to upload image."); } finally { setUploading(false); }
  }

  async function generate() {
    if (!audience.trim() || !offer.trim()) { setError("Tell us who this is for and what you are offering."); setStep(2); return; }
    setLoading(true); setError(null);
    const fitness = templateKey === "fitness-coach" || goal === "fitness";
    const prompt = [`Business goal: ${goal}.`, `Audience: ${audience.trim()}.`, `Offer: ${offer.trim()}.`, outcome.trim() ? `Desired outcome: ${outcome.trim()}.` : "", price.trim() ? `Price: ${price.trim()}.` : "", cta.trim() ? `Primary CTA: ${cta.trim()}.` : "", vslUrl.trim() ? `VSL URL: ${vslUrl.trim()}. Include a VSL/video section and use this exact URL.` : "", formUrl.trim() ? `Application/lead form URL: ${formUrl.trim()}. Use this exact URL for the primary CTA.` : "", fitness ? "This is a fitness coaching funnel. Prefer hero, VSL, problem, benefits, before/after social proof, testimonials, how it works, application CTA, FAQ, and final CTA. Never invent transformation metrics or testimonials." : "Prioritize a clear conversion path, trust, benefits, objection handling, and one primary CTA.", assets.length ? `The user uploaded ${assets.length} real image asset(s). Use the uploaded assets in the generated page rather than inventing image URLs.` : "Use the template's curated starter imagery where an image is helpful."].filter(Boolean).join("\n");
    try {
      const response = await apiRequest<AIBuildResponse>("/ai/landing-page", { method: "POST", body: JSON.stringify({ prompt, templateKey }) });
      onApply(attachAssets(response.document, assets, fitness), response.provider, { goal, audience, offer, outcome, price, cta, vslUrl, formUrl, templateKey, assets });
    } catch (err) { setError(err instanceof Error ? err.message : "We couldn't generate the page. Try again."); } finally { setLoading(false); }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) { const files = Array.from(event.target.files ?? []); event.target.value = ""; void Promise.all(files.map(uploadAsset)); }

  return <div className="fixed inset-0 z-[300] flex items-end bg-black/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Build landing page with AI"><div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl"><div className="mx-auto max-w-2xl"><div className="mb-5 flex items-start justify-between gap-4"><div><div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEE9FF] px-3 py-1 text-[11px] font-black text-[#5B21B6]"><Sparkles size={13} /> AI BUILD</div><h2 className="mt-3 text-[25px] font-black leading-tight">Build your landing page for you.</h2><p className="mt-2 text-[13px] leading-5 text-[#6B7280]">Give Buy Now the goal, offer, audience, and photos you already have. We'll turn them into a conversion-focused mobile page.</p></div><button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={18} /></button></div><div className="mb-5 flex items-center gap-2">{[1,2,3].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-[#0325D9]" : "bg-[#E5E7EB]"}`} />)}</div>{step === 1 && <div className="space-y-4"><div className="text-[13px] font-black">What are you trying to accomplish?</div><div className="grid grid-cols-2 gap-2">{goalOptions.map(([value, label, description]) => <button key={value} type="button" onClick={() => { setGoal(value); if (value === "fitness") setTemplateKey("fitness-coach"); }} className={`rounded-2xl border p-4 text-left ${goal === value ? "border-[#0325D9] bg-[#F1F4FF]" : "border-[#EEF0F5] bg-white"}`}><div className="text-[13px] font-black">{label}</div><div className="mt-1 text-[11px] leading-4 text-[#6B7280]">{description}</div></button>)}</div><div><div className="text-[12px] font-black">Starting design</div><div className="mt-2 grid grid-cols-2 gap-2">{templateOptions.map(([value, label]) => <button key={value} type="button" onClick={() => setTemplateKey(value)} className={`rounded-xl border px-3 py-3 text-left text-[12px] font-bold ${templateKey === value ? "border-[#0325D9] bg-[#F1F4FF] text-[#0325D9]" : "border-[#EEF0F5] bg-white text-[#374151]"}`}>{templateKey === value && <Check size={14} className="mb-1" />}{label}</button>)}</div></div><button type="button" onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white">Continue <ArrowRight size={17} /></button></div>}{step === 2 && <div className="space-y-4"><div><div className="text-[12px] font-black">Who is this for?</div><input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Women 30+ who want sustainable weight loss" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[14px] outline-none focus:border-[#0325D9]" /></div><div><div className="text-[12px] font-black">What are you offering?</div><input value={offer} onChange={(event) => setOffer(event.target.value)} placeholder="An 8-week personalized fitness coaching program" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[14px] outline-none focus:border-[#0325D9]" /></div><div><div className="text-[12px] font-black">What result should they expect? <span className="font-normal text-[#9CA3AF]">optional</span></div><input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="Feel stronger, more confident, and consistent" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[14px] outline-none focus:border-[#0325D9]" /></div><div className="grid grid-cols-2 gap-3"><div><div className="text-[12px] font-black">Price <span className="font-normal text-[#9CA3AF]">optional</span></div><input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="$499" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[13px] outline-none focus:border-[#0325D9]" /></div><div><div className="text-[12px] font-black">CTA <span className="font-normal text-[#9CA3AF]">optional</span></div><input value={cta} onChange={(event) => setCta(event.target.value)} placeholder="Apply for coaching" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[13px] outline-none focus:border-[#0325D9]" /></div></div><div className="flex gap-2"><button type="button" onClick={() => setStep(1)} className="flex-1 rounded-2xl bg-[#F7F8FC] py-4 text-[13px] font-bold">Back</button><button type="button" onClick={() => setStep(3)} className="flex-[1.5] rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white">Continue <ArrowRight size={17} className="ml-1 inline" /></button></div></div>}{step === 3 && <div className="space-y-4"><div><div className="text-[13px] font-black">Add your real content</div><div className="mt-1 text-[12px] leading-5 text-[#6B7280]">Upload the photos you want on the page. Buy Now will use them instead of generic imagery.</div></div><label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] p-4"><input type="file" accept="image/*" multiple className="sr-only" disabled={uploading || assets.length >= 6} onChange={handleFileChange} /><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0325D9] shadow-sm"><Upload size={20} /></div><div className="min-w-0 flex-1"><div className="text-[13px] font-black text-[#0325D9]">Upload photos from your device</div><div className="mt-1 text-[10px] text-[#6B7280]">Up to 6 images · 25 MB each</div></div><ImagePlus size={18} className="text-[#0325D9]" /></label>{assets.length > 0 && <div className="grid grid-cols-3 gap-2">{assets.map((asset) => <div key={asset.id} className="relative overflow-hidden rounded-xl border border-[#EEF0F5] bg-[#F7F8FC]"><img src={asset.url} alt={asset.alt} className="h-24 w-full object-cover" /><button type="button" onClick={() => setAssets((current) => current.filter((item) => item.id !== asset.id))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white" aria-label={`Remove ${asset.name}`}><X size={12} /></button></div>)}</div>}<div className="grid grid-cols-2 gap-3"><div><div className="text-[12px] font-black">VSL URL <span className="font-normal text-[#9CA3AF]">optional</span></div><input value={vslUrl} onChange={(event) => setVslUrl(event.target.value)} placeholder="https://youtube.com/watch?v=..." inputMode="url" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></div><div><div className="text-[12px] font-black">Form URL <span className="font-normal text-[#9CA3AF]">optional</span></div><input value={formUrl} onChange={(event) => setFormUrl(event.target.value)} placeholder="https://.../apply" inputMode="url" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></div></div>{error && <div role="alert" className="rounded-2xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}<div className="flex gap-2"><button type="button" onClick={() => setStep(2)} className="flex-1 rounded-2xl bg-[#F7F8FC] py-4 text-[13px] font-bold">Back</button><button type="button" onClick={() => void generate()} disabled={loading || uploading} className="flex-[1.8] rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white disabled:opacity-60">{loading ? <><Sparkles size={17} className="mr-1 inline animate-pulse" /> Building your page…</> : <>✨ Build my page <ArrowRight size={17} className="ml-1 inline" /></>}</button></div></div>}</div></div></div>;
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
  const [aiSummary, setAiSummary] = useState<BuildInputs | null>(null);
  const [editorVersion, setEditorVersion] = useState(0);

  useEffect(() => {
    const handleCreated = (event: Event) => { void openBuilder((event as CustomEvent<LandingPageCreatedDetail>).detail); };
    window.addEventListener("buynow:landing-page-created", handleCreated);
    return () => window.removeEventListener("buynow:landing-page-created", handleCreated);
  });

  async function openBuilder(detail: LandingPageCreatedDetail) {
    if (!detail.page || detail.page.type !== "landing") return;
    setLoading(true); setError(null);
    try {
      const response = await apiRequest<{ page: CreatedPage }>(`/pages/${detail.page._id}`);
      const initialDocument = buildInitialDocument(response.page);
      if (!response.page.builderDocument) await apiRequest(`/pages/${response.page._id}`, { method: "PATCH", body: JSON.stringify({ builderVersion: 1, builderDocument: initialDocument }) });
      setPage(response.page); setDocument(initialDocument); setShowAI(true); setAiProvider(null); setAiSummary(null); setEditorVersion((value) => value + 1);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to open the landing page editor"); } finally { setLoading(false); }
  }

  if (!page || !document) {
    if (!loading && !error) return null;
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">{loading && <div className="text-[15px] font-bold text-[#111111]">Opening your landing page editor…</div>}{error && <><div className="text-[15px] font-bold text-[#111111]">We couldn't open the editor</div><div className="mt-2 text-[13px] leading-5 text-[#6B7280]">{error}</div><button onClick={() => setError(null)} className="mt-4 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[13px] font-bold text-white">Close</button></>}</div></div>;
  }

  const previewWidth = device === "mobile" ? "w-[390px]" : device === "tablet" ? "w-[768px] max-w-full" : "w-full max-w-[1180px]";
  const summarySections = useMemo(() => document.sections.filter((section) => section.visible).map((section) => sectionLabel(section.type)), [document]);
  return <div className="fixed inset-0 z-[100] bg-white"><LandingPageBuilderStudio key={`${page._id}-${editorVersion}`} pageId={page._id} initialDocument={document} onBack={() => { setPage(null); setDocument(null); setPreviewDocument(null); setShowAI(false); setAiProvider(null); setAiSummary(null); }} onPreview={setPreviewDocument} />{showAI && <AIBuildSheet onClose={() => setShowAI(false)} onApply={(nextDocument, provider, inputs) => { setDocument(nextDocument); setAiProvider(provider); setAiSummary(inputs); setEditorVersion((value) => value + 1); setShowAI(false); }} />}{!showAI && <button type="button" onClick={() => setShowAI(true)} className="fixed bottom-[88px] right-4 z-[160] flex items-center gap-2 rounded-full bg-[#111111] px-4 py-3 text-[12px] font-black text-white shadow-xl"><Sparkles size={15} /> Build with AI</button>}{aiSummary && !showAI && <div className="fixed left-4 right-4 top-4 z-[150] mx-auto max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-xl"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8F1] text-[#16B879]"><Check size={17} /></div><div className="min-w-0 flex-1"><div className="text-[13px] font-black">Your page is ready</div><div className="mt-1 text-[11px] leading-4 text-[#6B7280]">Built for {aiSummary.audience}. {aiSummary.assets.length ? `${aiSummary.assets.length} of your photos were added.` : "Starter imagery was used."}</div><div className="mt-2 flex flex-wrap gap-1.5">{summarySections.slice(0, 7).map((item) => <span key={item} className="rounded-full bg-[#F7F8FC] px-2 py-1 text-[9px] font-bold text-[#6B7280]">{item}</span>)}</div></div><button type="button" onClick={() => setAiSummary(null)} className="text-[#9CA3AF]" aria-label="Dismiss"><X size={15} /></button></div></div>}{previewDocument && <div className="fixed inset-0 z-[200] flex flex-col bg-[#111111]/70 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Landing page preview"><header className="mx-auto flex w-full max-w-[1180px] shrink-0 items-center justify-between rounded-t-2xl bg-white px-4 py-3 shadow-sm"><div><div className="text-[15px] font-black">Preview</div><div className="text-[11px] text-[#9CA3AF]">{page.name} · current edits</div></div><div className="flex items-center gap-1 rounded-xl bg-[#F7F8FC] p-1">{([['mobile', Smartphone], ['tablet', Tablet], ['desktop', Monitor]] as const).map(([key, Icon]) => <button key={key} type="button" onClick={() => setDevice(key)} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold ${device === key ? "bg-white text-[#111111] shadow-sm" : "text-[#6B7280]"}`}><Icon size={14} />{key[0].toUpperCase() + key.slice(1)}</button>)}<button type="button" onClick={() => setPreviewDocument(null)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white" aria-label="Close preview"><X size={17} /></button></div></header><div className="min-h-0 flex-1 overflow-auto bg-[#ECEEF3] p-3 sm:p-8"><div className={`mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-all ${previewWidth}`}><LandingPageRenderer document={previewDocument} interactive /></div></div><footer className="mx-auto w-full max-w-[1180px] shrink-0 rounded-b-2xl border-t border-[#EEF0F5] bg-white px-4 py-2.5 text-center text-[11px] font-semibold text-[#6B7280]">Live preview · unsaved changes included · switch devices to check responsive presentation</footer></div>}</div>;
}
