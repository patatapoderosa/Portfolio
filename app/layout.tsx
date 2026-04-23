import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteShell } from "@/components/site-shell";

const displayFont = localFont({
  src: [
    { path: "./fonts/display-1.woff2", weight: "300", style: "normal" },
    { path: "./fonts/display-2.woff2", weight: "400", style: "normal" },
    { path: "./fonts/display-3.woff2", weight: "500", style: "normal" },
    { path: "./fonts/display-4.woff2", weight: "700", style: "normal" },
    { path: "./fonts/display-5.woff2", weight: "900", style: "normal" }
  ],
  variable: "--font-display"
});

const loaderFont = localFont({
  src: "./fonts/loader.ttf",
  variable: "--font-loader"
});

export const metadata: Metadata = {
  title: "Carmine Carnevale | Portfolio",
  description: "Portfolio di Carmine Carnevale."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${displayFont.variable} ${loaderFont.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
