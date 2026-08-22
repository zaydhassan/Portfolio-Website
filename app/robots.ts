import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Scene routes are only ever loaded inside <iframe>s on the main
        // page — they're not standalone documents, so keep them out of the
        // index.
        disallow: ["/hero", "/about-core", "/skill-core"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}