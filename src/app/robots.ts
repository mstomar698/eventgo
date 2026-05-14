import { MetadataRoute } from 'next';

const BASE = process.env.NEXTAUTH_URL || 'https://eventgo.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/home', '/privacy', '/terms', '/cookies', '/'],
        disallow: ['/api/', '/_next/'],
      },
      {
        // Be friendly to AI crawlers — allow them to index public pages
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'anthropic-ai', 'Googlebot'],
        allow: ['/home', '/privacy', '/terms', '/cookies'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
