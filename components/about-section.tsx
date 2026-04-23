import { siteContent } from "@/data/site";

export function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-section__copy">
        <p className="about-section__eyebrow">{siteContent.aboutEyebrow}</p>
        <p className="about-section__body">{siteContent.aboutBody}</p>
      </div>
      <div className="about-section__media">
        <video
          src={siteContent.aboutVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={siteContent.aboutPoster}
          className="about-section__video"
        />
      </div>
    </section>
  );
}
