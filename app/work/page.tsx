import Link from "next/link";
import { workItems } from "@/data/work";
import { workRoute } from "@/lib/routes";

export default function WorkPage() {
  return (
    <main className="work-page">
      <section className="work-page__hero">
        <p className="work-page__eyebrow">Lavori selezionati</p>
        <div>
          <h1>Lavori</h1>
          <p className="work-page__intro">
            Una selezione di progetti digitali tra design, sviluppo e motion.
          </p>
        </div>
      </section>
      <section className="work-page__grid">
        {workItems.map((item) => (
          <article key={item.slug} className="work-page__card">
            <Link
              href={workRoute(item.slug)}
              className="work-page__card-link"
              style={{ backgroundColor: item.accent }}
            >
              <video
                src={item.previewVideo}
                autoPlay
                muted
                loop
                playsInline
                className="work-page__card-video"
              />
              <div className="work-page__card-copy">
                <p>{item.year}</p>
                <h2>{item.title}</h2>
                <p className="work-page__card-summary">{item.summary}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
