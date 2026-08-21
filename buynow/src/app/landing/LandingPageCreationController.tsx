import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowRight, Check, ImagePlus, Sparkles, Upload, X } from "lucide-react";
import { apiRequest, buildApiUrl } from "../lib/api";
import type { LandingPageDocument } from "./LandingPageRenderer";

type UploadedAsset = { id: string; name: string; url: string; alt: string };
type AIBuildResponse = { document: LandingPageDocument; provider: "configured" | "fallback"; promptVersion: string };

type Goal = "fitness" | "leads" | "sell" | "book";

const GOALS: Array<{ value: Goal; label: string; description: string }> = [
  { value: "fitness", label: "🏋️ Fitness Coach", description: "Get coaching applications" },
  { value: "leads", label: "🎯 Generate Leads", description: "Capture qualified prospects" },
  { value: "sell", label: "🛍️ Sell Something", description: "Drive purchases" },
  { value: "book", label: "📅 Book Calls", description: "Turn visitors into appointments" },
];

function attachAssets(document: LandingPageDocument, assets: UploadedAsset[], fitness: boolean) {
  if (!assets.length) return document;
  const next = structuredClone(document);
  const hero = next.sections.find((section) => section.type === "hero");
  if (hero) {
    const image = { type: "image" as const, assetId: `uploaded-${assets[0].id}`, src: assets[0].url, alt: assets[0].alt };
    const index = hero.blocks.findIndex((block) => block.type === "image");
    if (index >= 0) hero.blocks[index] = image;
    else hero.blocks.unshift(image);
  }
  if (fitness && assets.length >= 2) {
    let proof = next.sections.find((section) => section.type === "social-proof");
    if (!proof) {
      proof = { id: "ai-transformations", type: "social-proof", visible: true, blocks: [], settings: {} };
      const heroIndex = next.sections.findIndex((section) => section.type === "hero");
      next.sections.splice(Math.max(0, heroIndex + 1), 0, proof);
    }
    proof.blocks = assets.slice(1, 4).map((asset) => ({ type: "image" as const, assetId: `uploaded-${asset.id}`, src: asset.url, alt: asset.alt }));
  }
  return next;
}

function addLinks(document: LandingPageDocument, formUrl: string, vslUrl: string) {
  const next = structuredClone(document);
  const primaryButton = next.sections.flatMap((section) => section.blocks).find((block) => block.type === "button");
  if (formUrl.trim() && primaryButton?.type === "button") primaryButton.action = { type: "url", url: formUrl.trim() };
  if (vslUrl.trim() && !next.sections.some((section) => section.type === "vsl")) {
    const heroIndex = next.sections.findIndex((section) => section.type === "hero");
    next.sections.splice(Math.max(0, heroIndex + 1), 0, {
      id: "ai-vsl",
      type: "vsl",
      visible: true,
      blocks: [
        { type: "text", text: "Watch the video to see how it works." },
        { type: "button", label: "Watch the VSL", action: { type: "url", url: vslUrl.trim() } },
      ],
      settings: { videoUrl: vslUrl.trim() },
    });
  }
  return next;
}

function uploadError(error: unknown) {
  return error instanceof Error ? error.message : "Unable to upload that image.";
}

