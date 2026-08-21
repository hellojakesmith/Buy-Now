import { useEffect, useState } from "react";
import { ArrowLeft, Edit3, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { apiRequest } from "../lib/api";
import LandingPageBuilderStudio from "./LandingPageBuilderStudio";
import LandingPageRenderer, { type LandingPageDocument } from "./LandingPageRenderer";
import { normalizeLandingPageDocument } from "./landingDocument";

type CreatedPage = {
  _id: string;
  name: string;
  type: "landing" | "buy-now";
  builderDocument?: unknown;
};

type LandingPageCreatedDetail = { page?: CreatedPage };
type Device = "mobile" | "tablet" | "desktop";
type Mode = "preview" | "edit";

function previewWidth(device: Device) {
  if (device === "mobile") return "w-[390px]";
  if (device === "tablet") return "w-[768px] max-w-full";
  return "w-full max-w-[1180px]";
}

export default function LandingPageBuilderHost() {
  const [page, setPage] = useState<CreatedPage | null>(null);
  const [document, setDocument] = useState<LandingPageDocument | null>(null);
  const [mode, setMode] = useState<Mode>("preview");
  const [device, setDevice] = useState<Device>("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openBuilder(detail: LandingPageCreatedDetail) {
    if (!detail.page || detail.page.type !== "landing") return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ page: CreatedPage }>(`/pages/${detail.page._id}`);
      if (!response.page) throw new Error("The landing page could not be loaded.");

      const normalized = normalizeLandingPageDocument(response.page.builderDocument);
      if (!response.page.builderDocument) {
        await apiRequest(`/pages/${response.page._id}`, {
          method: "PATCH",
          body: JSON.stringify({ builderVersion: 1, builderDocument: normalized }),
        });
      }

      setPage(response.page);
      setDocument(normalized);
      setDevice("mobile");
      setMode("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open the landing page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleCreated = (event: Event) => {
      void openBuilder((event as CustomEvent<LandingPageCreatedDetail>).detail);
    };
    window.addEventListener("buynow:landing-page-created", handleCreated);
    return () => window.removeEventListener("buynow:landing-page-created", handleCreated);
  }, []);

  function close() {
    setPage(null);
    setDocument(null);
    setError(null);
    setMode("preview");
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F8FC] p-5">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#0325D9]" />
          <h2 className="mt-4 text-[18px] font-black text-[#111111]">Preparing your landing page</h2>
          <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">Your page was created. We are loading the preview now.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F8FC] p-5">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#B91C1C]">!</div>
          <h2 className="mt-4 text-[18px] font-black text-[#111111]">We couldn't load your landing page</h2>
          <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">{error}</p>
          <button type="button" onClick={() => setError(null)} className="mt-5 w-full rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[13px] font-black text-white">Close</button>
        </div>
      </div>
    );
  }

  if (!page || !document) return null;

  if (mode === "edit") {
    return (
      <LandingPageBuilderStudio
        key={page._id}
        pageId={page._id}
        initialDocument={document}
        onBack={() => setMode("preview")}
        onPreview={(nextDocument) => setDocument(nextDocument)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#111111]/70 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Landing page preview">
      <header className="mx-auto flex w-full max-w-[1180px] shrink-0 items-center justify-between rounded-t-2xl bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <div className="text-[15px] font-black text-[#111111]">Your landing page is ready</div>
          <div className="truncate text-[11px] text-[#9CA3AF]">{page.name} · preview</div>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-[#F7F8FC] p-1">
          {([['mobile', Smartphone], ['tablet', Tablet], ['desktop', Monitor]] as const).map(([key, Icon]) => (
            <button key={key} type="button" onClick={() => setDevice(key)} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold ${device === key ? "bg-white text-[#111111] shadow-sm" : "text-[#6B7280]"}`} aria-label={`${key} preview`}>
              <Icon size={14} />
              <span className="hidden sm:inline">{key[0].toUpperCase() + key.slice(1)}</span>
            </button>
          ))}
          <button type="button" onClick={close} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white" aria-label="Close preview"><X size={17} /></button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto bg-[#ECEEF3] p-3 sm:p-8">
        <div className={`mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-all ${previewWidth(device)}`}>
          <LandingPageRenderer document={document} interactive />
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-[1180px] shrink-0 items-center justify-between gap-3 rounded-b-2xl border-t border-[#EEF0F5] bg-white px-4 py-3">
        <button type="button" onClick={close} className="flex items-center gap-1.5 rounded-xl bg-[#F7F8FC] px-3 py-2.5 text-[12px] font-bold text-[#374151]"><ArrowLeft size={15} /> Back</button>
        <div className="hidden text-center text-[11px] font-semibold text-[#6B7280] sm:block">Preview your page, then edit any section or image.</div>
        <button type="button" onClick={() => setMode("edit")} className="flex items-center gap-1.5 rounded-xl bg-[#0325D9] px-4 py-2.5 text-[12px] font-black text-white"><Edit3 size={15} /> Edit page</button>
      </footer>
    </div>
  );
}
