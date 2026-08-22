import {
  conversionBuilderDocumentSchema,
  type ConversionBuilderDocument,
  type LandingPageConversionStrategy,
  type LandingPageDesignSpec,
} from "../schemas/conversionBuilder.js";

export type LandingPageObjective = NonNullable<LandingPageConversionStrategy["objective"]>;
export type LandingPageTrafficSource = NonNullable<LandingPageConversionStrategy["trafficSource"]>;
export type LandingPageTrafficTemperature = NonNullable<LandingPageConversionStrategy["trafficTemperature"]>;

export interface LandingPageGenerationInput {
  prompt: string;
  offer?: string;
  audience?: string;
  outcome?: string;
  objective?: LandingPageObjective;
  trafficSource?: LandingPageTrafficSource;
  trafficTemperature?: LandingPageTrafficTemperature;
  primaryCta?: string;
  price?: string;
  brandVoice?: string;
  templateKey?: string;
  adCopy?: string;
  currentDocument?: ConversionBuilderDocument;
}

export interface LandingPageStrategy {
  templateKey: string;
  strategy: LandingPageConversionStrategy;
  sectionPlan: Array<"hero" | "content" | "benefits" | "social-proof" | "vsl" | "offer" | "faq" | "form" | "product" | "cta" | "footer">;
  trustRequirements: string[];
  designDirection: string;
}

const FITNESS_TERMS = /fitness|trainer|workout|weight loss|gym|body|nutrition|6 week|challenge|transformation/i;
const COACHING_TERMS = /coach|coaching|consultant|consulting|application|apply/i;
const PRODUCT_TERMS = /product|shop|buy|purchase|price|checkout|physical product/i;
const LEAD_TERMS = /lead|download|ebook|guide|freebie|email|signup|sign up|waitlist/i;
const CALL_TERMS = /call|consultation|discovery|book/i;

function combinedText(input: LandingPageGenerationInput) {
  return [input.prompt, input.offer, input.audience, input.outcome, input.adCopy, input.templateKey]
    .filter(Boolean)
    .join(" ");
}

function inferObjective(input: LandingPageGenerationInput): LandingPageObjective {
  if (input.objective) return input.objective;
  const text = combinedText(input);
  if (PRODUCT_TERMS.test(text)) return "purchase";
  if (CALL_TERMS.test(text)) return "call";
  if (LEAD_TERMS.test(text)) return "lead";
  if (COACHING_TERMS.test(text)) return "application";
  return "lead";
}

function inferTrafficSource(input: LandingPageGenerationInput): LandingPageTrafficSource {
  if (input.trafficSource) return input.trafficSource;
  const text = combinedText(input).toLowerCase();
  if (text.includes("instagram") || text.includes("ig")) return "instagram";
  if (text.includes("facebook") || text.includes("meta")) return "facebook";
  if (text.includes("tiktok")) return "tiktok";
  if (text.includes("google") || text.includes("search")) return "google";
  return "other";
}

function inferTrafficTemperature(input: LandingPageGenerationInput): LandingPageTrafficTemperature {
  if (input.trafficTemperature) return input.trafficTemperature;
  const text = combinedText(input).toLowerCase();
  if (text.includes("existing audience") || text.includes("email list") || text.includes("existing customer")) return "existing";
  if (text.includes("retarget") || text.includes("remarketing") || text.includes("warm")) return "warm";
  return "cold";
}

function inferTemplate(input: LandingPageGenerationInput, objective: LandingPageObjective) {
  if (input.templateKey) return input.templateKey;
  const text = combinedText(input);
  if (FITNESS_TERMS.test(text)) return "fitness-coach";
  if (objective === "purchase") return "product-offer";
  if (objective === "call") return "book-a-call";
  if (objective === "application") return "coaching-application";
  if (objective === "waitlist") return "waitlist";
  return "lead-generation";
}

