"use client";

type SiteLoaderProps = {
  visible: boolean;
};

export function SiteLoader({ visible }: SiteLoaderProps) {
  return (
    <div aria-hidden={!visible} className={`site-loader${visible ? " is-visible" : ""}`}>
      <div className="site-loader__inner">
        <p>0</p>
      </div>
    </div>
  );
}
