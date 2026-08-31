/** Standalone HTML essays in public/blog — not Astro routes, so they need
 *  explicit sitemap, RSS, and homepage enrollment. */
export const SITE_ORIGIN = 'https://mulloymorrow.com';

export type StandaloneEssay = {
  title: string;
  description: string;
  /** Absolute path with trailing slash, e.g. /blog/foo/ */
  slug: string;
  publishedAt: Date;
  tags: string[];
  visual: string;
};

export const standaloneEssays: StandaloneEssay[] = [
  {
    title: 'Training and Fuelling for Female Physiology',
    description: 'Seven places default training advice gets it wrong for active women, and what to do instead.',
    slug: '/blog/training-and-fuelling-for-female-physiology/',
    publishedAt: new Date('2026-08-27'),
    tags: ['Physiology', 'Training', 'Nutrition', "Women's Health"],
    visual: 'physiology',
  },
  {
    title: 'The longevity diet, decoded',
    description: 'What we eat tunes the cellular machinery that determines how quickly we age. A practical breakdown of diet patterns, protein quality, methionine load, and evidence-backed plate changes.',
    slug: '/blog/longevity-diet-research/',
    publishedAt: new Date('2026-07-23'),
    tags: ['Longevity', 'Nutrition', 'Healthspan'],
    visual: 'longevity',
  },
  {
    title: 'The Body Beneath the Feeling',
    description: 'Where do emotions come from, and what lies beneath awareness? A guided tour of the rival answers — ending in a staged debate among five thinkers who would not agree about any of it.',
    slug: '/blog/the-body-beneath-the-feeling/',
    publishedAt: new Date('2026-06-01'),
    tags: ['Essay', 'Consciousness', 'Neuroscience'],
    visual: 'feeling',
  },
];

export const essaySitemapUrls = standaloneEssays.map(
  (essay) => `${SITE_ORIGIN}${essay.slug}`
);

export function relatedEssays(currentSlug: string): StandaloneEssay[] {
  return standaloneEssays.filter((essay) => essay.slug !== currentSlug);
}
