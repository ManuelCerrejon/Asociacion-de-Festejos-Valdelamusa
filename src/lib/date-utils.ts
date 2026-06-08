const spanishDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getIsoDateParts(value: string) {
  if (!isIsoDate(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return { day, month, year };
}

export function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSpanishDate(value: string) {
  if (!isIsoDate(value)) {
    return value;
  }

  const parts = getIsoDateParts(value);

  if (!parts) {
    return value;
  }

  const { day, month, year } = parts;
  return spanishDateFormatter.format(new Date(year, month - 1, day));
}

export function getDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }

  return isIsoDate(value) ? value : "";
}

export function getEventDayDiff(value: string) {
  if (!isIsoDate(value)) {
    return null;
  }

  const parts = getIsoDateParts(value);

  if (!parts) {
    return null;
  }

  const { day, month, year } = parts;
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(
    (eventDate.getTime() - todayDate.getTime()) / millisecondsPerDay,
  );

  return diffDays;
}

export function isUpcomingEvent(value: string) {
  const diffDays = getEventDayDiff(value);
  return diffDays !== null && diffDays >= 0;
}

export function getEventCountdown(value: string) {
  const diffDays = getEventDayDiff(value);

  if (diffDays === null) {
    return "";
  }

  if (diffDays < 0) {
    return "Finalizado";
  }

  if (diffDays === 0) {
    return "Hoy";
  }

  if (diffDays === 1) {
    return "Mañana";
  }

  return `Faltan ${diffDays} días`;
}
