import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { PageShell } from "@/components/PageShell";
import { getPublishedEvents } from "@/lib/content";
import { getIsoDateParts, isUpcomingEvent } from "@/lib/date-utils";

export default async function EventosPage() {
  const events = await getPublishedEvents();
  const upcomingEvents = events.filter((event) => isUpcomingEvent(event.rawDate));
  const pastEvents = events
    .filter((event) => !isUpcomingEvent(event.rawDate))
    .reverse();
  const calendarYear =
    getIsoDateParts(upcomingEvents[0]?.rawDate ?? "")?.year ??
    new Date().getFullYear();

  return (
    <PageShell
      eyebrow="Eventos"
      title="Agenda de actividades"
      description="Consulta las fiestas, encuentros y actividades publicados por la asociacion."
    >
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <div className="space-y-12">
              <EventSection
                title="Próximos eventos"
                emptyText="No hay próximos eventos publicados por ahora."
                events={upcomingEvents}
              />
              <EventSection
                title="Eventos pasados"
                emptyText="Todavía no hay eventos pasados publicados."
                events={pastEvents}
              />
              <AnnualCalendar events={events} year={calendarYear} />
            </div>
          ) : (
            <EmptyState text="Todavia no hay eventos publicados." />
          )}
        </div>
      </section>
    </PageShell>
  );
}

function AnnualCalendar({
  events,
  year,
}: {
  events: Awaited<ReturnType<typeof getPublishedEvents>>;
  year: number;
}) {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const eventsByMonth = monthNames.map((monthName, monthIndex) => ({
    events: events.filter((event) => {
      const parts = getIsoDateParts(event.rawDate);
      return parts?.year === year && parts.month === monthIndex + 1;
    }),
    monthName,
  }));

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-grana">
            Calendario
          </p>
          <h2 className="mt-2 text-2xl font-black text-azul-noche sm:text-3xl">
            Calendario anual {year}
          </h2>
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Eventos publicados agrupados por mes
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {eventsByMonth.map(({ events: monthEvents, monthName }) => (
          <div
            key={monthName}
            className="rounded-lg border border-azul-noche/10 bg-white p-4 shadow-sm"
          >
            <h3 className="text-sm font-black uppercase tracking-wider text-azul-noche">
              {monthName}
            </h3>
            {monthEvents.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {monthEvents.map((event) => (
                  <Link
                    key={event.id ?? event.title}
                    href={event.id ? `/eventos/${event.id}` : "/eventos"}
                    className="rounded-md bg-hueso px-3 py-2 text-sm transition hover:bg-grana hover:text-white"
                  >
                    <span className="block font-black">{event.title}</span>
                    <span className="mt-1 block text-xs font-semibold opacity-75">
                      {event.date} · {event.location}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-md border border-dashed border-azul-noche/15 px-3 py-2 text-sm font-semibold text-slate-400">
                Sin eventos
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EventSection({
  emptyText,
  events,
  title,
}: {
  emptyText: string;
  events: Awaited<ReturnType<typeof getPublishedEvents>>;
  title: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-black text-azul-noche sm:text-3xl">
        {title}
      </h2>
      {events.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id ?? event.title}
              {...event}
              href={event.id ? `/eventos/${event.id}` : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState text={emptyText} />
        </div>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-azul-noche/20 bg-white p-8 text-sm font-semibold text-slate-600">
      {text}
    </div>
  );
}
