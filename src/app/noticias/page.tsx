import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/content";

export default async function NoticiasPage() {
  const posts = await getPublishedPosts();

  return (
    <PageShell
      eyebrow="Noticias"
      title="Actualidad de la asociacion"
      description="Publicaciones tipo blog con avisos, cronicas y novedades de Valdelamusa."
    >
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id ?? post.title}
                  {...post}
                  href={post.id ? `/noticias/${post.id}` : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState text="Todavia no hay noticias publicadas." />
          )}
        </div>
      </section>
    </PageShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-azul-noche/20 bg-hueso p-8 text-sm font-semibold text-slate-600">
      {text}
    </div>
  );
}
