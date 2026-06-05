import { PageShell } from "@/components/PageShell";
import { collaborators } from "@/lib/site-data";

const goals = [
  "Organizar y comunicar las celebraciones de Valdelamusa con una gestion cercana.",
  "Fomentar la participacion de vecinos, colectivos y comercios locales.",
  "Conservar la memoria festiva de la localidad a traves de imagenes, cronicas y actividades.",
  "Crear espacios de convivencia para todas las edades.",
];

export default function SobreNosotrosPage() {
  return (
    <PageShell
      eyebrow="Sobre nosotros"
      title="Una asociacion al servicio de las fiestas de Valdelamusa"
      description="Historia, objetivos y red de colaboradores que dan vida a la actividad festiva y cultural de la localidad."
    >
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-grana">
              Historia
            </p>
            <h2 className="mt-3 text-3xl font-black text-azul-noche">
              Fiestas hechas entre todos
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-700">
            <p>
              La Asociacion de Festejos Valdelamusa nace para reunir esfuerzos
              alrededor de las celebraciones de la localidad. Su trabajo se
              apoya en la participacion vecinal, la colaboracion de comercios y
              el compromiso de personas que dedican tiempo a preparar cada
              encuentro.
            </p>
            <p>
              Esta web oficial quiere servir como punto de informacion y memoria
              compartida: un lugar donde consultar actividades, noticias,
              fotografias y canales de contacto de forma sencilla.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-grana">
            Objetivos
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <div
                key={goal}
                className="rounded-lg border border-azul-noche/10 bg-hueso p-5"
              >
                <p className="text-base font-semibold leading-7 text-azul-noche">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-azul-noche py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-white/65">
            Colaboradores
          </p>
          <h2 className="mt-3 text-3xl font-black">Red de apoyo local</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator}
                className="rounded-lg border border-white/15 bg-white/8 p-5 text-sm font-bold text-white"
              >
                {collaborator}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
