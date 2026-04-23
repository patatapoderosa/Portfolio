import Link from "next/link";
import { AboutSection } from "@/components/about-section";
import { Hero } from "@/components/hero";
import { workItems } from "@/data/work";
import { workRoute } from "@/lib/routes";

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <AboutSection />
      <section className="home-work-preview">
        <div className="home-work-preview__heading">
          <p className="home-work-preview__eyebrow">Lavori selezionati</p>
          <Link href="/work" className="home-work-preview__cta">
            Vedi tutti
          </Link>
        </div>
        <div className="home-work-preview__grid">
          {workItems.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={workRoute(item.slug)}
              className="home-work-preview__card"
              style={{ backgroundColor: item.accent }}
            >
              <video
                src={item.previewVideo}
                autoPlay
                muted
                loop
                playsInline
                className="home-work-preview__card-video"
              />
              <div className="home-work-preview__card-inner">
                <p>{item.year}</p>
                <h2>{item.title}</h2>
                <span>{item.summary}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
