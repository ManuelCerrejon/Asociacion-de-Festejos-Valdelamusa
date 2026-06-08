import Link from "next/link";

const email = "asoc.soc.cul.valdelamusa@gmail.com";

const footerLinks = [
  { label: "Inicio", href: "/" },
  { label: "Eventos", href: "/eventos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
];

export function Footer() {
  return (
    <footer className="bg-azul-noche text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-grana text-sm font-black text-white shadow-lg shadow-black/10">
                AFV
              </span>
              <span className="max-w-64 text-lg font-black leading-tight">
                Asociación de Festejos Valdelamusa
              </span>
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/68">
              Celebrando la participación vecinal, las tradiciones y la vida en
              comunidad de Valdelamusa.
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-5 inline-block break-all text-sm font-bold text-white/78 transition hover:text-white"
            >
              {email}
            </a>
          </div>

          <nav aria-label="Enlaces del footer">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
              Navegación
            </p>
            <div className="mt-4 grid gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm font-bold text-white/72 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
              Redes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-3 py-2 text-sm font-bold text-white/72 transition hover:border-grana hover:bg-grana hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              href="/admin"
              className="mt-5 inline-block text-xs font-semibold text-white/42 transition hover:text-white/70"
            >
              Acceso administración
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-white/45">
          © {new Date().getFullYear()} Asociación de Festejos Valdelamusa.
        </div>
      </div>
    </footer>
  );
}
