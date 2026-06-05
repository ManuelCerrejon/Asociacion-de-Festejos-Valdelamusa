import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href?: string;
  image?: string;
};

export function PostCard({
  category,
  title,
  excerpt,
  date,
  href,
  image,
}: PostCardProps) {
  const card = (
    <article className="overflow-hidden rounded-lg border border-white/70 bg-white shadow-sm">
      {image ? (
        <div className="relative aspect-[16/10] bg-azul-noche/10">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-grana/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-grana">
            {category}
          </span>
          <time className="text-xs font-medium text-slate-500">{date}</time>
        </div>
        <h3 className="mt-4 text-xl font-bold text-azul-noche">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      className="block transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2"
      aria-label={`Leer noticia ${title}`}
    >
      {card}
    </Link>
  );
}
