"use client";

import { useEffect, useMemo, useRef } from "react";
import { siteContent } from "@/data/site";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const letters = useMemo(() => Array.from(siteContent.heroTitle), []);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const update = () => {
      const rect = title.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(
        Math.max((viewportHeight * 0.92 - rect.top) / (viewportHeight * 0.95), 0),
        1
      );

      title.style.setProperty("--hero-progress", progress.toFixed(3));

      title.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter, index) => {
        const local = Math.min(Math.max((progress - index * 0.025) / 0.28, 0), 1);
        const y = (1 - local) * 120;
        const blur = (1 - local) * 9;
        const opacity = 0.08 + local * 0.92;
        const rotate = (1 - local) * 8;
        letter.style.transform = `translate3d(0, ${y}%, 0) rotate(${rotate}deg)`;
        letter.style.opacity = opacity.toFixed(3);
        letter.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero__media">
        <video
          src={siteContent.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="hero__video"
        />
      </div>
      <div className="hero__title-wrap">
        <h1 ref={titleRef} className="hero__title" aria-label={siteContent.heroTitle}>
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              data-letter=""
              className={`hero__letter${letter === " " ? " is-space" : ""}`}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
