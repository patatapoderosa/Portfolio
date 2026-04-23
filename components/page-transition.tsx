"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("page-transition-leaving");
    document.body.classList.add("page-transition-entering");
    const timeout = window.setTimeout(() => {
      document.body.classList.remove("page-transition-entering");
    }, 720);

    return () => {
      window.clearTimeout(timeout);
      document.body.classList.add("page-transition-leaving");
    };
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition-shell page-transition-shell--enter">
      <div className="page-transition-overlay" aria-hidden="true" />
      {children}
    </div>
  );
}
