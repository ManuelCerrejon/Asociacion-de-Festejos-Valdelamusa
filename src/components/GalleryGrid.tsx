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
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setSelectedItem(item)}
            className={`group relative min-h-56 overflow-hidden rounded-lg bg-azul-noche text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 ${
              index === 0 || index === 5 ? "sm:col-span-2" : ""
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-azul-noche/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl"
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
                onClick={() => setSelectedItem(null)}
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
