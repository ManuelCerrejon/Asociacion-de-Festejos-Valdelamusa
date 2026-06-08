import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/content";

type NoticiasPageProps = {
  searchParams?: Promise<{
    categoria?: string;
    q?: string;
  }>;
};

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  const params = await searchParams;
  const query = normalizeSearchParam(params?.q);
  const selectedCategory = normalizeSearchParam(params?.categoria);
  const posts = await getPublishedPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "es"));
  const filteredPosts = posts.filter((post) => {
    const matchesQuery = query
      ? [post.title, post.excerpt, post.category]
          .join(" ")
          .toLocaleLowerCase("es")
          .includes(query.toLocaleLowerCase("es"))
      : true;
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;

    return matchesQuery && matchesCategory;
  });

  return (
    <PageShell
      eyebrow="Noticias"
      title="Actualidad de la asociacion"
      description="Publicaciones tipo blog con avisos, cronicas y novedades de Valdelamusa."
    >
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <form className="mb-8 grid gap-3 rounded-lg border border-azul-noche/10 bg-hueso p-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <label className="grid gap-2 text-sm font-bold text-azul-noche">
              Buscar
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar por título, resumen o categoría"
                className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-azul-noche">
              Categoría
              <select
                name="categoria"
                defaultValue={selectedCategory}
                className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-grana px-4 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro sm:flex-none"
              >
                Filtrar
              </button>
              <Link
                href="/noticias"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-azul-noche/15 px-4 py-2 text-sm font-bold text-azul-noche transition hover:border-grana hover:text-grana"
              >
                Limpiar
              </Link>
            </div>
          </form>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id ?? post.title}
                  {...post}
                  href={post.id ? `/noticias/${post.id}` : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState text="No hay noticias que coincidan con la búsqueda." />
          )}
        </div>
      </section>
    </PageShell>
  );
}

function normalizeSearchParam(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-azul-noche/20 bg-hueso p-8 text-sm font-semibold text-slate-600">
      {text}
    </div>
  );
}
