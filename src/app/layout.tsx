import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

// Self-hosted fonts — no runtime dependency on Google Fonts at build or run
// time (Vercel build servers in some regions cannot reach fonts.gstatic.com).
const cinzel = localFont({
  src: [
    { path: "./fonts/Cinzel-normal-400700.woff2", weight: "400" },
    { path: "./fonts/Cinzel-normal-400700.woff2", weight: "500" },
    { path: "./fonts/Cinzel-normal-400700.woff2", weight: "600" },
    { path: "./fonts/Cinzel-normal-400700.woff2", weight: "700" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

const montserrat = localFont({
  src: [
    { path: "./fonts/Montserrat-normal-500700.woff2", weight: "500" },
    { path: "./fonts/Montserrat-normal-500700.woff2", weight: "600" },
    { path: "./fonts/Montserrat-normal-500700.woff2", weight: "700" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-normal-100900.woff2",
  variable: "--font-inter",
  display: "swap",
});

const baskerville = localFont({
  src: [
    { path: "./fonts/LibreBaskerville-normal-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/LibreBaskerville-normal-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/LibreBaskerville-italic-400.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AFM Lighthouse Church Vryburg — Church Management System",
    template: "%s — AFM Lighthouse CHMS",
  },
  description:
    "The administrative home for AFM Lighthouse Church Vryburg — members, ministries, events, giving, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${montserrat.variable} ${inter.variable} ${baskerville.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
