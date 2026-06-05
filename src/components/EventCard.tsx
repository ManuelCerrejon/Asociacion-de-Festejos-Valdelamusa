import Image from "next/image";

type EventCardProps = {
  date: string;
  title: string;
  description: string;
  location: string;
  image?: string;
};

export function EventCard({
  date,
  title,
  description,
  location,
  image,
}: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-azul-noche/10 bg-white shadow-sm">
      {image ? (
        <div className="relative aspect-[4/3] bg-azul-noche/10">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-noche/45 to-transparent" />
        </div>
      ) : null}
      <div className="p-5">
        <p className="text-sm font-bold uppercase tracking-wider text-grana">
          {date}
        </p>
        <h3 className="mt-3 text-xl font-bold text-azul-noche">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700">
          {location}
        </p>
      </div>
    </article>
  );
}