function buildSectionPlan(objective: LandingPageObjective, templateKey: string, hasVsl: boolean) {
  const sections: LandingPageStrategy["sectionPlan"] = ["hero"];

  if (hasVsl || templateKey === "fitness-coach") sections.push("vsl");
  sections.push("benefits", "social-proof");

  if (objective === "purchase") sections.push("offer", "product");
  if (objective === "application" || objective === "call") sections.push("content", "offer");
  if (objective === "lead" || objective === "signup" || objective === "waitlist") sections.push("content");

  sections.push("faq");
  if (objective === "purchase") sections.push("product");
  else if (objective === "lead" || objective === "signup" || objective === "waitlist") sections.push("form");
  else sections.push("cta");

  sections.push("footer");
  return [...new Set(sections)];
}

export function buildLandingPageStrategy(input: LandingPageGenerationInput): LandingPageStrategy {
  const objective = inferObjective(input);
  const trafficSource = inferTrafficSource(input);
  const trafficTemperature = inferTrafficTemperature(input);
  const templateKey = inferTemplate(input, objective);
  const text = combinedText(input);
  const hasVsl = /vsl|video|loom|youtube|video sales letter/i.test(text);

  const trustRequirements = [
    "Use only real testimonials, customer results, credentials, guarantees, and claims supplied by the entrepreneur.",
    "Make the offer, next step, and expectations clear before the primary conversion action.",
  ];

  if (trafficTemperature === "cold") trustRequirements.push("Establish credibility and explain the offer before asking for a high-friction conversion.");
  if (objective === "application" || objective === "call") trustRequirements.push("Explain who the offer is for, what happens next, and what the visitor should expect after applying or booking.");
  if (objective === "purchase") trustRequirements.push("Make price, inclusions, product value, and purchase path easy to understand without forcing visitors to hunt for details.");
  if (templateKey === "fitness-coach") trustRequirements.push("Use authentic before/after imagery and testimonials only when supplied by the coach; do not manufacture transformation claims.");

  const strategy: LandingPageConversionStrategy = {
    objective,
    trafficSource,
    trafficTemperature,
    primaryCta: input.primaryCta ?? (objective === "purchase" ? "Get started" : objective === "call" ? "Book a call" : objective === "application" ? "Apply now" : "Get started"),
    messageMatch: input.adCopy ? "Continue the ad's promise and audience context without introducing a different offer or unsupported claim." : "Keep the hero promise tightly aligned with the offer and audience supplied by the entrepreneur.",
    trustRequirements,
  };

  return {
    templateKey,
    strategy,
    sectionPlan: buildSectionPlan(objective, templateKey, hasVsl),
    trustRequirements,
    designDirection: templateKey === "fitness-coach"
      ? "Premium editorial fitness campaign: strong typography, authentic photography, energetic contrast, generous mobile spacing, and prominent transformation proof."
      : objective === "purchase"
        ? "Premium product commerce: clear product hierarchy, focused offer presentation, restrained visual system, and high-confidence purchase CTAs."
        : "Premium entrepreneur campaign: confident typography, strong visual hierarchy, generous whitespace, authentic imagery, and one dominant conversion path.",
  };
}

