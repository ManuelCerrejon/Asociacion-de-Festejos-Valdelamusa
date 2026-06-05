import Link from "next/link";

const footerLinks = [
  { label: "Eventos", href: "/eventos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Galeria", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer() {
  return (
    <footer className="bg-azul-noche text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-bold">Asociacion de Festejos Valdelamusa</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Celebrando la participacion vecinal, las tradiciones y la vida en
            comunidad de Valdelamusa.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-white/78">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/15 px-3 py-2 transition hover:border-white/45 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
