import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  date: string;
  title: string;
  description: string;
  href?: string;
  location: string;
  image?: string;
};

export function EventCard({
  date,
  title,
  description,
  href,
  location,
  image,
}: EventCardProps) {
  const [day, ...restDate] = date.split(" ");
  const dateDetail = restDate.join(" ");

  const card = (
    <article className="group h-full overflow-hidden rounded-lg border border-azul-noche/10 bg-white shadow-sm transition duration-300 hover:border-grana/25 hover:shadow-xl hover:shadow-azul-noche/10">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-azul-noche/10">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-noche/70 via-azul-noche/10 to-transparent" />
          <div className="absolute left-4 top-4 rounded-md bg-white px-3 py-2 text-center shadow-md">
            <span className="block text-xl font-black leading-none text-grana">
              {day}
            </span>
            {dateDetail ? (
              <span className="mt-1 block max-w-20 text-xs font-bold uppercase leading-tight text-azul-noche">
                {dateDetail}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="p-5">
        {!image ? (
          <p className="text-sm font-bold uppercase tracking-wider text-grana">
            {date}
          </p>
        ) : null}
        <h3 className="mt-3 text-xl font-bold text-azul-noche">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700">
          <span className="inline-flex w-fit rounded-full bg-grana/10 px-3 py-1 text-grana">
            {location}
          </span>
          <span className="text-slate-500">{date}</span>
        </div>
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
      aria-label={`Ver evento ${title}`}
    >
      {card}
    </Link>
  );
}
