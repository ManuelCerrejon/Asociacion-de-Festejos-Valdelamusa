import type {
  EventItem,
  EventRow,
  GalleryItem,
  GalleryRow,
  PostItem,
  PostRow,
} from "@/lib/content-types";
import { getPublicSupabase } from "@/lib/supabase";

export function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    date: row.event_date,
    description: row.description,
    image: row.image_url ?? undefined,
    location: row.location,
    title: row.title,
  };
}

export function mapPost(row: PostRow): PostItem {
  return {
    id: row.id,
    category: row.category,
    date: row.published_at,
    excerpt: row.excerpt,
    image: row.image_url ?? undefined,
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading events", error.message);
    return [];
  }

  return (data as EventRow[]).map(mapEvent);
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
