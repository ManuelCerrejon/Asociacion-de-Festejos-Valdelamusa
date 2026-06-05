"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryItem = {
  description: string;
  image: string;
  title: string;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedItem =
    selectedIndex === null ? null : items[selectedIndex] ?? null;

  function showPrevious() {
    setSelectedIndex((current) =>
      current === null ? current : (current - 1 + items.length) % items.length,
    );
  }

  function showNext() {
    setSelectedIndex((current) =>
      current === null ? current : (current + 1) % items.length,
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg bg-azul-noche text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 ${
              index % 5 === 0
                ? "h-80"
                : index % 3 === 0
                  ? "h-72"
                  : "h-56"
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-azul-noche/85 via-azul-noche/25 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-4">
              <span className="block text-lg font-bold text-white">
                {item.title}
              </span>
              <span className="mt-1 block text-sm leading-5 text-white/78">
                {item.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-azul-noche/90 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] bg-azul-noche sm:aspect-[16/9]">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              {items.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-azul-noche shadow-lg transition hover:bg-grana hover:text-white"
                    aria-label="Imagen anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-azul-noche shadow-lg transition hover:bg-grana hover:text-white"
                    aria-label="Imagen siguiente"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-azul-noche">
                  {selectedItem.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedItem.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-grana px-5 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
