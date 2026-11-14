import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ScrambleIn from "@/components/ScrambleIn";
import { siteTitle, siteDescription } from "@/lib/content";

export const metadata: Metadata = {
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description: siteDescription,
};

/**
 * No header and no shared footer: each page renders its own <main> and its own ending.
 * ScrambleIn glitches each inner page's text into place as it opens.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrambleIn />
        <Analytics />
      </body>
    </html>
  );
}
