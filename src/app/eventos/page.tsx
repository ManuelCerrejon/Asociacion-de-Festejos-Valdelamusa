import { EventCard } from "@/components/EventCard";
import { PageShell } from "@/components/PageShell";
import { getPublishedEvents } from "@/lib/content";

export default async function EventosPage() {
  const events = await getPublishedEvents();

  return (
    <PageShell
      eyebrow="Eventos"
      title="Agenda de actividades"
      description="Consulta las fiestas, encuentros y actividades publicados por la asociacion."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id ?? event.title}
                  {...event}
                  href={event.id ? `/eventos/${event.id}` : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState text="Todavia no hay eventos publicados." />
          )}
        </div>
      </section>
    </PageShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-azul-noche/20 bg-white p-8 text-sm font-semibold text-slate-600">
      {text}
    </div>
  );
}
