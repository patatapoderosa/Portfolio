"use client";

import { useEffect, useState } from "react";
import { markFirstLoadComplete, hasCompletedFirstLoad } from "@/lib/session";
import { FloatingMenu } from "@/components/floating-menu";
import { PageTransition } from "@/components/page-transition";
import { SiteLoader } from "@/components/site-loader";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!hasCompletedFirstLoad()) {
      setShowLoader(true);
      const timer = window.setTimeout(() => {
        markFirstLoadComplete();
        setShowLoader(false);
      }, 1200);

      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <SiteLoader visible={showLoader} />
      <FloatingMenu />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
