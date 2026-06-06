const spanishDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
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

  const [year, month, day] = value.split("-").map(Number);
  return spanishDateFormatter.format(new Date(year, month - 1, day));
}

export function getDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }

  return isIsoDate(value) ? value : "";
}

export function getEventCountdown(value: string) {
  if (!isIsoDate(value)) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);
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