export default function LandingPageCreationController() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal>("fitness");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [outcome, setOutcome] = useState("");
  const [price, setPrice] = useState("");
  const [cta, setCta] = useState("");
  const [vslUrl, setVslUrl] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let wasLandingScreen = false;
    const sync = () => {
      const heading = Array.from(document.querySelectorAll("h1,h2,h3,span"))
        .find((element) => element.textContent?.trim() === "Landing Pages");
      const onLandingScreen = Boolean(heading && (heading as HTMLElement).offsetParent !== null);
      if (onLandingScreen && !wasLandingScreen) {
        setDismissed(false);
        setVisible(true);
      }
      if (!onLandingScreen) setVisible(false);
      wasLandingScreen = onLandingScreen;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  async function uploadAsset(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 25 * 1024 * 1024) { setError("Images must be 25 MB or smaller."); return; }
    setUploading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      formData.append("purpose", "page");
      formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));
      const response = await apiRequest<{ media: { _id: string } }>("/media", { method: "POST", body: formData });
      const id = response.media._id;
      setAssets((current) => [...current, { id, name: file.name, url: buildApiUrl(`/media/${id}`), alt: file.name.replace(/\.[^/.]+$/, "") }].slice(0, 6));
    } catch (err) { setError(uploadError(err)); }
    finally { setUploading(false); }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    void Promise.all(files.map(uploadAsset));
  }

  async function build() {
    if (!audience.trim() || !offer.trim()) {
      setError("Tell us who this is for and what you are offering.");
      setStep(2);
      return;
    }
    setBuilding(true); setError(null);
    const fitness = goal === "fitness";
    const prompt = [
      `Business goal: ${goal}.`,
      `Audience: ${audience.trim()}.`,
      `Offer: ${offer.trim()}.`,
      outcome.trim() ? `Desired outcome: ${outcome.trim()}.` : "",
      price.trim() ? `Price: ${price.trim()}.` : "",
      cta.trim() ? `Primary CTA: ${cta.trim()}.` : "",
      vslUrl.trim() ? `VSL URL: ${vslUrl.trim()}. Include a VSL section and use this exact URL.` : "",
      formUrl.trim() ? `Application/lead-form URL: ${formUrl.trim()}. Use this exact URL for the primary CTA.` : "",
      fitness ? "Build a premium fitness-coach conversion page with hero, VSL, problem, benefits, before/after social proof, testimonials, how it works, application CTA, FAQ, and final CTA. Never invent metrics or testimonials." : "Build a focused mobile-first conversion page with a clear value proposition, trust, benefits, objection handling, and one primary CTA.",
      assets.length ? `The user uploaded ${assets.length} real image assets. Use them in the page rather than inventing image URLs.` : "Use the template's curated starter imagery where appropriate.",
    ].filter(Boolean).join("\n");
    try {
      const response = await apiRequest<AIBuildResponse>("/ai/landing-page", { method: "POST", body: JSON.stringify({ prompt, templateKey: fitness ? "fitness-coach" : undefined }) });
      const document = addLinks(attachAssets(response.document, assets, fitness), formUrl, vslUrl);
      const pageResponse = await apiRequest<{ page: { _id: string; name: string; type: "landing"; builderDocument: LandingPageDocument } }>("/pages", {
        method: "POST",
        body: JSON.stringify({
          name: offer.trim().slice(0, 70) || "AI Landing Page",
          type: "landing",
          status: "draft",
          builderVersion: 1,
          builderDocument: document,
          seo: { title: offer.trim().slice(0, 70) || "Landing Page", description: outcome.trim() || audience.trim() },
        }),
      });
      window.dispatchEvent(new CustomEvent("buynow:landing-page-created", { detail: { page: pageResponse.page } }));
      setVisible(false);
      setDismissed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't build your landing page. Try again.");
    } finally { setBuilding(false); }
  }

  if (!visible || dismissed) return null;

  const close = () => { setVisible(false); setDismissed(true); };
  const browseTemplates = () => close();

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-black/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create landing page">
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEE9FF] px-3 py-1 text-[11px] font-black text-[#5B21B6]"><Sparkles size={13} /> AI BUILD</div>
              <h2 className="mt-3 text-[25px] font-black leading-tight">Build your landing page for you.</h2>
              <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">Start with your goal and real content. Buy Now will choose the structure and design for you.</p>
            </div>
            <button type="button" onClick={close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close"><X size={18} /></button>
          </div>
          <div className="mb-5 flex items-center gap-2">{[1, 2, 3].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-[#0325D9]" : "bg-[#E5E7EB]"}`} />)}</div>

          {step === 1 && <div className="space-y-4">
            <div className="text-[13px] font-black">What are you trying to accomplish?</div>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((item) => <button key={item.value} type="button" onClick={() => setGoal(item.value)} className={`rounded-2xl border p-4 text-left ${goal === item.value ? "border-[#0325D9] bg-[#F1F4FF]" : "border-[#EEF0F5] bg-white"}`}><div className="text-[13px] font-black">{item.label}</div><div className="mt-1 text-[11px] leading-4 text-[#6B7280]">{item.description}</div></button>)}
            </div>
            <div className="rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4"><div className="text-[12px] font-black">No template required</div><div className="mt-1 text-[11px] leading-5 text-[#6B7280]">AI chooses the best page structure and design. You can still browse templates if you prefer a fixed starting point.</div></div>
            <button type="button" onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white">Continue <ArrowRight size={17} /></button>
            <button type="button" onClick={browseTemplates} className="w-full py-2 text-[12px] font-bold text-[#6B7280]">Browse templates instead</button>
          </div>}

          {step === 2 && <div className="space-y-4">
            {[{ label: "Who is this for?", value: audience, set: setAudience, placeholder: "Women 30+ who want sustainable weight loss" }, { label: "What are you offering?", value: offer, set: setOffer, placeholder: "An 8-week personalized fitness coaching program" }, { label: "What result should they expect?", value: outcome, set: setOutcome, placeholder: "Feel stronger, more confident, and consistent" }].map((field) => <label key={field.label} className="block"><span className="text-[12px] font-black">{field.label} <span className="font-normal text-[#9CA3AF]">optional</span></span><input value={field.value} onChange={(event) => field.set(event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-4 text-[14px] outline-none focus:border-[#0325D9]" /></label>)}
            <div className="grid grid-cols-2 gap-3"><label><span className="text-[12px] font-black">Price <span className="font-normal text-[#9CA3AF]">optional</span></span><input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="$499" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></label><label><span className="text-[12px] font-black">Primary CTA <span className="font-normal text-[#9CA3AF]">optional</span></span><input value={cta} onChange={(event) => setCta(event.target.value)} placeholder="Apply for coaching" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></label></div>
            <div className="flex gap-2"><button type="button" onClick={() => setStep(1)} className="flex-1 rounded-2xl bg-[#F7F8FC] py-4 text-[13px] font-bold">Back</button><button type="button" onClick={() => setStep(3)} className="flex-[1.5] rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white">Continue <ArrowRight size={17} className="ml-1 inline" /></button></div>
          </div>}

          {step === 3 && <div className="space-y-4">
            <div><div className="text-[13px] font-black">Add your real content</div><div className="mt-1 text-[12px] leading-5 text-[#6B7280]">Upload photos before AI builds the page so your page starts with your actual brand.</div></div>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#C9D3FF] bg-[#F4F6FF] p-4"><input type="file" accept="image/*" multiple className="sr-only" disabled={uploading || assets.length >= 6} onChange={handleFiles} /><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0325D9] shadow-sm"><Upload size={20} /></div><div className="min-w-0 flex-1"><div className="text-[13px] font-black text-[#0325D9]">Upload photos from your device</div><div className="mt-1 text-[10px] text-[#6B7280]">Up to 6 images · 25 MB each</div></div><ImagePlus size={18} className="text-[#0325D9]" /></label>
            {assets.length > 0 && <div className="grid grid-cols-3 gap-2">{assets.map((asset) => <div key={asset.id} className="relative overflow-hidden rounded-xl border border-[#EEF0F5]"><img src={asset.url} alt={asset.alt} className="h-24 w-full object-cover" /><button type="button" onClick={() => setAssets((current) => current.filter((item) => item.id !== asset.id))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white" aria-label={`Remove ${asset.name}`}><X size={12} /></button></div>)}</div>}
            <div className="grid grid-cols-2 gap-3"><label><span className="text-[12px] font-black">VSL URL <span className="font-normal text-[#9CA3AF]">optional</span></span><input value={vslUrl} onChange={(event) => setVslUrl(event.target.value)} placeholder="https://youtube.com/watch?v=..." inputMode="url" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></label><label><span className="text-[12px] font-black">Form URL <span className="font-normal text-[#9CA3AF]">optional</span></span><input value={formUrl} onChange={(event) => setFormUrl(event.target.value)} placeholder="https://.../apply" inputMode="url" className="mt-2 w-full rounded-2xl border border-[#DDE2EE] bg-[#FAFBFF] p-3.5 text-[13px] outline-none focus:border-[#0325D9]" /></label></div>
            {error && <div role="alert" className="rounded-2xl bg-[#FFF1F1] p-3 text-[12px] font-semibold text-[#B42318]">{error}</div>}
            <div className="flex gap-2"><button type="button" onClick={() => setStep(2)} className="flex-1 rounded-2xl bg-[#F7F8FC] py-4 text-[13px] font-bold">Back</button><button type="button" onClick={() => void build()} disabled={building || uploading} className="flex-[1.8] rounded-2xl bg-[#0325D9] py-4 text-[14px] font-black text-white disabled:opacity-60">{building ? <><Sparkles size={17} className="mr-1 inline animate-pulse" /> Building your page…</> : <>✨ Build my page <ArrowRight size={17} className="ml-1 inline" /></>}</button></div>
          </div>}
        </div>
      </div>
    </div>
  );
}
