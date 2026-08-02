import type { MetadataRoute } from "next";

const SITE = "https://hajjpath.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; frequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, frequency: "weekly" },
    { path: "/how-it-works", priority: 0.9, frequency: "monthly" },
    { path: "/packages", priority: 0.9, frequency: "monthly" },
    { path: "/companion", priority: 0.8, frequency: "monthly" },
    { path: "/vendors", priority: 0.7, frequency: "monthly" },
    { path: "/about", priority: 0.6, frequency: "yearly" },
    { path: "/faq", priority: 0.6, frequency: "monthly" },
    { path: "/contact", priority: 0.6, frequency: "yearly" },
    { path: "/auth/register", priority: 0.8, frequency: "yearly" },
    { path: "/auth/login", priority: 0.5, frequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, frequency: "yearly" },
    { path: "/legal/privacy", priority: 0.3, frequency: "yearly" },
  ];

  const lastModified = new Date();

  return routes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified,
    changeFrequency: r.frequency,
    priority: r.priority,
  }));
}
