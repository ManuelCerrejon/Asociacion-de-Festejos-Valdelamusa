import { GalleryGrid } from "@/components/GalleryGrid";
import { PageShell } from "@/components/PageShell";
import { getPublishedGalleryImages } from "@/lib/content";

export default async function GaleriaPage() {
  const gallery = await getPublishedGalleryImages();

  return (
    <PageShell
      eyebrow="Galeria"
      title="Mosaico de recuerdos"
      description="Una galeria responsive conectada a Supabase para abrir cada imagen en modal y consultar sus detalles."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {gallery.length > 0 ? (
            <GalleryGrid items={gallery} />
          ) : (
            <div className="rounded-lg border border-dashed border-azul-noche/20 bg-white p-8 text-sm font-semibold text-slate-600">
              Todavia no hay imagenes publicadas.
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
