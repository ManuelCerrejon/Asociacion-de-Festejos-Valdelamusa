import { PageShell } from "@/components/PageShell";

const email = "asoc.soc.cul.valdelamusa@gmail.com";

export default function ContactoPage() {
  return (
    <PageShell
      eyebrow="Contacto"
      title="Canales de contacto"
      description="Informacion de contacto y formulario visual para consultas, propuestas y colaboraciones."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <aside className="rounded-lg bg-azul-noche p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-white/65">
              Datos directos
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-5 block break-words text-xl font-black transition hover:text-white/78"
            >
              {email}
            </a>
            <div className="mt-8 grid gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/15 px-4 py-3 text-sm font-bold transition hover:bg-white hover:text-azul-noche"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/15 px-4 py-3 text-sm font-bold transition hover:bg-white hover:text-azul-noche"
              >
                Instagram
              </a>
            </div>
          </aside>

          <form className="rounded-lg border border-azul-noche/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-azul-noche">
                Nombre
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  className="min-h-12 rounded-md border border-slate-200 px-4 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-azul-noche">
                Correo
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="min-h-12 rounded-md border border-slate-200 px-4 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
                />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-bold text-azul-noche">
              Asunto
              <input
                type="text"
                name="subject"
                placeholder="Consulta, propuesta o colaboracion"
                className="min-h-12 rounded-md border border-slate-200 px-4 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
              />
            </label>
            <label className="mt-5 grid gap-2 text-sm font-bold text-azul-noche">
              Mensaje
              <textarea
                name="message"
                placeholder="Escribe tu mensaje"
                rows={6}
                className="rounded-md border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
              />
            </label>
            <button
              type="button"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-grana px-5 py-3 text-sm font-bold text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2 sm:w-auto"
            >
              Enviar mensaje
            </button>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Formulario visual sin backend. No envia datos todavia.
            </p>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
