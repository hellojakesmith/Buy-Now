export type TemplateMediaAsset = {
  id: string;
  kind: 'hero' | 'background' | 'profile' | 'testimonial' | 'product';
  url: string;
  alt: string;
  credit: string;
};

/**
 * Curated demo imagery used as starter content for template previews.
 * Stable IDs intentionally keep the builder document independent of the URL,
 * so a user's uploaded MediaAsset can replace any starter image later.
 */
export const TEMPLATE_MEDIA: Record<string, TemplateMediaAsset[]> = {
  creator: [{ id: 'creator-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85', alt: 'Creator portrait in natural light', credit: 'Unsplash' }, { id: 'creator-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85', alt: 'Bright creative workspace', credit: 'Unsplash' }],
  coach: [{ id: 'coach-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85', alt: 'Fitness training studio', credit: 'Unsplash' }, { id: 'coach-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=85', alt: 'Person exercising in a gym', credit: 'Unsplash' }],
  agency: [{ id: 'agency-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85', alt: 'Modern agency workspace', credit: 'Unsplash' }, { id: 'agency-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85', alt: 'Modern office interior', credit: 'Unsplash' }],
  service: [{ id: 'service-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85', alt: 'Professional team collaborating', credit: 'Unsplash' }, { id: 'service-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85', alt: 'Professional workspace', credit: 'Unsplash' }],
  local: [{ id: 'local-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85', alt: 'Welcoming retail storefront', credit: 'Unsplash' }, { id: 'local-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1800&q=85', alt: 'Welcoming local business interior', credit: 'Unsplash' }],
  magnet: [{ id: 'magnet-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85', alt: 'Notebook and laptop workspace', credit: 'Unsplash' }, { id: 'magnet-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85', alt: 'Laptop and creative work', credit: 'Unsplash' }],
  waitlist: [{ id: 'waitlist-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85', alt: 'Creative product design workspace', credit: 'Unsplash' }, { id: 'waitlist-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=85', alt: 'Minimal modern workspace', credit: 'Unsplash' }],
  product: [{ id: 'product-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85', alt: 'Minimal premium product photograph', credit: 'Unsplash' }, { id: 'product-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=85', alt: 'Minimal product presentation background', credit: 'Unsplash' }],
};

export const getTemplateMedia = (templateId: string) => TEMPLATE_MEDIA[templateId] ?? TEMPLATE_MEDIA.creator;
export const getTemplateAsset = (templateId: string, assetId: string) => getTemplateMedia(templateId).find((asset) => asset.id === assetId);
