import Link from "next/link";
import { getAdminSession } from "@/lib/auth";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Eventos", href: "/eventos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Galeria", href: "/galeria" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export async function Header() {
  const adminSession = await getAdminSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-azul-noche/92 text-white shadow-lg shadow-azul-noche/10 backdrop-blur-xl">
      <nav
        aria-label="Navegacion principal"
        className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white text-sm font-black text-grana shadow-sm sm:h-11 sm:w-11">
            AFV
          </span>
          <span className="leading-tight">
            <span className="block text-xs font-semibold uppercase tracking-wider text-white/70 sm:text-sm">
              Asociacion de Festejos
            </span>
            <span className="block text-base font-bold sm:text-lg">Valdelamusa</span>
          </span>
        </Link>

        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 text-sm font-semibold lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0 lg:pb-0">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-2 text-white/82 transition hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 sm:px-4"
            >
              {item.label}
            </Link>
          ))}
          {adminSession ? (
            <Link
              href="/admin"
              className="shrink-0 rounded-full bg-grana px-3 py-2 text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-white/70 sm:px-4"
            >
              Administración
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
