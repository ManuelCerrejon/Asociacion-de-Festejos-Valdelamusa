"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getAdminSupabase, storageBucket } from "@/lib/supabase";

export type AdminActionResult =
  | {
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

async function toActionResult(
  action: () => Promise<void>,
): Promise<AdminActionResult> {
  try {
    await action();
    return { ok: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo completar la accion. Revisa Supabase y Storage.",
      ok: false,
    };
  }
}

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

function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = `/storage/v1/object/public/${storageBucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
}

async function deleteStorageObject(publicUrl: string | null) {
  if (!publicUrl) {
    return;
  }

  const path = getStoragePathFromPublicUrl(publicUrl);

  if (!path) {
    return;
  }

  const supabase = await requireAdminSupabase();
  const { error } = await supabase.storage.from(storageBucket).remove([path]);

  if (error) {
    throw new Error(`No se pudo eliminar la imagen de Storage: ${error.message}`);
  }
}

async function deleteStorageObjects(publicUrls: Array<string | null>) {
  const paths = publicUrls
    .map((url) => (url ? getStoragePathFromPublicUrl(url) : null))
    .filter((path): path is string => Boolean(path));

  if (paths.length === 0) {
    return;
  }

  const supabase = await requireAdminSupabase();
  const { error } = await supabase.storage.from(storageBucket).remove(paths);

  if (error) {
    throw new Error(`No se pudieron eliminar imagenes de Storage: ${error.message}`);
  }
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
    throw new Error(`Error de Supabase Storage al subir imagen: ${error.message}`);
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
  const { data: lastImage, error: positionError } = await supabase
    .from("content_images")
    .select("position")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    throw new Error(
      `No se pudo calcular la posicion de las imagenes adicionales: ${positionError.message}`,
    );
  }

  const basePosition =
    typeof lastImage?.position === "number" ? lastImage.position + 1 : 0;

  const rows = await Promise.all(
    files.map(async (file, index) => ({
      owner_type: ownerType,
      owner_id: ownerId,
      image_url: await uploadFile(file),
      alt_text: file.name,
      position: basePosition + index,
    })),
  );

  const { error } = await supabase.from("content_images").insert(rows);

  if (error) {
    throw new Error(
      `No se pudieron guardar las imagenes adicionales en Supabase: ${error.message}`,
    );
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

async function createEventUnsafe(formData: FormData) {
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
    throw new Error(`No se pudo crear el evento en Supabase: ${error.message}`);
  }

  if (data?.id) {
    await uploadAssociatedImages(formData, "event", data.id);
  }

  revalidateContent();
}

async function updateEventUnsafe(formData: FormData) {
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
    throw new Error(`No se pudo actualizar el evento en Supabase: ${error.message}`);
  }

  await uploadAssociatedImages(formData, "event", id);

  revalidateContent(`/eventos/${id}`);
}

async function deleteEventUnsafe(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");

  const { data: images, error: imagesError } = await supabase
    .from("content_images")
    .select("image_url")
    .eq("owner_type", "event")
    .eq("owner_id", id);

  if (imagesError) {
    throw new Error(
      `No se pudieron consultar las imagenes adicionales del evento: ${imagesError.message}`,
    );
  }

  await deleteStorageObjects((images ?? []).map((image) => image.image_url));

  const { error: contentImagesError } = await supabase
    .from("content_images")
    .delete()
    .eq("owner_type", "event")
    .eq("owner_id", id);

  if (contentImagesError) {
    throw new Error(
      `No se pudieron eliminar las imagenes adicionales del evento: ${contentImagesError.message}`,
    );
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`No se pudo eliminar el evento en Supabase: ${error.message}`);
  }

  revalidateContent();
}

async function createPostUnsafe(formData: FormData) {
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
    throw new Error(`No se pudo crear la noticia en Supabase: ${error.message}`);
  }

  if (data?.id) {
    await uploadAssociatedImages(formData, "post", data.id);
  }

  revalidateContent();
}

async function updatePostUnsafe(formData: FormData) {
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
    throw new Error(`No se pudo actualizar la noticia en Supabase: ${error.message}`);
  }

  await uploadAssociatedImages(formData, "post", id);

  revalidateContent(`/noticias/${id}`);
}

async function deletePostUnsafe(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");

  const { data: images, error: imagesError } = await supabase
    .from("content_images")
    .select("image_url")
    .eq("owner_type", "post")
    .eq("owner_id", id);

  if (imagesError) {
    throw new Error(
      `No se pudieron consultar las imagenes adicionales de la noticia: ${imagesError.message}`,
    );
  }

  await deleteStorageObjects((images ?? []).map((image) => image.image_url));

  const { error: contentImagesError } = await supabase
    .from("content_images")
    .delete()
    .eq("owner_type", "post")
    .eq("owner_id", id);

  if (contentImagesError) {
    throw new Error(
      `No se pudieron eliminar las imagenes adicionales de la noticia: ${contentImagesError.message}`,
    );
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`No se pudo eliminar la noticia en Supabase: ${error.message}`);
  }

  revalidateContent();
}

async function createGalleryImageUnsafe(formData: FormData) {
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
    throw new Error(
      `No se pudo guardar la imagen de galeria en Supabase: ${error.message}`,
    );
  }

  revalidateContent();
}

async function updateGalleryImageUnsafe(formData: FormData) {
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
    throw new Error(
      `No se pudo actualizar la imagen de galeria en Supabase: ${error.message}`,
    );
  }

  revalidateContent();
}

async function deleteGalleryImageUnsafe(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const { data: image, error: readError } = await supabase
    .from("gallery_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    throw new Error(
      `No se pudo consultar la imagen de galeria en Supabase: ${readError.message}`,
    );
  }

  await deleteStorageObject(image?.image_url ?? null);

  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `No se pudo eliminar la imagen de galeria en Supabase: ${error.message}`,
    );
  }

  revalidateContent();
}

async function deleteAssociatedImageUnsafe(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = getString(formData, "id");
  const ownerType = getString(formData, "owner_type");
  const ownerId = getString(formData, "owner_id");

  if (ownerType !== "event" && ownerType !== "post") {
    throw new Error("Tipo de propietario invalido para la imagen asociada.");
  }

  const { data: image, error: readError } = await supabase
    .from("content_images")
    .select("image_url")
    .eq("id", id)
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (readError) {
    throw new Error(
      `No se pudo consultar la imagen asociada en Supabase: ${readError.message}`,
    );
  }

  if (!image) {
    throw new Error("La imagen asociada no existe o ya fue eliminada.");
  }

  await deleteStorageObject(image.image_url);

  const { error } = await supabase.from("content_images").delete().eq("id", id);

  if (error) {
    throw new Error(
      `No se pudo eliminar la imagen asociada en Supabase: ${error.message}`,
    );
  }

  revalidateContent(
    ownerType === "event" ? `/eventos/${ownerId}` : `/noticias/${ownerId}`,
  );
}

export async function createEvent(formData: FormData) {
  return toActionResult(() => createEventUnsafe(formData));
}

export async function updateEvent(formData: FormData) {
  return toActionResult(() => updateEventUnsafe(formData));
}

export async function deleteEvent(formData: FormData) {
  return toActionResult(() => deleteEventUnsafe(formData));
}

export async function createPost(formData: FormData) {
  return toActionResult(() => createPostUnsafe(formData));
}

export async function updatePost(formData: FormData) {
  return toActionResult(() => updatePostUnsafe(formData));
}

export async function deletePost(formData: FormData) {
  return toActionResult(() => deletePostUnsafe(formData));
}

export async function createGalleryImage(formData: FormData) {
  return toActionResult(() => createGalleryImageUnsafe(formData));
}

export async function updateGalleryImage(formData: FormData) {
  return toActionResult(() => updateGalleryImageUnsafe(formData));
}

export async function deleteGalleryImage(formData: FormData) {
  return toActionResult(() => deleteGalleryImageUnsafe(formData));
}

export async function deleteAssociatedImage(formData: FormData) {
  return toActionResult(() => deleteAssociatedImageUnsafe(formData));
}
