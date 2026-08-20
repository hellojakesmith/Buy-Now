import { Router } from "express";
import { z } from "zod";
import { conversionBuilderDocumentSchema, type ConversionBuilderDocument } from "../schemas/conversionBuilder.js";
import { asyncRoute, requireContext } from "../utils/http.js";
import { env } from "../config/env.js";

export const aiRouter = Router();

const requestSchema = z.object({
  prompt: z.string().trim().min(10).max(6000),
  templateKey: z.string().trim().max(100).optional(),
  currentDocument: conversionBuilderDocumentSchema.optional(),
});

const SYSTEM_PROMPT = `You are Buy Now's landing-page strategist. Generate a complete mobile-first landing page as JSON for a small business, creator, coach, consultant, or local business. The page must be conversion-focused, concise, professional, and easy to scan on a phone. Use only the allowed builder schema. Do not invent real metrics, customer names, URLs, prices, or credentials. If the user did not provide a real URL, use https://example.com as a placeholder. Prefer sections in this order when appropriate: hero, benefits/content, social-proof, offer, faq, form or cta, footer. Return JSON only with schemaVersion 1, sections, theme, references, and metadata. Each section id must be unique. Each section may contain text, image, button, form, product, testimonial, or faq blocks. For buttons without a real destination use https://example.com. Set metadata.aiGenerated=true and metadata.aiPromptVersion='ai-landing-v1'.`;

function fallbackDocument(prompt: string, templateKey?: string): ConversionBuilderDocument {
  const lower = prompt.toLowerCase();
  const fitness = /fitness|trainer|workout|weight loss|gym|body|nutrition|coaching/.test(lower);
  const coach = /coach|coaching|consultant|consulting/.test(lower);
  const sell = /sell|product|program|course|offer|buy/.test(lower);
  const title = fitness
    ? "Build the body and confidence you've been working for"
    : coach
      ? "A simpler path to your next breakthrough"
      : sell
        ? "Get the result you came for"
        : "Turn your next visitor into your next customer";
  const subtitle = fitness
    ? "Personalized training, practical nutrition, and accountability built around your life."
    : coach
      ? "A focused, practical approach designed around your goals, priorities, and real-world schedule."
      : sell
        ? "See what's included, why it works, and the next step in one polished mobile experience."
        : "Explain what you do, build trust quickly, and give people one clear next step.";
  const cta = fitness ? "Apply for coaching" : sell ? "Get started" : coach ? "Book a consultation" : "Get started";
  return conversionBuilderDocumentSchema.parse({
    schemaVersion: 1,
    sections: [
      { id: "ai-hero", type: "hero", visible: true, blocks: [
        { type: "text", text: title },
        { type: "text", text: subtitle },
        { type: "button", label: cta, action: { type: "url", url: "https://example.com" } },
      ], settings: { variant: templateKey ?? (fitness ? "fitness-coach" : coach ? "coach" : sell ? "product-offer" : "creator-brand") } },
      { id: "ai-benefits", type: "benefits", visible: true, blocks: [
        { type: "text", text: fitness ? "Training that fits your schedule" : "A clear process with less friction" },
        { type: "text", text: fitness ? "Nutrition guidance you can actually follow" : "Practical guidance focused on outcomes" },
        { type: "text", text: fitness ? "Accountability that keeps you moving" : "One simple next step for interested visitors" },
      ], settings: {} },
      { id: "ai-proof", type: "social-proof", visible: true, blocks: [{ type: "testimonial", quote: "Add a real customer result here.", author: "Customer transformation" }], settings: {} },
      { id: "ai-faq", type: "faq", visible: true, blocks: [{ type: "faq", question: "Is this right for me?", answer: "Customize this answer with your actual audience, offer, and expectations." }], settings: {} },
      { id: "ai-cta", type: "cta", visible: true, blocks: [{ type: "text", text: "Ready to take the next step?" }, { type: "button", label: cta, action: { type: "url", url: "https://example.com" } }], settings: {} },
    ],
    theme: { colors: { primary: fitness ? "#E11D48" : "#0325D9", primaryText: "#FFFFFF", surface: "#FFFFFF", text: "#111111", muted: "#6B7280" }, typography: { fontFamily: "Inter, system-ui, sans-serif" }, buttons: { size: "large" }, spacing: { section: 32 }, radius: { button: 16, card: 20 } },
    references: [], metadata: { templateKey: templateKey ?? (fitness ? "fitness-coach" : undefined), aiGenerated: true, aiPromptVersion: "fallback-v1" },
  });
}

async function generateWithProvider(prompt: string, templateKey?: string): Promise<ConversionBuilderDocument | null> {
  if (!env.aiApiKey) return null;
  const response = await fetch(`${env.aiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.aiApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.aiModel,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${templateKey ? `Preferred template: ${templateKey}\n` : ""}${prompt}` },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) throw new Error(`AI provider request failed: ${response.status}`);
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned no content");
  return conversionBuilderDocumentSchema.parse(JSON.parse(content));
}

aiRouter.post("/landing-page", asyncRoute(async (req, res) => {
  requireContext(req);
  const input = requestSchema.parse(req.body);
  const document = await generateWithProvider(input.prompt, input.templateKey).catch(() => null) ?? fallbackDocument(input.prompt, input.templateKey);
  res.json({ document, provider: env.aiApiKey ? "configured" : "fallback", promptVersion: document.metadata.aiPromptVersion ?? "ai-landing-v1" });
}));
