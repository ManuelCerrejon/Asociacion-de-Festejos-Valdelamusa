import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssociatedImagesGallery } from "@/components/AssociatedImagesGallery";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPublishedEventById, getPublishedEventImages } from "@/lib/content";
import { formatSpanishDate, getEventCountdown } from "@/lib/date-utils";
import { getGoogleCalendarUrl } from "@/lib/share";

export const dynamic = "force-dynamic";

type EventoDetallePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventoDetallePage({
  params,
}: EventoDetallePageProps) {
  const { id } = await params;
  const [event, additionalImages] = await Promise.all([
    getPublishedEventById(id),
    getPublishedEventImages(id),
  ]);

  if (!event) {
    notFound();
  }

  const formattedDate = formatSpanishDate(event.event_date);
  const countdown = getEventCountdown(event.event_date);
  const calendarUrl = getGoogleCalendarUrl({
    description: event.description,
    location: event.location,
    title: event.title,
  });

  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />
      <main>
        <article>
          <section className="bg-azul-noche text-white">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <Link
                href="/eventos"
                className="text-sm font-bold uppercase tracking-wider text-white/65 transition hover:text-white"
              >
                Volver a eventos
              </Link>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.24em] text-white/65">
                Evento
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                {event.title}
              </h1>
              <div className="mt-6 grid gap-3 text-sm font-bold text-white/82 sm:grid-cols-2">
                <p className="rounded-md border border-white/15 px-4 py-3">
                  {formattedDate}
                </p>
                <p className="rounded-md border border-white/15 px-4 py-3">
                  {event.location}
                </p>
              </div>
              {countdown ? (
                <p className="mt-4 inline-flex rounded-full bg-grana px-4 py-2 text-sm font-black text-white">
                  {countdown}
                </p>
              ) : null}
            </div>
          </section>

          <section className="py-10 sm:py-14">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {event.image_url ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-azul-noche shadow-sm">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
                <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                  {event.description}
                </p>
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-grana px-5 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro sm:w-auto"
                  >
                    Añadir al calendario
                  </a>
                </div>
              </div>
              <AssociatedImagesGallery
                images={additionalImages}
                title="Imágenes adicionales"
              />
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
