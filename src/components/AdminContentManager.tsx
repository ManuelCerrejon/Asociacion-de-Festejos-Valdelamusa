"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  type AdminActionResult,
  createEvent,
  createGalleryImage,
  createPost,
  deleteAssociatedImage,
  deleteEvent,
  deleteGalleryImage,
  deletePost,
  updateEvent,
  updateGalleryImage,
  updatePost,
} from "@/app/admin/actions";
import type {
  ContentImageRow,
  EventRow,
  GalleryRow,
  PostRow,
} from "@/lib/content-types";
import {
  formatSpanishDate,
  getDateInputValue,
  getTodayIsoDate,
} from "@/lib/date-utils";

type AdminContentManagerProps = {
  associatedImages: ContentImageRow[];
  events: EventRow[];
  gallery: GalleryRow[];
  posts: PostRow[];
};

type ActionStatus = {
  message: string;
  type: "error" | "success";
} | null;

type ActiveTab = "posts" | "events" | "gallery" | "summary";

type ModalState =
  | { mode: "create"; type: "event" | "gallery" | "post" }
  | { id: string; mode: "edit"; type: "event" | "gallery" | "post" }
  | null;

const tabs: Array<{ id: ActiveTab; label: string }> = [
  { id: "posts", label: "Noticias" },
  { id: "events", label: "Eventos" },
  { id: "gallery", label: "Galeria" },
  { id: "summary", label: "Ajustes / Resumen" },
];

