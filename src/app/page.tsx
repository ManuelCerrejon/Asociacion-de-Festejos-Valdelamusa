import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { getPublishedEvents, getPublishedPosts } from "@/lib/content";

export default async function Home() {
  const [events, posts] = await Promise.all([
    getPublishedEvents(),
    getPublishedPosts(),
  ]);

  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />

      <main>
        <section className="relative isolate flex min-h-[82vh] items-end overflow-hidden bg-azul-noche text-white">
          <Image
            src="/hero-valdelamusa.png"
            alt="Ambiente festivo en una plaza de Valdelamusa al anochecer"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-azul-noche/35 via-azul-noche/55 to-azul-noche/95" />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/78">
              Web oficial
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Asociacion de Festejos Valdelamusa
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
              Un espacio para compartir eventos, noticias y recuerdos de las
              celebraciones que unen a Valdelamusa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/eventos"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-grana px-5 py-3 text-sm font-bold text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-white"
              >
                Ver eventos
              </Link>
              <Link
                href="/contacto"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/50 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-azul-noche focus:outline-none focus:ring-2 focus:ring-white"
              >
                Contactar
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-hueso py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-grana">
                Eventos
              </p>
              <h2 className="mt-3 text-3xl font-black text-azul-noche sm:text-4xl">
                Proximas actividades
              </h2>
            </div>
            {events.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {events.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id ?? event.title}
                    {...event}
                    href={event.id ? `/eventos/${event.id}` : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-azul-noche/20 bg-white p-6 text-sm font-semibold text-slate-600">
                Todavia no hay eventos publicados.
              </div>
            )}
            <Link
              href="/eventos"
              className="mt-8 inline-flex min-h-11 items-center rounded-md bg-azul-noche px-5 py-2 text-sm font-bold text-white transition hover:bg-grana"
            >
              Ver agenda completa
            </Link>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-grana">
                  Noticias
                </p>
                <h2 className="mt-3 text-3xl font-black text-azul-noche sm:text-4xl">
                  Ultimas novedades
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Comunicados, cronicas y avisos importantes de la asociacion.
              </p>
            </div>
            {posts.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {posts.slice(0, 2).map((post) => (
                  <PostCard
                    key={post.id ?? post.title}
                    {...post}
                    href={post.id ? `/noticias/${post.id}` : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed border-azul-noche/20 bg-hueso p-6 text-sm font-semibold text-slate-600">
                Todavia no hay noticias publicadas.
              </div>
            )}
            <Link
              href="/noticias"
              className="mt-8 inline-flex min-h-11 items-center rounded-md bg-grana px-5 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro"
            >
              Leer noticias
            </Link>
          </div>
        </section>

        <section className="bg-azul-noche py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wider text-white/65">
              Galeria
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Recuerdos para compartir
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Fiestas", "Musica", "Vecindad", "Tradicion"].map((item) => (
                <div
                  key={item}
                  className="flex aspect-square items-end rounded-lg bg-white/10 p-4 text-sm font-bold ring-1 ring-white/15"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/galeria"
              className="mt-8 inline-flex min-h-11 items-center rounded-md bg-white px-5 py-2 text-sm font-bold text-azul-noche transition hover:bg-grana hover:text-white"
            >
              Abrir galeria
            </Link>
          </div>
        </section>

        <section className="bg-hueso py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-grana">
                Sobre nosotros
              </p>
              <h2 className="mt-3 text-3xl font-black text-azul-noche sm:text-4xl">
                Fiestas hechas entre todos
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-slate-700">
              <p>
                La Asociacion de Festejos Valdelamusa trabaja para cuidar,
                organizar y comunicar las celebraciones de la localidad con una
                mirada cercana y participativa.
              </p>
              <p>
                Esta web queda preparada para crecer con nuevas secciones,
                contenidos dinamicos y servicios cuando el proyecto lo necesite.
              </p>
              <Link
                href="/sobre-nosotros"
                className="inline-flex min-h-11 items-center rounded-md bg-azul-noche px-5 py-2 text-sm font-bold text-white transition hover:bg-grana"
              >
                Conocer la asociacion
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-grana p-6 text-white sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-white/70">
                Contacto
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Hablemos de las proximas fiestas
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82">
                Correo, redes sociales y formulario visual para consultas y
                colaboraciones.
              </p>
              <Link
                href="/contacto"
                className="mt-6 inline-flex min-h-11 items-center rounded-md bg-white px-5 py-2 text-sm font-bold text-grana transition hover:bg-azul-noche hover:text-white"
              >
                Ir a contacto
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
