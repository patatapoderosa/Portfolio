import { siteContent } from "@/data/site";

export function Hero() {
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
      <h1 className="hero__title">{siteContent.heroTitle}</h1>
    </section>
  );
}
