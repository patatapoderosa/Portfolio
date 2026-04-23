"use client";

import Link from "next/link";
import { menuLinks, siteContent } from "@/data/site";

export function FloatingMenu() {
  return (
    <div className="floating-menu">
      <div className="floating-menu__brand-block">
        <Link href="/" className="floating-menu__brand">
          {siteContent.name}
        </Link>
        <p className="floating-menu__subtitle">{siteContent.subtitle}</p>
      </div>
      <nav className="floating-menu__nav" aria-label="Navigazione principale">
        {menuLinks.map((link) => (
          <Link key={link.href} href={link.href} className="floating-menu__link">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
