import { z } from "zod";

export const CONVERSION_BUILDER_SCHEMA_VERSION = 1 as const;

const referenceSchema = z.object({
  type: z.enum(["form", "product", "page"]),
  id: z.string().min(1).max(100),
});

const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("url"), url: z.string().url().max(2000) }),
  z.object({ type: z.literal("form"), formId: z.string().min(1).max(100) }),
  z.object({ type: z.literal("product"), productId: z.string().min(1).max(100) }),
  z.object({ type: z.literal("buy-now"), pageId: z.string().min(1).max(100) }),
]);

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().max(10000) }),
  z.object({ type: z.literal("image"), assetId: z.string().min(1).max(100), alt: z.string().max(500).default("") }),
  z.object({ type: z.literal("button"), label: z.string().min(1).max(120), action: actionSchema }),
  z.object({ type: z.literal("form"), formId: z.string().min(1).max(100) }),
  z.object({ type: z.literal("product"), productId: z.string().min(1).max(100) }),
  z.object({ type: z.literal("testimonial"), quote: z.string().max(3000), author: z.string().max(200) }),
  z.object({ type: z.literal("faq"), question: z.string().max(500), answer: z.string().max(5000) }),
]);

const sectionSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(["hero", "content", "benefits", "social-proof", "offer", "faq", "form", "product", "cta", "footer", "custom"]),
  visible: z.boolean().default(true),
  blocks: z.array(blockSchema).max(30),
  settings: z.record(z.unknown()).default({}),
});

export const themeSchema = z.object({
  colors: z.record(z.string().max(100)).default({}),
  typography: z.record(z.string().max(100)).default({}),
  buttons: z.record(z.unknown()).default({}),
  spacing: z.record(z.number().finite()).default({}),
  radius: z.record(z.number().finite()).default({}),
});

export const conversionBuilderDocumentSchema = z.object({
  schemaVersion: z.literal(CONVERSION_BUILDER_SCHEMA_VERSION),
  sections: z.array(sectionSchema).max(100),
  theme: themeSchema,
  references: z.array(referenceSchema).max(100).default([]),
  metadata: z.object({
    templateKey: z.string().max(100).optional(),
    aiGenerated: z.boolean().default(false),
    aiPromptVersion: z.string().max(100).optional(),
  }).default({ aiGenerated: false }),
});

export type ConversionBuilderDocument = z.infer<typeof conversionBuilderDocumentSchema>;
export type ConversionBuilderSection = z.infer<typeof sectionSchema>;

export function validateConversionBuilderDocument(input: unknown): ConversionBuilderDocument {
  return conversionBuilderDocumentSchema.parse(input);
}

/**
 * Converts the legacy Page.sections representation into the versioned builder
 * envelope without attempting to guess arbitrary legacy block semantics.
 */
export function migrateLegacySections(sections: unknown): ConversionBuilderDocument {
  const legacySections = Array.isArray(sections) ? sections : [];
  const normalized = legacySections.map((section, index) => ({
    id: typeof section === "object" && section !== null && "id" in section && typeof section.id === "string"
      ? section.id
      : `legacy-section-${index + 1}`,
    type: "custom" as const,
    visible: true,
    blocks: [],
    settings: { legacy: section },
  }));

  return conversionBuilderDocumentSchema.parse({
    schemaVersion: CONVERSION_BUILDER_SCHEMA_VERSION,
    sections: normalized,
    theme: { colors: {}, typography: {}, buttons: {}, spacing: {}, radius: {} },
    references: [],
    metadata: { aiGenerated: false },
  });
}
