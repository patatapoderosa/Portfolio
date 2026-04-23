import { notFound } from "next/navigation";
import { getWorkItem } from "@/data/work";

export default async function WorkDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="work-detail-page">
      <section className="work-detail-page__hero">
        <div
          className="work-detail-page__video-wrap"
          style={{ backgroundColor: item.accent }}
        >
          <video
            src={item.previewVideo}
            autoPlay
            muted
            loop
            playsInline
            className="work-detail-page__video"
          />
        </div>
        <p className="work-detail-page__year">{item.year}</p>
        <h1>{item.title}</h1>
        <p className="work-detail-page__summary">{item.summary}</p>
      </section>
      <section className="work-detail-page__meta">
        <h2>Servizi</h2>
        <ul>
          {item.services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
