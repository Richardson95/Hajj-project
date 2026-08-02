import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HajjPath — Hajj Savings & Pilgrimage Companion",
    short_name: "HajjPath",
    description:
      "Save towards Hajj on a plan that fits your income, then let HajjPath guide you through every rite in Makkah, Mina, Arafat and Madinah.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#faf9f5",
    theme_color: "#014421",
    lang: "en-NG",
    categories: ["finance", "travel", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
