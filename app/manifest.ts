import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zayd Hassan — AI Engineer & Full-Stack Developer",
    short_name: "Zayd Hassan",
    description:
      "Portfolio of Zayd Hassan — AI Engineer & Full-Stack Developer building intelligent digital experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}