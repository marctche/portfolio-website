import type { Metadata } from "next";
import "./globals.css";
import { siteTitle, siteDescription } from "@/lib/content";

export const metadata: Metadata = {
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description: siteDescription,
};

/** No header and no shared footer: each page renders its own <main> and its own ending. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
