import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexoraexample.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`,         changeFrequency: "weekly", priority: 1.0,  lastModified: now },
    { url: `${SITE_URL}/exchange`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/cabinet`,  changeFrequency: "monthly", priority: 0.8, lastModified: now },
  ];
}
