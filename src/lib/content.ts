import type {
  EventItem,
  EventRow,
  ContentImageRow,
  GalleryItem,
  GalleryRow,
  PostItem,
  PostRow,
} from "@/lib/content-types";
import { formatSpanishDate } from "@/lib/date-utils";
import { getPublicSupabase } from "@/lib/supabase";

export function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    date: formatSpanishDate(row.event_date),
    description: row.description,
    featured: row.is_featured === true,
    image: row.image_url ?? undefined,
    location: row.location,
    rawDate: row.event_date,
    title: row.title,
  };
}

export function mapPost(row: PostRow): PostItem {
  return {
    id: row.id,
    category: row.category,
    date: formatSpanishDate(row.published_at),
    excerpt: row.excerpt,
    image: row.image_url ?? undefined,
    rawDate: row.published_at,
    title: row.title,
  };
}

export function mapGalleryImage(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    description: row.description,
    image: row.image_url,
    title: row.title,
  };
}

export async function getPublishedEvents() {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error loading events", error.message);
    return [];
  }

  return (data as EventRow[]).map(mapEvent);
}

export async function getPublishedEventById(id: string) {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading event detail", error.message);
    return null;
  }

  return data as EventRow | null;
}

export async function getPublishedEventImages(eventId: string) {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_images")
    .select("*")
    .eq("owner_type", "event")
    .eq("owner_id", eventId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading event images", error.message);
    return [];
  }

  return data as ContentImageRow[];
}

export async function getPublishedPosts() {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading posts", error.message);
    return [];
  }

  return (data as PostRow[]).map(mapPost);
}

export async function getPublishedPostById(id: string) {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading post detail", error.message);
    return null;
  }

  return data as PostRow | null;
}

export async function getPublishedPostImages(postId: string) {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_images")
    .select("*")
    .eq("owner_type", "post")
    .eq("owner_id", postId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading post images", error.message);
    return [];
  }

  return data as ContentImageRow[];
}

export async function getPublishedGalleryImages() {
  const supabase = getPublicSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading gallery images", error.message);
    return [];
  }

  return (data as GalleryRow[]).map(mapGalleryImage);
}
