import Link from "next/link";
import { workItems } from "@/data/work";
import { workRoute } from "@/lib/routes";

export default function WorkPage() {
  return (
    <main className="work-page">
      <section className="work-page__hero">
        <h1>Lavori</h1>
        <p>Una selezione di progetti digitali tra design, sviluppo e motion.</p>
      </section>
      <section className="work-page__grid">
        {workItems.map((item) => (
          <article key={item.slug} className="work-page__card">
            <Link href={workRoute(item.slug)} className="work-page__card-link">
              <h2>{item.title}</h2>
              <p>{item.year}</p>
              <p className="work-page__summary">{item.summary}</p>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
