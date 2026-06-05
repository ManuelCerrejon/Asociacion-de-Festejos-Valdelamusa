import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { postItems } from "@/lib/site-data";

export default function NoticiasPage() {
  return (
    <PageShell
      eyebrow="Noticias"
      title="Actualidad de la asociacion"
      description="Publicaciones tipo blog con imagen destacada para comunicar avisos, cronicas y novedades de Valdelamusa."
    >
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {postItems.map((post) => (
              <PostCard key={post.title} {...post} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
