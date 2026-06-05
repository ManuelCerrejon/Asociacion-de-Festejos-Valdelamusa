export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function getShareUrls({
  path,
  text,
}: {
  path: string;
  text: string;
}) {
  const url = `${getSiteUrl()}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text} ${url}`);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
    url,
  };
}

export function getGoogleCalendarUrl({
  description,
  location,
  title,
}: {
  description: string;
  location: string;
  title: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
