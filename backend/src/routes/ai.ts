import { Router } from "express";
import { z } from "zod";
import { conversionBuilderDocumentSchema } from "../schemas/conversionBuilder.js";
import { asyncRoute, requireContext } from "../utils/http.js";
import { env } from "../config/env.js";
import {
  buildDesignSpec,
  buildFallbackLandingPage,
  buildLandingPageStrategy,
  buildLandingPageSystemPrompt,
  type LandingPageGenerationInput,
} from "../services/landingPageDesign.js";

export const aiRouter = Router();

const objectiveSchema = z.enum(["lead", "application", "call", "purchase", "signup", "waitlist", "event"]);
const trafficSourceSchema = z.enum(["instagram", "facebook", "tiktok", "google", "other"]);
const trafficTemperatureSchema = z.enum(["cold", "warm", "existing"]);

const requestSchema = z.object({
  prompt: z.string().trim().min(10).max(6000),
  offer: z.string().trim().max(2000).optional(),
  audience: z.string().trim().max(1000).optional(),
  outcome: z.string().trim().max(1000).optional(),
  objective: objectiveSchema.optional(),
  trafficSource: trafficSourceSchema.optional(),
  trafficTemperature: trafficTemperatureSchema.optional(),
  primaryCta: z.string().trim().max(120).optional(),
  price: z.string().trim().max(100).optional(),
  brandVoice: z.string().trim().max(500).optional(),
  templateKey: z.string().trim().max(100).optional(),
  adCopy: z.string().trim().max(6000).optional(),
  currentDocument: conversionBuilderDocumentSchema.optional(),
});

function enrichProviderDocument(document: ReturnType<typeof conversionBuilderDocumentSchema.parse>, input: LandingPageGenerationInput) {
  const strategy = buildLandingPageStrategy(input);
  const fallbackSpec = buildDesignSpec(strategy);

  return conversionBuilderDocumentSchema.parse({
    ...document,
    designSpec: document.designSpec ?? fallbackSpec,
    conversionStrategy: document.conversionStrategy ?? strategy.strategy,
    metadata: {
      ...document.metadata,
      templateKey: document.metadata.templateKey ?? strategy.templateKey,
      aiGenerated: true,
      aiPromptVersion: "ai-landing-v2",
      designSpecVersion: document.designSpec?.version ?? 1,
    },
  });
}

async function generateWithProvider(input: LandingPageGenerationInput) {
  if (!env.aiApiKey) return null;

  const strategy = buildLandingPageStrategy(input);
  const response = await fetch(`${env.aiBaseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.aiApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.aiModel,
      temperature: 0.55,
      messages: [
        { role: "system", content: buildLandingPageSystemPrompt() },
        {
          role: "user",
          content: JSON.stringify({
            prompt: input.prompt,
            offer: input.offer,
            audience: input.audience,
            outcome: input.outcome,
            objective: strategy.strategy.objective,
            trafficSource: strategy.strategy.trafficSource,
            trafficTemperature: strategy.strategy.trafficTemperature,
            primaryCta: strategy.strategy.primaryCta,
            price: input.price,
            brandVoice: input.brandVoice,
            templateKey: strategy.templateKey,
            adCopy: input.adCopy,
            sectionPlan: strategy.sectionPlan,
            designDirection: strategy.designDirection,
            trustRequirements: strategy.trustRequirements,
            currentDocument: input.currentDocument,
          }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) throw new Error(`AI provider request failed: ${response.status}`);
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned no content");

  const parsed = conversionBuilderDocumentSchema.parse(JSON.parse(content));
  return enrichProviderDocument(parsed, input);
}

aiRouter.post("/landing-page", asyncRoute(async (req, res) => {
  requireContext(req);
  const input = requestSchema.parse(req.body) as LandingPageGenerationInput;
  const strategy = buildLandingPageStrategy(input);
  const generated = await generateWithProvider(input).catch(() => null);
  const fallback = generated ? null : buildFallbackLandingPage(input);
  const document = generated ?? fallback!.document;

  res.json({
    document,
    strategy: generated ? strategy : fallback!.strategy,
    provider: generated ? "configured" : "fallback",
    promptVersion: document.metadata.aiPromptVersion ?? "ai-landing-v2",
  });
}));
