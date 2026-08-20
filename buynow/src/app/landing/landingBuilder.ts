import type { LandingPageDocument } from "./LandingPageRenderer";
import { getTemplateMedia } from "./templateMedia";

type TemplateKey = "creator-brand" | "coach" | "service-business" | "agency" | "local-business" | "lead-magnet" | "waitlist" | "product-offer";
type TemplateConfig = { headline: string; body: string; cta: string; primary: string; primaryText: string; surface: string; text: string; muted: string; benefit: string; proof: string; faq: string };

const templates: Record<TemplateKey, TemplateConfig> = {
  "creator-brand": { headline: "Build a brand people remember", body: "Share what you do, who you help, and the next step in one polished mobile experience.", cta: "Get started", primary: "#7448F6", primaryText: "#FFFFFF", surface: "#FCFAFF", text: "#17121F", muted: "#746B7D", benefit: "Turn your audience into a brand community with a clear story and memorable offer.", proof: "The page made our offer feel instantly more professional.", faq: "Can I customize this page?" },
  coach: { headline: "Make your next transformation easier to say yes to", body: "Explain the outcome, build trust, and give visitors one clear next action.", cta: "Book a consultation", primary: "#0F766E", primaryText: "#FFFFFF", surface: "#F6FFFD", text: "#10201E", muted: "#5F716D", benefit: "Show the transformation, your method, and exactly what clients get when you work together.", proof: "I knew exactly what the program would help me accomplish.", faq: "How does coaching work?" },
  "service-business": { headline: "Turn local interest into real customers", body: "Show your value quickly and make it effortless for a visitor to contact you.", cta: "Request a quote", primary: "#2563EB", primaryText: "#FFFFFF", surface: "#F7FAFF", text: "#111827", muted: "#64748B", benefit: "Make your services, process, and proof easy to understand before a visitor ever calls.", proof: "They made it incredibly easy to understand what we were getting.", faq: "How quickly can I get a quote?" },
  agency: { headline: "Turn more traffic into qualified opportunities", body: "Lead with your strongest proof, explain the offer, and make the next step obvious.", cta: "Start a conversation", primary: "#111827", primaryText: "#FFFFFF", surface: "#FFFFFF", text: "#111827", muted: "#6B7280", benefit: "A conversion-focused structure for showing expertise, proof, services, and a strong next step.", proof: "We started getting better leads instead of simply more traffic.", faq: "What happens after I reach out?" },
  "local-business": { headline: "Make it easy for customers to choose you", body: "A fast, trustworthy page designed for visitors who are ready to take action.", cta: "Contact us", primary: "#EA580C", primaryText: "#FFFFFF", surface: "#FFF9F5", text: "#24140C", muted: "#7C6558", benefit: "Put your location, services, reviews, and contact path where mobile customers can find them immediately.", proof: "Friendly, fast, and exactly what we needed.", faq: "Where are you located?" },
  "lead-magnet": { headline: "Get the guide that helps you move faster", body: "Offer something genuinely useful and turn interested visitors into permission-based leads.", cta: "Get the guide", primary: "#7C3AED", primaryText: "#FFFFFF", surface: "#FAF7FF", text: "#1F1630", muted: "#716581", benefit: "Lead with the promised outcome, preview the value, then make signup feel effortless.", proof: "The free guide gave us enough value to trust the paid offer.", faq: "What will I receive?" },
  waitlist: { headline: "Be first when we launch", body: "Build anticipation, explain the value, and collect only the information you need.", cta: "Join the waitlist", primary: "#DB2777", primaryText: "#FFFFFF", surface: "#FFF7FB", text: "#2A1220", muted: "#805F73", benefit: "Build anticipation with a focused launch story and a frictionless waitlist signup.", proof: "The preview made me want to be one of the first people in.", faq: "When does the product launch?" },
  "product-offer": { headline: "A better way to get the result you want", body: "Present the product, its benefits, and a clear path to purchase.", cta: "Buy now", primary: "#059669", primaryText: "#FFFFFF", surface: "#F6FFFB", text: "#10201A", muted: "#60756C", benefit: "Put the product, benefits, proof, offer, and purchase action into one focused mobile buying experience.", proof: "The page answered every question I had before purchasing.", faq: "What is included with my purchase?" },
};

export function createLandingPageDocument(templateKey: TemplateKey = "creator-brand"): LandingPageDocument {
  const config = templates[templateKey];
  const media = getTemplateMedia(templateKey);
  const heroMedia = media.find((asset) => asset.kind === "hero");
  const backgroundMedia = media.find((asset) => asset.kind === "background");

  return {
    schemaVersion: 1,
    sections: [
      { id: "hero-1", type: "hero", visible: true, blocks: [
        ...(heroMedia ? [{ type: "image" as const, assetId: heroMedia.id, alt: heroMedia.alt }] : []),
        { type: "text", text: config.headline }, { type: "text", text: config.body }, { type: "button", label: config.cta, action: { type: "url", url: "https://example.com" } }
      ], settings: { variant: templateKey, backgroundAssetId: backgroundMedia?.id } },
      { id: "benefits-1", type: "benefits", visible: true, blocks: [{ type: "text", text: config.benefit }], settings: { variant: templateKey } },
      { id: "social-proof-1", type: "social-proof", visible: true, blocks: [{ type: "testimonial", quote: config.proof, author: "Happy customer" }], settings: { variant: templateKey } },
      { id: "faq-1", type: "faq", visible: true, blocks: [{ type: "faq", question: config.faq, answer: "Customize this answer in the mobile editor so visitors get a clear, honest response." }], settings: { variant: templateKey } },
      { id: "cta-1", type: "cta", visible: true, blocks: [{ type: "button", label: config.cta, action: { type: "url", url: "https://example.com" } }], settings: { variant: templateKey } },
    ],
    theme: {
      colors: { primary: config.primary, primaryText: config.primaryText, surface: config.surface, text: config.text, muted: config.muted },
      typography: { fontFamily: "Inter, system-ui, sans-serif" },
      buttons: { size: "large" }, spacing: { section: 32 }, radius: { button: 14, card: 18 },
    }, references: [], metadata: { templateKey, aiGenerated: false },
  };
}
