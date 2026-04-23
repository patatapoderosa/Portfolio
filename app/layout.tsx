import "./globals.css";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Carmine Carnevale | Portfolio",
  description: "Portfolio di Carmine Carnevale."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
