import type { Plugin } from 'vite';

const FITNESS_HERO_IMAGE = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85';
const FITNESS_BEFORE_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85';
const FITNESS_AFTER_IMAGE = 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85';

/**
 * Keeps the legacy App shell compatible while exposing the flagship Fitness Coach
 * landing template until the app's template catalog is fully extracted into the
 * shared builder package.
 */
export function fitnessTemplateGalleryPlugin(): Plugin {
  return {
    name: 'fitness-template-gallery',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/app/App.tsx')) return null;

      let next = code;

      next = next.replace(
        'const LANDING_TEMPLATES: LandingTemplate[] = [',
        `const LANDING_TEMPLATES: LandingTemplate[] = [\n  {\n    key: "fitness-coach",\n    name: "Fitness Coach",\n    category: "Lead Generation · Coaching",\n    headline: "Get stronger, leaner, and more confident.",\n    description: "A conversion-focused fitness coaching page built to turn social traffic into applications with a VSL, transformation proof, and one clear CTA.",\n    ctaLabel: "Apply for Coaching",\n    highlights: ["VSL section", "Before & after proof", "Application form"],\n    colors: ["#111111", "#D7263D"],\n  },`
      );

      next = next.replace(
        'const [selectedTemplateKey, setSelectedTemplateKey] = useState<LandingTemplateKey>("hero");',
        'const [selectedTemplateKey, setSelectedTemplateKey] = useState<LandingTemplateKey>("fitness-coach" as unknown as LandingTemplateKey);'
      );

      next = next.replace(
        'style={{ background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})` }}>',
        `style={{\n                      backgroundImage: template.key === "fitness-coach"\n                        ? \`linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.58)), url(${FITNESS_HERO_IMAGE})\`\n                        : \`linear-gradient(135deg, \${template.colors[0]}, \${template.colors[1]})\`,\n                      backgroundSize: "cover",\n                      backgroundPosition: "center",\n                    }}>`
      );

      next = next.replace(
        '<div className="absolute left-3 top-3 h-1.5 w-8 rounded-full bg-white/40" />\n                    <div className="absolute inset-x-3 top-8 h-2 rounded-full bg-white/82" />\n                    <div className="absolute inset-x-3 top-12 h-2 rounded-full bg-white/62" />\n                    <div className="absolute bottom-3 left-3 right-3 h-7 rounded-xl bg-white/92" />',
        `<div className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[9px] font-bold text-white">\n                      {template.key === "fitness-coach" ? "FEATURED" : "TEMPLATE"}\n                    </div>\n                    <div className="absolute inset-x-3 bottom-3">\n                      <div className="h-1.5 w-14 rounded-full bg-white/90" />\n                      <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/60" />\n                    </div>`
      );

      const start = next.indexOf('  const useLandingTemplate = async');
      const end = next.indexOf('  const saveProductDraft = async', start);
      if (start !== -1 && end !== -1) {
        const region = next.slice(start, end);
        const replacement = region.replace(
          /      sections: \[.*?\n      \],\n/s,
          `      sections: templateKey === "fitness-coach"\n        ? [\n            {\n              type: "hero",\n              template: template.key,\n              headline: template.headline,\n              description: template.description,\n              ctaLabel: template.ctaLabel,\n              colors: template.colors,\n              image: {\n                assetId: "fitness-coach-hero",\n                src: "${FITNESS_HERO_IMAGE}",\n                alt: "Fitness coach training in a gym",\n              },\n            },\n            {\n              type: "video",\n              title: "Watch the VSL",\n              description: "See how the coaching program works and what makes the approach different.",\n              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",\n              ctaLabel: "Watch the VSL",\n            },\n            {\n              type: "form",\n              layout: "inline",\n              formId: \${selectedLandingForm?._id ?? null},\n              formName: \${selectedLandingForm?.name ?? null},\n              formSlug: \${selectedLandingForm?.slug ?? null},\n              ctaLabel: "Apply for Coaching",\n              formLink: \${selectedLandingForm?.publishSettings?.path ?? null},\n            },\n            {\n              type: "before-after",\n              title: "Real people. Real transformations.",\n              items: [\n                {\n                  beforeImage: "${FITNESS_BEFORE_IMAGE}",\n                  afterImage: "${FITNESS_AFTER_IMAGE}",\n                  name: "Client Transformation",\n                  quote: "I finally have a plan I can stick to and the confidence to keep going.",\n                },\n              ],\n            },\n            {\n              type: "highlights",\n              items: ["Personalized training", "Nutrition guidance", "Weekly accountability", "Coach support"],\n            },\n            {\n              type: "faq",\n              items: [\n                { question: "Do I need a gym?", answer: "No. Your plan can be adapted to your equipment and schedule." },\n                { question: "How does coaching work?", answer: "You receive a personalized plan, ongoing support, and regular progress check-ins." },\n                { question: "Who is this for?", answer: "It is designed for busy adults who want a sustainable approach to getting stronger and leaner." },\n              ],\n            },\n            {\n              type: "cta",\n              headline: "Ready to start your transformation?",\n              ctaLabel: "Apply for Coaching",\n              formLink: \${selectedLandingForm?.publishSettings?.path ?? null},\n            },\n          ]\n        : [\n            {\n              type: "hero",\n              template: template.key,\n              headline: template.headline,\n              description: template.description,\n              ctaLabel: template.ctaLabel,\n              colors: template.colors,\n            },\n            {\n              type: "form",\n              layout: "inline",\n              formId: \${selectedLandingForm?._id ?? null},\n              formName: \${selectedLandingForm?.name ?? null},\n              formSlug: \${selectedLandingForm?.slug ?? null},\n              ctaLabel: \${selectedLandingForm ? "Submit" : "Create a form"},\n            },\n            {\n              type: "highlights",\n              items: template.highlights,\n            },\n          ],\n`
        );
        if (replacement === region) {
          throw new Error('Fitness template plugin could not locate the landing page section definition.');
        }
        next = next.slice(0, start) + replacement + next.slice(end);
      }

      return { code: next, map: null };
    },
  };
}