export function buildDesignSpec(strategy: LandingPageStrategy): LandingPageDesignSpec {
  const fitness = strategy.templateKey === "fitness-coach";
  const purchase = strategy.strategy.objective === "purchase";
  const warm = strategy.strategy.trafficTemperature !== "cold";

  return {
    version: 1,
    visualDirection: strategy.designDirection,
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      displayFontFamily: fitness ? "Inter, system-ui, sans-serif" : undefined,
      headingWeight: fitness ? 800 : 700,
      bodyWeight: 400,
      scale: fitness ? "expressive" : "balanced",
      headingLineHeight: 1.05,
      bodyLineHeight: 1.55,
      letterSpacing: fitness ? "-0.02em" : "-0.01em",
    },
    colors: fitness
      ? { primary: "#E11D48", secondary: "#111827", accent: "#F59E0B", background: "#FFFFFF", surface: "#F9FAFB", text: "#111827", mutedText: "#6B7280", inverseText: "#FFFFFF" }
      : purchase
        ? { primary: "#111827", secondary: "#374151", accent: "#2563EB", background: "#FFFFFF", surface: "#F8FAFC", text: "#111827", mutedText: "#64748B", inverseText: "#FFFFFF" }
        : { primary: "#0325D9", secondary: "#111827", accent: "#7C3AED", background: "#FFFFFF", surface: "#F8FAFC", text: "#111827", mutedText: "#64748B", inverseText: "#FFFFFF" },
    layout: {
      contentWidth: purchase ? "standard" : "wide",
      sectionSpacing: warm ? "balanced" : "airy",
      density: "balanced",
      alignment: fitness ? "mixed" : "left",
      grid: fitness ? "editorial" : "single",
      mobileStack: true,
    },
    responsive: {
      typography: {
        displaySize: { mobile: "42px", tablet: "56px", desktop: fitness ? "76px" : "68px" },
        headingSize: { mobile: "30px", tablet: "38px", desktop: "48px" },
        bodySize: { mobile: "17px", tablet: "18px", desktop: "19px" },
      },
      spacing: {
        section: { mobile: "56px", tablet: "72px", desktop: "96px" },
        container: { mobile: "20px", tablet: "32px", desktop: "48px" },
      },
      columns: { mobile: 1, tablet: 2, desktop: fitness ? 3 : 3 },
      hero: fitness ? "split" : "stacked",
      cta: "full-width",
    },
    defaultImageTreatment: {
      mode: fitness ? "editorial" : "inline",
      fit: "cover",
      aspectRatio: fitness ? "4:5" : "auto",
    },
    radius: fitness ? "soft" : "rounded",
    shadows: "subtle",
    buttonStyle: fitness ? "solid" : "solid",
  };
}

function titleFor(strategy: LandingPageStrategy, input: LandingPageGenerationInput) {
  if (input.outcome) return input.outcome;
  if (strategy.templateKey === "fitness-coach") return "Build the body and confidence you've been working for";
  if (strategy.strategy.objective === "purchase") return input.offer || "Get the result you came for";
  if (strategy.strategy.objective === "call") return "A focused path to your next breakthrough";
  return input.offer || "Turn your next visitor into your next customer";
}

function subtitleFor(strategy: LandingPageStrategy, input: LandingPageGenerationInput) {
  if (input.audience && input.offer) return `${input.offer} built specifically for ${input.audience}.`;
  if (strategy.templateKey === "fitness-coach") return "Personalized training, practical nutrition, and accountability built around your life.";
  return "A clear, professional path from the problem your audience has to the next step you want them to take.";
}

function ctaFor(strategy: LandingPageStrategy) {
  return strategy.strategy.primaryCta ?? "Get started";
}

