const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Eventos", href: "#eventos" },
  { label: "Noticias", href: "#noticias" },
  { label: "Galeria", href: "#galeria" },
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-azul-noche/95 text-white backdrop-blur">
      <nav
        aria-label="Navegacion principal"
        className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white text-sm font-black text-grana">
            AFV
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold uppercase tracking-wider text-white/70">
              Asociacion de Festejos
            </span>
            <span className="block text-lg font-bold">Valdelamusa</span>
          </span>
        </a>

        <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-medium lg:flex-wrap lg:justify-end lg:overflow-visible lg:pb-0">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-2 text-white/82 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
