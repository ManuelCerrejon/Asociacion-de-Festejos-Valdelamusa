import Image from "next/image";
import type { ContentImageRow } from "@/lib/content-types";

type AssociatedImagesGalleryProps = {
  images: ContentImageRow[];
  title?: string;
};

export function AssociatedImagesGallery({
  images,
  title = "Galeria de imagenes",
}: AssociatedImagesGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wider text-grana">
        {title}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative min-h-56 overflow-hidden rounded-lg bg-azul-noche ${
              index === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || title}
              fill
              sizes="(min-width: 1024px) 896px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
