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
  const selectedPosition = selectedIndex === null ? 0 : selectedIndex + 1;

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
            className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg bg-gradient-to-br from-azul-noche to-azul-noche/92 text-left shadow-sm ring-1 ring-azul-noche/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-azul-noche/10 focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 ${
              index % 5 === 0
                ? "h-72 sm:h-80"
                : index % 3 === 0
                  ? "h-64 sm:h-72"
                  : "h-56 sm:h-60"
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-1 transition duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-azul-noche/90 via-azul-noche/18 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-4">
              <span className="block text-base font-black text-white sm:text-lg">
                {item.title}
              </span>
              {item.description ? (
                <span className="mt-1 line-clamp-2 block text-sm leading-5 text-white/78">
                  {item.description}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-azul-noche/92 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1 bg-azul-noche">
              <div className="relative h-[56vh] max-h-[72vh] min-h-72 sm:h-[68vh]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-wider text-azul-noche shadow-lg transition hover:bg-grana hover:text-white"
              >
                Cerrar
              </button>
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-azul-noche shadow-lg">
                {selectedPosition} / {items.length}
              </span>
              {items.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-azul-noche shadow-lg transition hover:bg-grana hover:text-white"
                    aria-label="Imagen anterior"
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-azul-noche shadow-lg transition hover:bg-grana hover:text-white"
                    aria-label="Imagen siguiente"
                  >
                    {">"}
                  </button>
                </>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-xl font-black text-azul-noche sm:text-2xl">
                  {selectedItem.title}
                </h2>
                {selectedItem.description ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedItem.description}
                  </p>
                ) : null}
              </div>
              {items.length > 1 ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-azul-noche/15 px-4 py-2 text-sm font-bold text-azul-noche transition hover:border-grana hover:text-grana sm:flex-none"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-grana px-4 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro sm:flex-none"
                  >
                    Siguiente
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
