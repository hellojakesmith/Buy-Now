export type TemplateMediaAsset = {
  id: string;
  kind: 'hero' | 'background' | 'profile' | 'testimonial' | 'product';
  url: string;
  alt: string;
  credit: string;
};

/** Curated starter imagery for templates. Assets are replaceable through the editor/media system. */
export const TEMPLATE_MEDIA: Record<string, TemplateMediaAsset[]> = {
  'fitness-coach': [
    { id: 'fitness-coach-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85', alt: 'Fitness coach training client in a modern gym', credit: 'Unsplash' },
    { id: 'fitness-coach-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=85', alt: 'Strength training workout in a gym', credit: 'Unsplash' },
    { id: 'fitness-before', kind: 'testimonial', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85', alt: 'Fitness transformation testimonial before photo placeholder', credit: 'Unsplash' },
    { id: 'fitness-after', kind: 'testimonial', url: 'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?auto=format&fit=crop&w=900&q=85', alt: 'Fitness transformation testimonial after photo placeholder', credit: 'Unsplash' },
    { id: 'fitness-proof-2-before', kind: 'testimonial', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85', alt: 'Second fitness transformation before photo placeholder', credit: 'Unsplash' },
    { id: 'fitness-proof-2-after', kind: 'testimonial', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85', alt: 'Second fitness transformation after photo placeholder', credit: 'Unsplash' },
  ],
  'creator-brand': [
    { id: 'creator-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85', alt: 'Creator portrait in natural light', credit: 'Unsplash' },
    { id: 'creator-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85', alt: 'Bright creative workspace', credit: 'Unsplash' },
  ],
  coach: [
    { id: 'coach-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85', alt: 'Fitness training studio', credit: 'Unsplash' },
    { id: 'coach-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=85', alt: 'Person exercising in a gym', credit: 'Unsplash' },
  ],
  agency: [
    { id: 'agency-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85', alt: 'Modern agency workspace', credit: 'Unsplash' },
    { id: 'agency-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85', alt: 'Modern office interior', credit: 'Unsplash' },
  ],
  'service-business': [
    { id: 'service-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85', alt: 'Professional team collaborating', credit: 'Unsplash' },
    { id: 'service-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85', alt: 'Professional workspace', credit: 'Unsplash' },
  ],
  'local-business': [
    { id: 'local-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85', alt: 'Welcoming retail storefront', credit: 'Unsplash' },
    { id: 'local-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1800&q=85', alt: 'Welcoming local business interior', credit: 'Unsplash' },
  ],
  'lead-magnet': [
    { id: 'magnet-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85', alt: 'Notebook and laptop workspace', credit: 'Unsplash' },
    { id: 'magnet-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85', alt: 'Laptop and creative work', credit: 'Unsplash' },
  ],
  waitlist: [
    { id: 'waitlist-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85', alt: 'Creative product design workspace', credit: 'Unsplash' },
    { id: 'waitlist-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=85', alt: 'Minimal modern workspace', credit: 'Unsplash' },
  ],
  'product-offer': [
    { id: 'product-hero', kind: 'hero', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85', alt: 'Minimal premium product photograph', credit: 'Unsplash' },
    { id: 'product-bg', kind: 'background', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=85', alt: 'Minimal product presentation background', credit: 'Unsplash' },
  ],
};

export const getTemplateMedia = (templateId: string) => TEMPLATE_MEDIA[templateId] ?? TEMPLATE_MEDIA['creator-brand'];
