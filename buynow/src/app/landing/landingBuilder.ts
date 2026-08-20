import type { LandingPageDocument } from "./LandingPageRenderer";

type TemplateKey = "creator-brand" | "coach" | "service-business" | "agency" | "local-business" | "lead-magnet" | "waitlist" | "product-offer";

const copyByTemplate: Record<TemplateKey, { headline: string; body: string; cta: string }> = {
  "creator-brand": { headline: "Build a brand people remember", body: "Share what you do, who you help, and the next step in one polished mobile experience.", cta: "Get started" },
  coach: { headline: "Make your next transformation easier to say yes to", body: "Explain the outcome, build trust, and give visitors one clear next action.", cta: "Book a consultation" },
  "service-business": { headline: "Turn local interest into real customers", body: "Show your value quickly and make it effortless for a visitor to contact you.", cta: "Request a quote" },
  agency: { headline: "Turn more traffic into qualified opportunities", body: "Lead with your strongest proof, explain the offer, and make the next step obvious.", cta: "Start a conversation" },
  "local-business": { headline: "Make it easy for customers to choose you", body: "A fast, trustworthy page designed for visitors who are ready to take action.", cta: "Contact us" },
  "lead-magnet": { headline: "Get the guide that helps you move faster", body: "Offer something genuinely useful and turn interested visitors into permission-based leads.", cta: "Get the guide" },
  waitlist: { headline: "Be first when we launch", body: "Build anticipation, explain the value, and collect only the information you need.", cta: "Join the waitlist" },
  "product-offer": { headline: "A better way to get the result you want", body: "Present the product, its benefits, and a clear path to purchase.", cta: "Buy now" },
};

export function createLandingPageDocument(templateKey: TemplateKey = "creator-brand"): LandingPageDocument {
  const copy = copyByTemplate[templateKey];
  return {
    schemaVersion: 1,
    sections: [
      { id: "hero-1", type: "hero", visible: true, blocks: [{ type: "text", text: copy.headline }, { type: "text", text: copy.body }, { type: "button", label: copy.cta, action: { type: "url", url: "https://example.com" } }], settings: {} },
      { id: "benefits-1", type: "benefits", visible: true, blocks: [{ type: "text", text: "Make the value obvious in seconds. Keep the page focused on outcomes, proof, and one primary action." }], settings: {} },
      { id: "social-proof-1", type: "social-proof", visible: true, blocks: [{ type: "testimonial", quote: "Add a real customer result here.", author: "Customer name" }], settings: {} },
      { id: "faq-1", type: "faq", visible: true, blocks: [{ type: "faq", question: "What should visitors know before they take the next step?", answer: "Answer the most important objection clearly and honestly." }], settings: {} },
      { id: "cta-1", type: "cta", visible: true, blocks: [{ type: "button", label: copy.cta, action: { type: "url", url: "https://example.com" } }], settings: {} },
    ],
    theme: {
      colors: { primary: "#0325D9", primaryText: "#FFFFFF", surface: "#FFFFFF", text: "#111111", muted: "#6B7280" },
      typography: { fontFamily: "Inter, system-ui, sans-serif" },
      buttons: { size: "large" },
      spacing: { section: 32 },
      radius: { button: 14, card: 18 },
    },
    references: [],
    metadata: { templateKey, aiGenerated: false },
  };
}
