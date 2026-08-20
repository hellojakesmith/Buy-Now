import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../lib/api";
import LandingPageBuilderStudio from "./LandingPageBuilderStudio";
import LandingPageRenderer, { type LandingPageDocument } from "./LandingPageRenderer";
import { createLandingPageDocument } from "./landingBuilder";

type CreatedPage = { _id: string; name: string; type: "landing" | "buy-now"; builderDocument?: LandingPageDocument; sections?: Array<{ type?: string; template?: string; formId?: string | null }> };
type LandingPageCreatedDetail = { page?: CreatedPage };
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

export default function LandingPageBuilderHost() {
  const [page, setPage] = useState<CreatedPage | null>(null);
  const [document, setDocument] = useState<LandingPageDocument | null>(null);
  const [previewDocument, setPreviewDocument] = useState<LandingPageDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function openBuilder(detail: LandingPageCreatedDetail) {
      if (!detail.page || detail.page.type !== "landing") return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest<{ page: CreatedPage }>(`/pages/${detail.page._id}`);
        const initialDocument = buildInitialDocument(response.page);
        if (!response.page.builderDocument) {
          await apiRequest(`/pages/${response.page._id}`, { method: "PATCH", body: JSON.stringify({ builderVersion: 1, builderDocument: initialDocument }) });
        }
        setPage(response.page);
        setDocument(initialDocument);
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

  return <div className="fixed inset-0 z-[100] bg-white">
    <LandingPageBuilderStudio pageId={page._id} initialDocument={document} onBack={() => { setPage(null); setDocument(null); setPreviewDocument(null); }} onPreview={setPreviewDocument} />
    {previewDocument && <div className="fixed inset-0 z-[200] bg-[#111111]/60 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Landing page preview">
      <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-[#EEF0F5] bg-white px-4 py-3">
          <div><div className="text-[15px] font-black">Live preview</div><div className="text-[11px] text-[#9CA3AF]">{page.name}</div></div>
          <button type="button" onClick={() => setPreviewDocument(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]" aria-label="Close preview"><X size={17} /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto"><LandingPageRenderer document={previewDocument} interactive /></div>
        <div className="shrink-0 border-t border-[#EEF0F5] bg-white px-4 py-3 text-center text-[11px] font-semibold text-[#6B7280]">Previewing your current edits — unsaved changes are included.</div>
      </div>
    </div>}
  </div>;
}
