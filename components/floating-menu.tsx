"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { menuLinks, siteContent } from "@/data/site";

export function FloatingMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`floating-menu${isOpen ? " is-open" : ""}`}>
      <div className="floating-menu__panel" aria-hidden={!isOpen}>
        <nav className="floating-menu__nav" aria-label="Navigazione principale">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`floating-menu__nav-link${pathname === link.href ? " is-active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="floating-menu__thumb" />
              <span className="floating-menu__link-window">
                <span className="floating-menu__link-track">
                  <span>{link.label}</span>
                  <span>{link.label}</span>
                </span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="floating-menu__footer">
          <a href={siteContent.contactEmail} className="floating-menu__cta">
            <span className="floating-menu__cta-window">
              <span className="floating-menu__cta-track">
                <span>Contattami</span>
                <span>Contattami</span>
              </span>
            </span>
          </a>
          <div className="floating-menu__socials">
            {siteContent.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="floating-menu__social-link"
              >
                <Image src={social.icon} alt="" width={18} height={18} />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="floating-menu__bar">
        <div className="floating-menu__brand-block">
          <Link href="/" className="floating-menu__brand" onClick={() => setIsOpen(false)}>
            {siteContent.name}
          </Link>
          <p className="floating-menu__subtitle">{siteContent.subtitle}</p>
        </div>
        <button
          type="button"
          className="floating-menu__toggle"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="floating-menu__toggle-window">
            <span className="floating-menu__toggle-track">
              <span>{isOpen ? "Chiudi" : "Menu"}</span>
              <span>{isOpen ? "Chiudi" : "Menu"}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
