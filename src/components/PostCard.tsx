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
    <article className="group h-full overflow-hidden rounded-lg border border-azul-noche/8 bg-white shadow-sm transition duration-300 hover:border-grana/25 hover:shadow-xl hover:shadow-azul-noche/10">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-azul-noche/10 sm:aspect-[16/10]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-noche/55 via-transparent to-transparent opacity-80" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-grana/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-grana">
            {category}
          </span>
          <time className="text-xs font-medium text-slate-500">{date}</time>
        </div>
        <h3 className="mt-4 text-xl font-black leading-tight text-azul-noche">
          {title}
        </h3>
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
      className="block h-full transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2"
      aria-label={`Leer noticia ${title}`}
    >
      {card}
    </Link>
  );
}
