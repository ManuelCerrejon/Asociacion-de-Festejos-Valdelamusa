import Image from "next/image";
import Link from "next/link";
import { getEventCountdown } from "@/lib/date-utils";

type EventCardProps = {
  date: string;
  title: string;
  description: string;
  href?: string;
  location: string;
  image?: string;
  rawDate?: string;
};

export function EventCard({
  date,
  title,
  description,
  href,
  location,
  image,
  rawDate,
}: EventCardProps) {
  const [day, ...restDate] = date.split(" ");
  const dateDetail = restDate.join(" ");
  const countdown = rawDate ? getEventCountdown(rawDate) : "";

  const card = (
    <article className="group h-full overflow-hidden rounded-lg border border-azul-noche/10 bg-white shadow-sm transition duration-300 hover:border-grana/25 hover:shadow-xl hover:shadow-azul-noche/10">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-azul-noche/8 to-grana/8">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain p-1 transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--azul-noche),var(--grana))]" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-md border border-grana/15 bg-grana/10 px-3 py-2 text-center">
            <span className="block text-xl font-black leading-none text-grana">
              {day}
            </span>
            {dateDetail ? (
              <span className="mt-1 block max-w-20 text-[0.68rem] font-bold uppercase leading-tight text-azul-noche">
                {dateDetail}
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black leading-tight text-azul-noche">
              {title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs font-bold">
          {countdown ? (
            <span className="rounded-full bg-grana px-3 py-1 text-white">
              {countdown}
            </span>
          ) : null}
          <span className="rounded-full bg-azul-noche/8 px-3 py-1 text-azul-noche">
            {location}
          </span>
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
