import type { Metadata, Viewport } from "next";
import { Amiri, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/lib/store";
import { THEME_INIT_SCRIPT, ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://hajjpath.ng";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "HajjPath — The Ultimate Hajj Savings & Pilgrimage Companion",
    template: "%s · HajjPath",
  },
  description:
    "Save towards Hajj on a plan that fits your income, then let HajjPath guide you through every rite in Makkah, Mina, Arafat and Madinah. Built for Nigerian Muslims at home and abroad.",
  applicationName: "HajjPath",
  keywords: [
    "Hajj savings",
    "Hajj app Nigeria",
    "NAHCON",
    "Umrah guide",
    "Islamic savings",
    "Makkah marketplace",
    "pilgrimage companion",
    "Shariah compliant savings",
  ],
  authors: [{ name: "HajjPath" }],
  creator: "HajjPath",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE,
    siteName: "HajjPath",
    title: "HajjPath — From Intention to Completion",
    description:
      "A complete pilgrimage ecosystem: Shariah-compliant Hajj savings, live guidance in the holy sites, a verified Makkah marketplace and an emergency network that never sleeps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HajjPath — From Intention to Completion",
    description:
      "Shariah-compliant Hajj savings and a complete on-the-ground companion for Nigerian pilgrims.",
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#08120d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${jakarta.variable} ${amiri.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-xl focus:bg-forest-800 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>
            <AppProvider>{children}</AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
