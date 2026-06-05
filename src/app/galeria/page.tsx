import { GalleryGrid } from "@/components/GalleryGrid";
import { PageShell } from "@/components/PageShell";
import { galleryItems } from "@/lib/site-data";

export default function GaleriaPage() {
  return (
    <PageShell
      eyebrow="Galeria"
      title="Mosaico de recuerdos"
      description="Una galeria responsive preparada para abrir cada imagen en modal y consultar sus detalles."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid items={galleryItems} />
        </div>
      </section>
    </PageShell>
  );
}