function sectionFor(type: LandingPageStrategy["sectionPlan"][number], strategy: LandingPageStrategy, input: LandingPageGenerationInput, index: number) {
  const cta = ctaFor(strategy);
  const title = titleFor(strategy, input);
  switch (type) {
    case "hero":
      return { id: `ai-hero-${index}`, type: "hero" as const, visible: true, blocks: [{ type: "text" as const, text: title }, { type: "text" as const, text: subtitleFor(strategy, input) }, { type: "button" as const, label: cta, action: { type: "url" as const, url: "https://example.com" } }], settings: { variant: strategy.templateKey } };
    case "vsl":
      return { id: `ai-vsl-${index}`, type: "vsl" as const, visible: true, blocks: [{ type: "text" as const, text: "See how the offer works and what to expect." }], settings: { videoUrl: "" } };
    case "benefits":
      return { id: `ai-benefits-${index}`, type: "benefits" as const, visible: true, blocks: [{ type: "text" as const, text: "A clear process built around your goals" }, { type: "text" as const, text: "Practical guidance without unnecessary complexity" }, { type: "text" as const, text: "Support focused on the outcome that matters" }], settings: {} };
    case "social-proof":
      return { id: `ai-proof-${index}`, type: "social-proof" as const, visible: true, blocks: [{ type: "testimonial" as const, quote: "Add a real customer result or testimonial here.", author: "Real customer" }], settings: {} };
    case "content":
      return { id: `ai-content-${index}`, type: "content" as const, visible: true, blocks: [{ type: "text" as const, text: "Why this approach works" }, { type: "text" as const, text: "Explain the mechanism, process, or key differentiator using the entrepreneur's actual information." }], settings: {} };
    case "offer":
      return { id: `ai-offer-${index}`, type: "offer" as const, visible: true, blocks: [{ type: "text" as const, text: input.offer || "Your offer" }, { type: "text" as const, text: input.price ? `Starting at ${input.price}` : "Add your pricing and inclusions." }], settings: {} };
    case "faq":
      return { id: `ai-faq-${index}`, type: "faq" as const, visible: true, blocks: [{ type: "faq" as const, question: "Is this right for me?", answer: "Customize this answer with your actual audience, offer, and expectations." }], settings: {} };
    case "form":
      return { id: `ai-form-${index}`, type: "form" as const, visible: true, blocks: [], settings: {} };
    case "product":
      return { id: `ai-product-${index}`, type: "product" as const, visible: true, blocks: [], settings: {} };
    case "cta":
      return { id: `ai-cta-${index}`, type: "cta" as const, visible: true, blocks: [{ type: "text" as const, text: "Ready to take the next step?" }, { type: "button" as const, label: cta, action: { type: "url" as const, url: "https://example.com" } }], settings: {} };
    case "footer":
      return { id: `ai-footer-${index}`, type: "footer" as const, visible: true, blocks: [], settings: {} };
  }
}

export function buildFallbackLandingPage(input: LandingPageGenerationInput): { document: ConversionBuilderDocument; strategy: LandingPageStrategy } {
  const strategy = buildLandingPageStrategy(input);
  const designSpec = buildDesignSpec(strategy);
  const sections = strategy.sectionPlan.map((type, index) => sectionFor(type, strategy, input, index + 1));

  const document = conversionBuilderDocumentSchema.parse({
    schemaVersion: 1,
    sections,
    theme: {
      colors: designSpec.colors,
      typography: { fontFamily: designSpec.typography.fontFamily, displayFontFamily: designSpec.typography.displayFontFamily ?? designSpec.typography.fontFamily },
      buttons: { style: designSpec.buttonStyle, size: "large" },
      spacing: { section: 56 },
      radius: { button: 16, card: 20 },
    },
    designSpec,
    conversionStrategy: strategy.strategy,
    references: [],
    metadata: {
      templateKey: strategy.templateKey,
      aiGenerated: true,
      aiPromptVersion: "ai-landing-v2",
      designSpecVersion: 1,
    },
  });

  return { document, strategy };
}

export function buildLandingPageSystemPrompt() {
  return `You are Buy Now's AI landing-page design director. Your job is to turn an entrepreneur's offer, audience, ad context, and assets into a premium, conversion-focused mobile-first landing page. Buy Now is the designer: the entrepreneur must never need to configure Figma foundations, grids, typography scales, spacing tokens, breakpoints, or design systems. Return JSON only using schemaVersion 1. Always include designSpec and conversionStrategy. Use the provided facts only. Never invent customer names, results, credentials, prices, guarantees, URLs, or claims. Use https://example.com only when a destination is missing. Preserve real form/product/page references supplied by the user. Design for the visitor's conversion objective and traffic temperature. Continue the ad's promise rather than changing the offer. Prefer strong visual hierarchy, generous whitespace, intentional image composition, readable mobile typography, and one dominant CTA path. The designSpec is an implementation contract, not user-facing configuration.`;
}
