import type { LandingPageDocument } from "./LandingPageRenderer";

type RawDocument = Partial<LandingPageDocument> & Record<string, unknown>;

type RawBlock = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeBlock(value: unknown): LandingPageDocument["sections"][number]["blocks"][number] {
  const block: RawBlock = isRecord(value) ? value : {};
  const type = typeof block.type === "string" ? block.type : "text";

  if (type === "image") return { type: "image", assetId: typeof block.assetId === "string" && block.assetId ? block.assetId : "creator-hero", alt: typeof block.alt === "string" ? block.alt : "", ...(typeof block.src === "string" && block.src ? { src: block.src } : {}) };
  if (type === "button") {
    const action = isRecord(block.action) ? block.action : {};
    const normalizedAction = action.type === "form" && typeof action.formId === "string" && action.formId
      ? { type: "form" as const, formId: action.formId }
      : action.type === "product" && typeof action.productId === "string" && action.productId
        ? { type: "product" as const, productId: action.productId }
        : action.type === "buy-now" && typeof action.pageId === "string" && action.pageId
          ? { type: "buy-now" as const, pageId: action.pageId }
          : { type: "url" as const, url: typeof action.url === "string" && action.url ? action.url : "https://example.com" };
    return { type: "button", label: typeof block.label === "string" && block.label ? block.label : "Get started", action: normalizedAction };
  }
  if (type === "form") return { type: "form", formId: typeof block.formId === "string" ? block.formId : "" };
  if (type === "product") return { type: "product", productId: typeof block.productId === "string" ? block.productId : "" };
  if (type === "testimonial") return { type: "testimonial", quote: typeof block.quote === "string" ? block.quote : "", author: typeof block.author === "string" ? block.author : "" };
  if (type === "faq") return { type: "faq", question: typeof block.question === "string" ? block.question : "", answer: typeof block.answer === "string" ? block.answer : "" };
  return { type: "text", text: typeof block.text === "string" ? block.text : "" };
}

function normalizeSection(value: unknown, index: number): LandingPageDocument["sections"][number] {
  const section = isRecord(value) ? value : {};
  const rawBlocks = Array.isArray(section.blocks) ? section.blocks : [];
  return { id: typeof section.id === "string" && section.id ? section.id : `section-${index + 1}`, type: typeof section.type === "string" && section.type ? section.type : "custom", visible: section.visible !== false, blocks: rawBlocks.map(normalizeBlock), settings: isRecord(section.settings) ? section.settings : {} };
}

export function normalizeLandingPageDocument(input: unknown): LandingPageDocument {
  const document = isRecord(input) ? (input as RawDocument) : {};
  const theme = isRecord(document.theme) ? document.theme : {};
  const colors = isRecord(theme.colors) ? theme.colors : {};
  const typography = isRecord(theme.typography) ? theme.typography : {};
  const buttons = isRecord(theme.buttons) ? theme.buttons : {};
  const spacing = isRecord(theme.spacing) ? theme.spacing : {};
  const radius = isRecord(theme.radius) ? theme.radius : {};
  const metadata = isRecord(document.metadata) ? document.metadata : {};
  const references = (Array.isArray(document.references) ? document.references : []).filter(isRecord).filter((reference) => ["form", "product", "page"].includes(String(reference.type)) && typeof reference.id === "string").map((reference) => ({ type: reference.type as "form" | "product" | "page", id: reference.id as string }));

  return {
    schemaVersion: 1,
    sections: (Array.isArray(document.sections) ? document.sections : []).map(normalizeSection),
    theme: {
      colors: { primary: typeof colors.primary === "string" ? colors.primary : "#0325D9", primaryText: typeof colors.primaryText === "string" ? colors.primaryText : "#FFFFFF", surface: typeof colors.surface === "string" ? colors.surface : "#FFFFFF", text: typeof colors.text === "string" ? colors.text : "#111111", muted: typeof colors.muted === "string" ? colors.muted : "#6B7280" },
      typography: { fontFamily: typeof typography.fontFamily === "string" ? typography.fontFamily : "Inter, system-ui, sans-serif" },
      buttons,
      spacing: Object.fromEntries(Object.entries(spacing).filter(([, value]) => typeof value === "number" && Number.isFinite(value))) as Record<string, number>,
      radius: Object.fromEntries(Object.entries(radius).filter(([, value]) => typeof value === "number" && Number.isFinite(value))) as Record<string, number>,
    },
    references,
    metadata: { ...(typeof metadata.templateKey === "string" ? { templateKey: metadata.templateKey } : {}), aiGenerated: metadata.aiGenerated === true, ...(typeof metadata.aiPromptVersion === "string" ? { aiPromptVersion: metadata.aiPromptVersion } : {}) },
  };
}
