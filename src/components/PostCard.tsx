type PostCardProps = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
};

export function PostCard({ category, title, excerpt, date }: PostCardProps) {
  return (
    <article className="rounded-lg border border-white/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-grana/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-grana">
          {category}
        </span>
        <time className="text-xs font-medium text-slate-500">{date}</time>
      </div>
      <h3 className="mt-4 text-xl font-bold text-azul-noche">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
    </article>
  );
}
