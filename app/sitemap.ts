import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexoraexample.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    // Public marketing pages only — private routes (/cabinet, /admin) are excluded
    { url: `${SITE_URL}/`,        changeFrequency: "weekly",  priority: 1.0, lastModified: now },
    { url: `${SITE_URL}/status`,  changeFrequency: "hourly",  priority: 0.5, lastModified: now },
  ];
}
