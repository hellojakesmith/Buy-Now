import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import LandingPageBuilderStudio from "./LandingPageBuilderStudio";
import LandingPageTemplatePreview from "./LandingPageTemplatePreview";
import { createLandingPageDocument } from "./landingBuilder";
import type { LandingPageDocument } from "./LandingPageRenderer";

type CreatedPage = {
  _id: string;
  name: string;
  type: "landing" | "buy-now";
  builderDocument?: LandingPageDocument;
  sections?: Array<{ type?: string; template?: string; formId?: string | null }>;
};

type LandingPageCreatedDetail = { page?: CreatedPage };

function templateKeyForPage(page: CreatedPage): Parameters<typeof createLandingPageDocument>[0] {
  const template = page.sections?.find((section) => section.type === "hero")?.template;
  const mapping: Record<string, Parameters<typeof createLandingPageDocument>[0]> = {
    hero: "agency",
    consultation: "service-business",
    launch: "creator-brand",
    local: "local-business",
    creator: "creator-brand",
    coach: "coach",
    agency: "agency",
    service: "service-business",
    magnet: "lead-magnet",
    waitlist: "waitlist",
    product: "product-offer",
  };
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
  const [previewOpen, setPreviewOpen] = useState(false);
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
        setPreviewOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open the landing page editor");
      } finally {
        setLoading(false);
      }
    }

    const handleCreated = (event: Event) => { void openBuilder((event as CustomEvent<LandingPageCreatedDetail>).detail); };
    window.addEventListener("buynow:landing-page-created", handleCreated);
    return () => window.removeEventListener("buynow:landing-page-created", handleCreated);
  }, []);

  if (!page || !document) {
    if (!loading && !error) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">
          {loading && <div className="text-[15px] font-bold text-[#111111]">Opening your landing page editor…</div>}
          {error && <><div className="text-[15px] font-bold text-[#111111]">We couldn't open the editor</div><div className="mt-2 text-[13px] leading-5 text-[#6B7280]">{error}</div><button onClick={() => setError(null)} className="mt-4 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[13px] font-bold text-white">Close</button></>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-white">
        <LandingPageBuilderStudio
          pageId={page._id}
          initialDocument={document}
          onBack={() => { setPage(null); setDocument(null); setPreviewOpen(false); }}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>
      {previewOpen && <LandingPageTemplatePreview document={document} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