export function AdminContentManager({
  associatedImages,
  events,
  gallery,
  posts,
}: AdminContentManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");
  const [modal, setModal] = useState<ModalState>(null);
  const [status, setStatus] = useState<ActionStatus>(null);

  const imagesByOwner = useMemo(() => {
    return associatedImages.reduce<Record<string, ContentImageRow[]>>(
      (accumulator, image) => {
        const key = `${image.owner_type}:${image.owner_id}`;
        accumulator[key] = [...(accumulator[key] ?? []), image];
        return accumulator;
      },
      {},
    );
  }, [associatedImages]);

  function getAssociatedImages(ownerType: "event" | "post", ownerId: string) {
    return imagesByOwner[`${ownerType}:${ownerId}`] ?? [];
  }

  async function runAndRefresh(
    action: (formData: FormData) => Promise<AdminActionResult>,
    formData: FormData,
    successMessage = "Cambios guardados correctamente.",
  ) {
    setStatus(null);

    const result = await action(formData);

    if (!result.ok) {
      setStatus({ message: result.error, type: "error" });
      return;
    }

    setModal(null);
    setStatus({ message: successMessage, type: "success" });
    router.refresh();
  }

  const editingPost =
    modal?.type === "post" && modal.mode === "edit"
      ? posts.find((post) => post.id === modal.id)
      : undefined;
  const editingEvent =
    modal?.type === "event" && modal.mode === "edit"
      ? events.find((event) => event.id === modal.id)
      : undefined;
  const editingGalleryImage =
    modal?.type === "gallery" && modal.mode === "edit"
      ? gallery.find((image) => image.id === modal.id)
      : undefined;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-azul-noche/10 bg-white p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-md px-4 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-azul-noche text-white"
                  : "text-slate-600 hover:bg-hueso hover:text-azul-noche"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {status ? <ActionMessage status={status} /> : null}

      {activeTab === "posts" ? (
        <AdminPanelHeader
          title="Noticias"
          description="Gestiona las publicaciones, su imagen destacada y sus imagenes adicionales."
          actionLabel="Nueva noticia"
          onAction={() => setModal({ mode: "create", type: "post" })}
        />
      ) : null}

      {activeTab === "events" ? (
        <AdminPanelHeader
          title="Eventos"
          description="Organiza los eventos publicados, imagen principal y galeria adicional."
          actionLabel="Nuevo evento"
          onAction={() => setModal({ mode: "create", type: "event" })}
        />
      ) : null}

      {activeTab === "gallery" ? (
        <AdminPanelHeader
          title="Galeria publica"
          description="Imagenes independientes que aparecen solo en la galeria general."
          actionLabel="Subir imagen"
          onAction={() => setModal({ mode: "create", type: "gallery" })}
        />
      ) : null}

      {activeTab === "summary" ? (
        <SummaryPanel
          events={events.length}
          gallery={gallery.length}
          posts={posts.length}
          associatedImages={associatedImages.length}
        />
      ) : null}

      {activeTab === "posts" ? (
        <ContentList emptyText="Todavia no hay noticias creadas.">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <ImagePreview alt={post.title} src={post.image_url} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge published={post.is_published} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-azul-noche">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-grana">
                    {formatSpanishDate(post.published_at)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                  <AssociatedImageStrip
                    images={getAssociatedImages("post", post.id)}
                    onDelete={runAndRefresh}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SecondaryButton
                      onClick={() =>
                        setModal({ id: post.id, mode: "edit", type: "post" })
                      }
                    >
                      Editar
                    </SecondaryButton>
                    <DeleteForm
                      action={deletePost}
                      id={post.id}
                      label={`Eliminar la noticia "${post.title}"?`}
                      onRun={runAndRefresh}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </ContentList>
      ) : null}

      {activeTab === "events" ? (
        <ContentList emptyText="Todavia no hay eventos creados.">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <ImagePreview alt={event.title} src={event.image_url} />
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge published={event.is_published} />
                    {event.is_featured ? (
                      <span className="inline-flex rounded-full bg-azul-noche px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Destacado
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-xl font-black text-azul-noche">
                    {event.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
                    <span className="rounded-full bg-grana/10 px-3 py-1 text-grana">
                      {formatSpanishDate(event.event_date)}
                    </span>
                    <span className="rounded-full bg-azul-noche/8 px-3 py-1 text-azul-noche">
                      {event.location}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>
                  <AssociatedImageStrip
                    images={getAssociatedImages("event", event.id)}
                    onDelete={runAndRefresh}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SecondaryButton
                      onClick={() =>
                        setModal({ id: event.id, mode: "edit", type: "event" })
                      }
                    >
                      Editar
                    </SecondaryButton>
                    <DeleteForm
                      action={deleteEvent}
                      id={event.id}
                      label={`Eliminar el evento "${event.title}"?`}
                      onRun={runAndRefresh}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </ContentList>
      ) : null}

      {activeTab === "gallery" ? (
        <ContentList emptyText="Todavia no hay imagenes en la galeria.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image) => (
              <article key={image.id} className="rounded-lg bg-white p-4 shadow-sm">
                <ImagePreview alt={image.title} src={image.image_url} />
                <div className="mt-4">
                  <StatusBadge published={image.is_published} />
                  <h3 className="mt-3 text-lg font-black text-azul-noche">
                    {image.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {image.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SecondaryButton
                      onClick={() =>
                        setModal({
                          id: image.id,
                          mode: "edit",
                          type: "gallery",
                        })
                      }
                    >
                      Editar
                    </SecondaryButton>
                    <DeleteForm
                      action={deleteGalleryImage}
                      id={image.id}
                      label={`Eliminar la imagen "${image.title}"?`}
                      onRun={runAndRefresh}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ContentList>
      ) : null}

      {modal?.type === "post" ? (
        <AdminModal
          title={modal.mode === "create" ? "Nueva noticia" : "Editar noticia"}
          onClose={() => setModal(null)}
        >
          <PostForm
            post={editingPost}
            action={(formData) =>
              runAndRefresh(
                modal.mode === "create" ? createPost : updatePost,
                formData,
                "Noticia guardada correctamente.",
              )
            }
          />
        </AdminModal>
      ) : null}

      {modal?.type === "event" ? (
        <AdminModal
          title={modal.mode === "create" ? "Nuevo evento" : "Editar evento"}
          onClose={() => setModal(null)}
        >
          <EventForm
            event={editingEvent}
            action={(formData) =>
              runAndRefresh(
                modal.mode === "create" ? createEvent : updateEvent,
                formData,
                "Evento guardado correctamente.",
              )
            }
          />
        </AdminModal>
      ) : null}

      {modal?.type === "gallery" ? (
        <AdminModal
          title={modal.mode === "create" ? "Subir imagen" : "Editar imagen"}
          onClose={() => setModal(null)}
        >
          <GalleryForm
            image={editingGalleryImage}
            action={(formData) =>
              runAndRefresh(
                modal.mode === "create" ? createGalleryImage : updateGalleryImage,
                formData,
                "Imagen guardada correctamente.",
              )
            }
          />
        </AdminModal>
      ) : null}
    </section>
  );
}

function AdminPanelHeader({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-black text-azul-noche">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-grana px-5 py-2 text-sm font-bold text-white transition hover:bg-grana-oscuro"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function ContentList({
  children,
  emptyText,
}: {
  children: React.ReactNode;
  emptyText: string;
}) {
  const isEmpty =
    Array.isArray(children) && children.length === 0;

  return (
    <div className="mt-6">
      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-azul-noche/20 bg-white p-8 text-sm font-semibold text-slate-600">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-4">{children}</div>
      )}
    </div>
  );
}

function SummaryPanel({
  associatedImages,
  events,
  gallery,
  posts,
}: {
  associatedImages: number;
  events: number;
  gallery: number;
  posts: number;
}) {
  const items = [
    { label: "Noticias", value: posts },
    { label: "Eventos", value: events },
    { label: "Galeria publica", value: gallery },
    { label: "Imagenes asociadas", value: associatedImages },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-grana">
            {item.label}
          </p>
          <p className="mt-3 text-4xl font-black text-azul-noche">
            {item.value}
          </p>
        </div>
      ))}
      <div className="rounded-lg bg-azul-noche p-5 text-white shadow-sm sm:col-span-2 lg:col-span-4">
        <p className="text-sm font-bold uppercase tracking-wider text-white/65">
          Estructura de imagenes
        </p>
        <p className="mt-3 text-sm leading-6 text-white/78">
          Las noticias y eventos usan <strong>image_url</strong> como imagen
          destacada y <strong>content_images</strong> para imagenes adicionales.
          La galeria publica usa solo <strong>gallery_images</strong>.
        </p>
      </div>
    </div>
  );
}

function AdminModal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-azul-noche/70 p-4 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-black text-azul-noche">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-azul-noche"
          >
            Cerrar
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: PostRow;
}) {
  return (
    <form action={action} className="grid gap-4">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <TextInput label="Titulo" name="title" defaultValue={post?.title} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Categoria"
          name="category"
          defaultValue={post?.category}
        />
        <TextInput
          label="Fecha"
          name="published_at"
          type="date"
          defaultValue={getDateInputValue(post?.published_at) || getTodayIsoDate()}
        />
      </div>
      <TextArea label="Resumen" name="excerpt" defaultValue={post?.excerpt} rows={3} />
      <TextArea label="Contenido" name="content" defaultValue={post?.content} rows={7} />
      <ImageInput label="Imagen destacada" />
      <MultipleImageInput />
      <PublishedCheckbox defaultChecked={post?.is_published ?? true} />
      <SubmitButton>{post ? "Guardar cambios" : "Crear noticia"}</SubmitButton>
    </form>
  );
}

