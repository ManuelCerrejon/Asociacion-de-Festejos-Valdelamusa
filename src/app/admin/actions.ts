"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getAdminSupabase, storageBucket } from "@/lib/supabase";

async function requireAdminSupabase() {
  const session = await getAdminSession();
  const supabase = getAdminSupabase();

  if (!session) {
    throw new Error("No tienes permiso para realizar esta accion.");
  }

  if (!supabase) {
    throw new Error("Faltan variables de entorno de Supabase para admin.");
  }

  return supabase;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function uploadImageIfPresent(formData: FormData, key = "image") {
  const file = formData.get(key);

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return uploadFile(file);
}

async function uploadFile(file: File) {
  const supabase = await requireAdminSupabase();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${new Date().getFullYear()}/${randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(storageBucket)
    .upload(path, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadAssociatedImages(
  formData: FormData,
  ownerType: "event" | "post",
  ownerId: string,
) {
  const files = formData
    .getAll("additional_images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0) {
    return;
  }

  const supabase = await requireAdminSupabase();
  const rows = await Promise.all(
    files.map(async (file, index) => ({
      owner_type: ownerType,
      owner_id: ownerId,
      image_url: await uploadFile(file),
      alt_text: file.name,
      position: index,
    })),
  );

  const { error } = await supabase.from("content_images").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

function revalidateContent(detailPath?: string) {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/noticias");
  revalidatePath("/galeria");
  revalidatePath("/admin");

  if (detailPath) {
    revalidatePath(detailPath);
  }
}

export async function createEvent(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const imageUrl = await uploadImageIfPresent(formData);

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: getString(formData, "title"),
      description: getString(formData, "description"),
      event_date: getString(formData, "event_date"),
      location: getString(formData, "location"),
      image_url: imageUrl,
      is_published: getBoolean(formData, "is_published"),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.id) {
    await uploadAssociatedImages(formData, "event", data.id);
  }

  revalidateContent();
}

export async function updateEvent(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const imageUrl = await uploadImageIfPresent(formData);

  const payload: Record<string, string | boolean | null> = {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    event_date: getString(formData, "event_date"),
    location: getString(formData, "location"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  const { error } = await supabase.from("events").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await uploadAssociatedImages(formData, "event", id);

  revalidateContent(`/eventos/${id}`);
}

export async function deleteEvent(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");

  await supabase
    .from("content_images")
    .delete()
    .eq("owner_type", "event")
    .eq("owner_id", id);

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent();
}

export async function createPost(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const imageUrl = await uploadImageIfPresent(formData);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: getString(formData, "title"),
      excerpt: getString(formData, "excerpt"),
      content: getString(formData, "content"),
      category: getString(formData, "category") || "Noticias",
      published_at: getString(formData, "published_at"),
      image_url: imageUrl,
      is_published: getBoolean(formData, "is_published"),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.id) {
    await uploadAssociatedImages(formData, "post", data.id);
  }

  revalidateContent();
}

export async function updatePost(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const imageUrl = await uploadImageIfPresent(formData);

  const payload: Record<string, string | boolean | null> = {
    title: getString(formData, "title"),
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    category: getString(formData, "category") || "Noticias",
    published_at: getString(formData, "published_at"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  const { error } = await supabase.from("posts").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await uploadAssociatedImages(formData, "post", id);

  revalidateContent(`/noticias/${id}`);
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");

  await supabase
    .from("content_images")
    .delete()
    .eq("owner_type", "post")
    .eq("owner_id", id);

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent();
}

export async function createGalleryImage(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const imageUrl = await uploadImageIfPresent(formData);

  if (!imageUrl) {
    throw new Error("Selecciona una imagen para subir.");
  }

  const { error } = await supabase.from("gallery_images").insert({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    image_url: imageUrl,
    is_published: getBoolean(formData, "is_published"),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent();
}

export async function updateGalleryImage(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const imageUrl = await uploadImageIfPresent(formData);

  const payload: Record<string, string | boolean> = {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    is_published: getBoolean(formData, "is_published"),
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  const { error } = await supabase
    .from("gallery_images")
    .update(payload)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent();
}

export async function deleteGalleryImage(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", getString(formData, "id"));

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent();
}

export async function deleteAssociatedImage(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const ownerType = getString(formData, "owner_type");
  const ownerId = getString(formData, "owner_id");

  const { error } = await supabase.from("content_images").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateContent(
    ownerType === "event" ? `/eventos/${ownerId}` : `/noticias/${ownerId}`,
  );
}
