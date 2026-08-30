import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { standaloneEssays } from '../../data/writing';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    ...standaloneEssays.map((essay) => ({
      title: essay.title,
      pubDate: essay.publishedAt,
      description: essay.description,
      link: essay.slug,
      categories: essay.tags,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Mulloy Morrow - Blog',
    description: 'Thoughts on AI, machine learning, human-centered technology, and building the future.',
    site: context.site || 'https://mulloymorrow.com',
    items,
    customData: `<language>en-us</language>`,
  });
}