function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => void;
  event?: EventRow;
}) {
  return (
    <form action={action} className="grid gap-4">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <TextInput label="Titulo" name="title" defaultValue={event?.title} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Fecha"
          name="event_date"
          type="date"
          defaultValue={getDateInputValue(event?.event_date)}
        />
        <TextInput label="Ubicacion" name="location" defaultValue={event?.location} />
      </div>
      <TextArea
        label="Descripcion"
        name="description"
        defaultValue={event?.description}
        rows={6}
      />
      <ImageInput label="Imagen destacada" />
      <MultipleImageInput />
      <FeaturedCheckbox defaultChecked={event?.is_featured ?? false} />
      <PublishedCheckbox defaultChecked={event?.is_published ?? true} />
      <SubmitButton>{event ? "Guardar cambios" : "Crear evento"}</SubmitButton>
    </form>
  );
}

function GalleryForm({
  action,
  image,
}: {
  action: (formData: FormData) => void;
  image?: GalleryRow;
}) {
  return (
    <form action={action} className="grid gap-4">
      {image ? <input type="hidden" name="id" value={image.id} /> : null}
      <TextInput label="Titulo" name="title" defaultValue={image?.title} />
      <TextArea
        label="Descripcion"
        name="description"
        defaultValue={image?.description}
        rows={4}
      />
      <ImageInput label="Imagen de galeria" />
      <PublishedCheckbox defaultChecked={image?.is_published ?? true} />
      <SubmitButton>{image ? "Guardar cambios" : "Subir imagen"}</SubmitButton>
    </form>
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

function ImageInput({
  label = "Imagen",
}: {
  label?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-azul-noche">
      {label}
      <input
        type="file"
        name="image"
        accept="image/*"
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-azul-noche file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
      />
    </label>
  );
}

function MultipleImageInput() {
  return (
    <label className="grid gap-2 text-sm font-bold text-azul-noche">
      Imagenes adicionales
      <input
        type="file"
        name="additional_images"
        accept="image/*"
        multiple
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-azul-noche file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
      />
    </label>
  );
}

function AssociatedImageStrip({
  images,
  onDelete,
}: {
  images: ContentImageRow[];
  onDelete: (
    action: (formData: FormData) => Promise<AdminActionResult>,
    formData: FormData,
    successMessage?: string,
  ) => Promise<void>;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        Imagenes adicionales
      </p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {images.map((image) => (
          <div key={image.id} className="w-24 shrink-0">
            <ImagePreview alt={image.alt_text || "Imagen asociada"} src={image.image_url} />
            <form
              action={(formData) =>
                onDelete(
                  deleteAssociatedImage,
                  formData,
                  "Imagen eliminada correctamente.",
                )
              }
              onSubmit={(submitEvent) => {
                if (!window.confirm("Eliminar esta imagen asociada?")) {
                  submitEvent.preventDefault();
                }
              }}
              className="mt-2"
            >
              <input type="hidden" name="id" value={image.id} />
              <input type="hidden" name="owner_type" value={image.owner_type} />
              <input type="hidden" name="owner_id" value={image.owner_id} />
              <button
                type="submit"
                className="w-full rounded-md border border-grana px-2 py-1 text-xs font-bold text-grana transition hover:bg-grana hover:text-white"
              >
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteForm({
  action,
  id,
  label,
  onRun,
}: {
  action: (formData: FormData) => Promise<AdminActionResult>;
  id: string;
  label: string;
  onRun: (
    action: (formData: FormData) => Promise<AdminActionResult>,
    formData: FormData,
    successMessage?: string,
  ) => Promise<void>;
}) {
  return (
    <form
      action={(formData) =>
        onRun(action, formData, "Elemento eliminado correctamente.")
      }
      onSubmit={(submitEvent) => {
        if (!window.confirm(label)) {
          submitEvent.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
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

function FeaturedCheckbox({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold text-azul-noche">
      <input
        type="checkbox"
        name="is_featured"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-grana"
      />
      Evento destacado
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

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center rounded-md bg-azul-noche px-4 py-2 text-sm font-bold text-white transition hover:bg-grana"
    >
      {children}
    </button>
  );
}

function DeleteButton() {
  return (
    <button
      type="submit"
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-grana px-4 py-2 text-sm font-bold text-grana transition hover:bg-grana hover:text-white"
    >
      Eliminar
    </button>
  );
}

function ImagePreview({ alt, src }: { alt: string; src?: string | null }) {
  if (!src) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-md bg-gradient-to-br from-azul-noche/10 to-grana/10 text-xs font-bold uppercase tracking-wider text-slate-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-slate-100">
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

function ActionMessage({ status }: { status: NonNullable<ActionStatus> }) {
  return (
    <div
      className={`mt-6 rounded-lg border p-4 text-sm font-semibold ${
        status.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-grana/25 bg-white text-grana"
      }`}
      role="status"
    >
      {status.message}
    </div>
  );
}
