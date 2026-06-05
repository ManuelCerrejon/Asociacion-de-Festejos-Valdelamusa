import { EventCard } from "@/components/EventCard";
import { PageShell } from "@/components/PageShell";
import { eventItems } from "@/lib/site-data";

export default function EventosPage() {
  return (
    <PageShell
      eyebrow="Eventos"
      title="Agenda de actividades"
      description="Seis citas de ejemplo para visualizar como se presentaran las fiestas, encuentros y actividades de la asociacion."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {eventItems.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
