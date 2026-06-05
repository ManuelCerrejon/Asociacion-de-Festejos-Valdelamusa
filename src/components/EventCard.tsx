type EventCardProps = {
  date: string;
  title: string;
  description: string;
  location: string;
};

export function EventCard({
  date,
  title,
  description,
  location,
}: EventCardProps) {
  return (
    <article className="rounded-lg border border-azul-noche/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wider text-grana">
        {date}
      </p>
      <h3 className="mt-3 text-xl font-bold text-azul-noche">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700">
        {location}
      </p>
    </article>
  );
}
