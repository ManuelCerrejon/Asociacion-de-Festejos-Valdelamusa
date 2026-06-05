import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssociatedImagesGallery } from "@/components/AssociatedImagesGallery";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPublishedPostById, getPublishedPostImages } from "@/lib/content";
import { getShareUrls } from "@/lib/share";

export const dynamic = "force-dynamic";

type NoticiaDetallePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoticiaDetallePage({
  params,
}: NoticiaDetallePageProps) {
  const { id } = await params;
  const [post, additionalImages] = await Promise.all([
    getPublishedPostById(id),
    getPublishedPostImages(id),
  ]);

  if (!post) {
    notFound();
  }

  const share = getShareUrls({
    path: `/noticias/${post.id}`,
    text: post.title,
  });

  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />
      <main>
        <article>
          <section className="bg-azul-noche text-white">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <Link
                href="/noticias"
                className="text-sm font-bold uppercase tracking-wider text-white/65 transition hover:text-white"
              >
                Volver a noticias
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-grana">
                  {post.category}
                </span>
                <time className="text-sm font-semibold text-white/72">
                  {post.published_at}
                </time>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 text-base leading-7 text-white/78">
                {post.excerpt}
              </p>
            </div>
          </section>

          <section className="py-10 sm:py-14">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {post.image_url ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-azul-noche shadow-sm">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
                <div className="prose max-w-none whitespace-pre-line text-base leading-8 text-slate-700">
                  {post.content || post.excerpt}
                </div>
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                  <a
                    href={share.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-grana px-5 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro"
                  >
                    Compartir en WhatsApp
                  </a>
                  <a
                    href={share.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-azul-noche px-5 py-2 text-sm font-bold text-white transition hover:bg-grana"
                  >
                    Compartir en Facebook
                  </a>
                </div>
              </div>
              <AssociatedImagesGallery
                images={additionalImages}
                title="Imagenes adicionales"
              />
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
