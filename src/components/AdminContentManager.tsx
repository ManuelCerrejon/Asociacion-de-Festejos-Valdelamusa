"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createEvent,
  createGalleryImage,
  createPost,
  deleteEvent,
  deleteGalleryImage,
  deletePost,
  updateEvent,
  updateGalleryImage,
  updatePost,
} from "@/app/admin/actions";
import type { EventRow, GalleryRow, PostRow } from "@/lib/content-types";

type AdminContentManagerProps = {
  events: EventRow[];
  gallery: GalleryRow[];
  posts: PostRow[];
};

type EditingState = {
  event: string | null;
  gallery: string | null;
  post: string | null;
};

export function AdminContentManager({
  events,
  gallery,
  posts,
}: AdminContentManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditingState>({
    event: null,
    gallery: null,
    post: null,
  });

  async function runAndRefresh(action: (formData: FormData) => Promise<void>, formData: FormData) {
    await action(formData);
    setEditing({ event: null, gallery: null, post: null });
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <form
          action={(formData) => runAndRefresh(createEvent, formData)}
          className="rounded-lg bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-black text-azul-noche">Crear evento</h2>
          <div className="mt-5 grid gap-4">
            <TextInput label="Titulo" name="title" />
            <TextInput label="Fecha" name="event_date" />
            <TextInput label="Ubicacion" name="location" />
            <TextArea label="Descripcion" name="description" />
            <ImageInput />
            <PublishedCheckbox />
            <SubmitButton>Guardar evento</SubmitButton>
          </div>
        </form>

        <form
          action={(formData) => runAndRefresh(createPost, formData)}
          className="rounded-lg bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-black text-azul-noche">Crear noticia</h2>
          <div className="mt-5 grid gap-4">
            <TextInput label="Titulo" name="title" />
            <TextInput label="Categoria" name="category" />
            <TextInput label="Fecha" name="published_at" />
            <TextArea label="Resumen" name="excerpt" rows={3} />
            <TextArea label="Contenido" name="content" rows={5} />
            <ImageInput />
            <PublishedCheckbox />
            <SubmitButton>Guardar noticia</SubmitButton>
          </div>
        </form>

        <form
          action={(formData) => runAndRefresh(createGalleryImage, formData)}
          className="rounded-lg bg-white p-5 shadow-sm"
        >
          <h2 className="text-xl font-black text-azul-noche">Subir imagen</h2>
          <div className="mt-5 grid gap-4">
            <TextInput label="Titulo" name="title" />
            <TextArea label="Descripcion" name="description" />
            <ImageInput />
            <PublishedCheckbox />
            <SubmitButton>Subir a galeria</SubmitButton>
          </div>
        </form>
      </div>

      <AdminSection title="Eventos creados" count={events.length}>
        <div className="grid gap-4">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                <ImagePreview alt={event.title} src={event.image_url} />
                <div>
                  <StatusBadge published={event.is_published} />
                  <h3 className="mt-3 text-xl font-black text-azul-noche">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-grana">
                    {event.event_date} · {event.location}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditing((current) => ({
                          ...current,
                          event: current.event === event.id ? null : event.id,
                        }))
                      }
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-azul-noche px-4 py-2 text-sm font-bold text-white transition hover:bg-grana"
                    >
                      {editing.event === event.id ? "Cancelar" : "Editar"}
                    </button>
                    <form
                      action={(formData) => runAndRefresh(deleteEvent, formData)}
                      onSubmit={(submitEvent) => {
                        if (!window.confirm(`Eliminar el evento "${event.title}"?`)) {
                          submitEvent.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={event.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </div>
              </div>

              {editing.event === event.id ? (
                <form
                  action={(formData) => runAndRefresh(updateEvent, formData)}
                  className="mt-6 grid gap-4 border-t border-slate-100 pt-5"
                >
                  <input type="hidden" name="id" value={event.id} />
                  <TextInput label="Titulo" name="title" defaultValue={event.title} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Fecha"
                      name="event_date"
                      defaultValue={event.event_date}
                    />
                    <TextInput
                      label="Ubicacion"
                      name="location"
                      defaultValue={event.location}
                    />
                  </div>
                  <TextArea
                    label="Descripcion"
                    name="description"
                    defaultValue={event.description}
                  />
                  <ImageInput />
                  <PublishedCheckbox defaultChecked={event.is_published} />
                  <SubmitButton>Actualizar evento</SubmitButton>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Noticias creadas" count={posts.length}>
        <div className="grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                <ImagePreview alt={post.title} src={post.image_url} />
                <div>
                  <StatusBadge published={post.is_published} />
                  <h3 className="mt-3 text-xl font-black text-azul-noche">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-grana">
                    {post.category} · {post.published_at}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditing((current) => ({
                          ...current,
                          post: current.post === post.id ? null : post.id,
                        }))
                      }
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-azul-noche px-4 py-2 text-sm font-bold text-white transition hover:bg-grana"
                    >
                      {editing.post === post.id ? "Cancelar" : "Editar"}
                    </button>
                    <form
                      action={(formData) => runAndRefresh(deletePost, formData)}
                      onSubmit={(submitEvent) => {
                        if (!window.confirm(`Eliminar la noticia "${post.title}"?`)) {
                          submitEvent.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={post.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </div>
              </div>

              {editing.post === post.id ? (
                <form
                  action={(formData) => runAndRefresh(updatePost, formData)}
                  className="mt-6 grid gap-4 border-t border-slate-100 pt-5"
                >
                  <input type="hidden" name="id" value={post.id} />
                  <TextInput label="Titulo" name="title" defaultValue={post.title} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Categoria"
                      name="category"
                      defaultValue={post.category}
                    />
                    <TextInput
                      label="Fecha"
                      name="published_at"
                      defaultValue={post.published_at}
                    />
                  </div>
                  <TextArea label="Resumen" name="excerpt" defaultValue={post.excerpt} />
                  <TextArea
                    label="Contenido"
                    name="content"
                    defaultValue={post.content}
                    rows={5}
                  />
                  <ImageInput />
                  <PublishedCheckbox defaultChecked={post.is_published} />
                  <SubmitButton>Actualizar noticia</SubmitButton>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Imagenes de galeria" count={gallery.length}>
        <div className="grid gap-5 lg:grid-cols-3">
          {gallery.map((image) => (
            <article key={image.id} className="rounded-lg bg-white p-5 shadow-sm">
              <ImagePreview alt={image.title} src={image.image_url} />
              <StatusBadge published={image.is_published} />
              <h3 className="mt-3 text-lg font-black text-azul-noche">
                {image.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {image.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditing((current) => ({
                      ...current,
                      gallery: current.gallery === image.id ? null : image.id,
                    }))
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-azul-noche px-4 py-2 text-sm font-bold text-white transition hover:bg-grana"
                >
                  {editing.gallery === image.id ? "Cancelar" : "Editar"}
                </button>
                <form
                  action={(formData) => runAndRefresh(deleteGalleryImage, formData)}
                  onSubmit={(submitEvent) => {
                    if (!window.confirm(`Eliminar la imagen "${image.title}"?`)) {
                      submitEvent.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={image.id} />
                  <DeleteButton />
                </form>
              </div>

              {editing.gallery === image.id ? (
                <form
                  action={(formData) => runAndRefresh(updateGalleryImage, formData)}
                  className="mt-6 grid gap-4 border-t border-slate-100 pt-5"
                >
                  <input type="hidden" name="id" value={image.id} />
                  <TextInput label="Titulo" name="title" defaultValue={image.title} />
                  <TextArea
                    label="Descripcion"
                    name="description"
                    defaultValue={image.description}
                  />
                  <ImageInput />
                  <PublishedCheckbox defaultChecked={image.is_published} />
                  <SubmitButton>Actualizar imagen</SubmitButton>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </AdminSection>
    </section>
  );
}

function TextInput({
  defaultValue,
  label,
  name,
  placeholder,
  required = true,
  type = "text",
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-azul-noche">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="min-h-11 rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
      />
    </label>
  );
}

function TextArea({
  defaultValue,
  label,
  name,
  placeholder,
  rows = 4,
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-azul-noche">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        required
        className="rounded-md border border-slate-200 px-3 py-3 text-sm font-normal text-slate-900 outline-none transition focus:border-grana focus:ring-2 focus:ring-grana/20"
      />
    </label>
  );
}

function ImageInput() {
  return (
    <label className="grid gap-2 text-sm font-bold text-azul-noche">
      Imagen
      <input
        type="file"
        name="image"
        accept="image/*"
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-azul-noche file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
      />
    </label>
  );
}

function PublishedCheckbox({ defaultChecked = true }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold text-azul-noche">
      <input
        type="checkbox"
        name="is_published"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-grana"
      />
      Publicado
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-grana px-4 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro focus:outline-none focus:ring-2 focus:ring-grana focus:ring-offset-2"
    >
      {children}
    </button>
  );
}

function DeleteButton() {
  return (
    <button
      type="submit"
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-grana px-4 py-2 text-sm font-bold text-grana transition hover:bg-grana hover:text-white"
    >
      Eliminar
    </button>
  );
}

function ImagePreview({ alt, src }: { alt: string; src?: string | null }) {
  if (!src) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-slate-100">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 25vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
        published
          ? "bg-grana/10 text-grana"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}

function AdminSection({
  children,
  count,
  title,
}: {
  children: React.ReactNode;
  count: number;
  title: string;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-black text-azul-noche">{title}</h2>
        <p className="text-sm font-bold text-grana">{count} elementos</p>
      </div>
      {count > 0 ? (
        children
      ) : (
        <div className="rounded-lg border border-dashed border-azul-noche/20 bg-white p-6 text-sm text-slate-600">
          Todavia no hay contenido en esta seccion.
        </div>
      )}
    </section>
  );
}
