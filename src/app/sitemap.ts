import { MetadataRoute } from 'next';

const BASE = process.env.NEXTAUTH_URL || 'https://eventgo.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/home`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    {
      url: `${BASE}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    {
      url: `${BASE}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Authenticated app pages — lower priority since they require sign-in
  const appPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: `${BASE}/themes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/themes/create`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/planner`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { url: `${BASE}/posts`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${BASE}/bookings`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/themerecomm`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/eventrecomm`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${BASE}/info`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [...staticPages, ...appPages];
}
