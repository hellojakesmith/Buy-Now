import type { LandingPageDocument } from "./LandingPageRenderer";

type TemplateKey = "creator-brand" | "coach" | "service-business" | "agency" | "local-business" | "lead-magnet" | "waitlist" | "product-offer";

type TemplateConfig = {
  headline: string;
  body: string;
  cta: string;
  primary: string;
  surface: string;
  muted: string;
  font: string;
  benefits: string;
  testimonial: string;
  faq: string;
};

const templates: Record<TemplateKey, TemplateConfig> = {
  "creator-brand": { headline: "Build a brand people remember", body: "Share what you do, who you help, and the next step in one polished mobile experience.", cta: "Get started", primary: "#7C3AED", surface: "#FFFFFF", muted: "#6D5A82", font: "Inter, system-ui, sans-serif", benefits: "Turn your story, expertise, and personality into a page that feels unmistakably yours.", testimonial: "This finally feels like my brand instead of another generic template.", faq: "Can I make this page feel like my brand?" },
  coach: { headline: "Make your next transformation easier to say yes to", body: "Lead with the outcome, build trust quickly, and give the right people one clear next step.", cta: "Book a consultation", primary: "#0F766E", surface: "#F7FFFC", muted: "#52706B", font: "Inter, system-ui, sans-serif", benefits: "Turn your coaching offer into a clear transformation journey with proof and a confident CTA.", testimonial: "The page made my coaching offer instantly easier to understand.", faq: "Who is this coaching program for?" },
  "service-business": { headline: "Turn local interest into real customers", body: "Show your value quickly and make it effortless for a visitor to contact you.", cta: "Request a quote", primary: "#1D4ED8", surface: "#F8FBFF", muted: "#53677F", font: "Inter, system-ui, sans-serif", benefits: "Make your services, proof, and next step obvious to people who are ready to hire you.", testimonial: "We started getting better-qualified inquiries immediately.", faq: "How quickly can I get a quote?" },
  agency: { headline: "Turn more traffic into qualified opportunities", body: "Lead with your strongest proof, explain the offer, and make the next step obvious.", cta: "Start a conversation", primary: "#111827", surface: "#F8F8F8", muted: "#626873", font: "Inter, system-ui, sans-serif", benefits: "Build authority with a sharp point of view, outcomes, proof, and a frictionless CTA.", testimonial: "The new page communicates our value in seconds.", faq: "What makes your agency different?" },
  "local-business": { headline: "Make it easy for customers to choose you", body: "A fast, trustworthy page designed for visitors who are ready to take action.", cta: "Contact us", primary: "#B45309", surface: "#FFFDF7", muted: "#77654A", font: "Inter, system-ui, sans-serif", benefits: "Put your location, trust signals, services, and contact options exactly where customers need them.", testimonial: "Customers tell us the new page made us look established and trustworthy.", faq: "Where are you located?" },
  "lead-magnet": { headline: "Get the guide that helps you move faster", body: "Offer something genuinely useful and turn interested visitors into permission-based leads.", cta: "Get the guide", primary: "#BE185D", surface: "#FFF8FC", muted: "#7B5267", font: "Inter, system-ui, sans-serif", benefits: "Lead with the promise, show what they will learn, and keep the signup experience focused.", testimonial: "The lead magnet page doubled our qualified signups.", faq: "What will I receive after I sign up?" },
  waitlist: { headline: "Be first when we launch", body: "Build anticipation, explain the value, and collect only the information you need.", cta: "Join the waitlist", primary: "#4338CA", surface: "#F8F8FF", muted: "#5E5A7A", font: "Inter, system-ui, sans-serif", benefits: "Create momentum with a clear promise, launch story, social proof, and one simple signup.", testimonial: "The waitlist filled faster once people understood exactly what was coming.", faq: "When will the product launch?" },
  "product-offer": { headline: "A better way to get the result you want", body: "Present the product, its benefits, and a clear path to purchase.", cta: "Buy now", primary: "#047857", surface: "#F7FFFB", muted: "#557267", font: "Inter, system-ui, sans-serif", benefits: "Turn product interest into purchase intent with benefits, proof, objections, and a focused offer.", testimonial: "The product page made the decision incredibly easy.", faq: "What is included with the purchase?" },
};

export function createLandingPageDocument(templateKey: TemplateKey = "creator-brand"): LandingPageDocument {
  const config = templates[templateKey] ?? templates["creator-brand"];
  return {
    schemaVersion: 1,
    sections: [
      { id: "hero-1", type: "hero", visible: true, blocks: [{ type: "text", text: config.headline }, { type: "text", text: config.body }, { type: "button", label: config.cta, action: { type: "url", url: "https://example.com" } }], settings: { variant: templateKey } },
      { id: "benefits-1", type: "benefits", visible: true, blocks: [{ type: "text", text: config.benefits }], settings: { variant: templateKey } },
      { id: "social-proof-1", type: "social-proof", visible: true, blocks: [{ type: "testimonial", quote: config.testimonial, author: "Customer name" }], settings: { variant: templateKey } },
      { id: "faq-1", type: "faq", visible: true, blocks: [{ type: "faq", question: config.faq, answer: "Answer this question with the specific information your audience needs to feel confident taking the next step." }], settings: { variant: templateKey } },
      { id: "cta-1", type: "cta", visible: true, blocks: [{ type: "button", label: config.cta, action: { type: "url", url: "https://example.com" } }], settings: { variant: templateKey } },
    ],
    theme: {
      colors: { primary: config.primary, primaryText: "#FFFFFF", surface: config.surface, text: "#111111", muted: config.muted },
      typography: { fontFamily: config.font },
      buttons: { size: "large" },
      spacing: { section: 32 },
      radius: { button: 16, card: 24 },
    },
    references: [],
    metadata: { templateKey, aiGenerated: false },
  };
}
