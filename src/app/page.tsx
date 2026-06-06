import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import {
  getPublishedEvents,
  getPublishedGalleryImages,
  getPublishedPosts,
} from "@/lib/content";

export default async function Home() {
  const [events, posts, gallery] = await Promise.all([
    getPublishedEvents(),
    getPublishedPosts(),
    getPublishedGalleryImages(),
  ]);

  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />

      <main>
        <section className="relative isolate flex min-h-[68vh] items-end overflow-hidden bg-azul-noche text-white sm:min-h-[75vh]">
          <Image
            src="/hero-valdelamusa.png"
            alt="Ambiente festivo en una plaza de Valdelamusa al anochecer"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-azul-noche/92 via-azul-noche/58 to-grana/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-noche via-azul-noche/35 to-transparent" />

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-24 sm:px-6 sm:pb-18 sm:pt-28 lg:px-8">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/82 backdrop-blur">
              Web oficial
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] sm:text-6xl lg:text-7xl">
              Asociacion de Festejos Valdelamusa
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/84 sm:text-xl">
              Un espacio para compartir eventos, noticias y recuerdos de las
              celebraciones que unen a Valdelamusa.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/eventos"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-grana px-5 py-3 text-sm font-bold text-white shadow-lg shadow-grana/25 transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-white"
              >
                Ver eventos
              </Link>
              <Link
                href="/contacto"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/50 bg-white/8 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-azul-noche focus:outline-none focus:ring-2 focus:ring-white"
              >
                Contactar
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-hueso py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-grana">
                Eventos
              </p>
              <h2 className="mt-3 text-3xl font-black text-azul-noche sm:text-4xl">
                Proximos eventos
              </h2>
            </div>
            {events.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {events.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id ?? event.title}
                    {...event}
                    href={event.id ? `/eventos/${event.id}` : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-lg border border-dashed border-azul-noche/20 bg-white p-6 text-sm font-semibold text-slate-600">
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

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-grana">
                  Noticias
                </p>
                <h2 className="mt-3 text-3xl font-black text-azul-noche sm:text-4xl">
                  Ultimas noticias
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Comunicados, cronicas y avisos importantes de la asociacion.
              </p>
            </div>
            {posts.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {posts.slice(0, 3).map((post) => (
                  <PostCard
                    key={post.id ?? post.title}
                    {...post}
                    href={post.id ? `/noticias/${post.id}` : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-lg border border-dashed border-azul-noche/20 bg-hueso p-6 text-sm font-semibold text-slate-600">
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
        <section className="bg-azul-noche py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wider text-white/65">
              Galería
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Recuerdos para compartir
            </h2>
            {gallery.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {gallery.slice(0, 4).map((image) => (
                  <Link
                    key={image.id ?? image.title}
                    href="/galeria"
                    className="group block overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/15 transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 focus:ring-offset-azul-noche"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/10">
                      <Image
                        src={image.image}
                        alt={image.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-azul-noche/80 via-azul-noche/10 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-black text-white">
                        {image.title}
                      </h3>
                      {image.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/72">
                          {image.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {["Fiestas", "Música", "Vecindad", "Tradición"].map((item) => (
                  <Link
                    key={item}
                    href="/galeria"
                    className="group flex aspect-[4/3] items-end rounded-lg bg-white/10 p-4 text-sm font-bold ring-1 ring-white/15 transition duration-300 hover:-translate-y-1 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 focus:ring-offset-azul-noche"
                  >
                    <span>{item}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/galeria"
              className="mt-8 inline-flex min-h-11 items-center rounded-md bg-white px-5 py-2 text-sm font-bold text-azul-noche transition hover:bg-grana hover:text-white"
            >
              Abrir galería
            </Link>
          </div>
        </section>

        <section className="bg-hueso py-16 sm:py-24">
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

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-grana p-6 text-white shadow-xl shadow-grana/15 sm:p-8">
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
