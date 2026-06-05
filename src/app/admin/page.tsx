import Image from "next/image";
import { AdminLoginButton, AdminLogoutButton } from "@/components/AdminAuthButtons";
import { Header } from "@/components/Header";
import { allowedAdminEmail, getAdminSession } from "@/lib/auth";
import type { EventRow, GalleryRow, PostRow } from "@/lib/content-types";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase";
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

export const dynamic = "force-dynamic";

async function getAdminContent() {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return { events: [], gallery: [], posts: [] };
  }

  const [eventsResult, postsResult, galleryResult] = await Promise.all([
    supabase.from("events").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("posts").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("gallery_images").select("*").order("created_at", {
      ascending: false,
    }),
  ]);

  return {
    events: (eventsResult.data ?? []) as EventRow[],
    posts: (postsResult.data ?? []) as PostRow[],
    gallery: (galleryResult.data ?? []) as GalleryRow[],
  };
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

export default async function AdminPage() {
  const session = await getAdminSession();
  const configured = isSupabaseAdminConfigured();
  const { events, gallery, posts } = session
    ? await getAdminContent()
    : { events: [], gallery: [], posts: [] };

  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />
      <main>
        <section className="bg-azul-noche text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/65">
                Administracion
              </p>
              <h1 className="mt-3 text-4xl font-black">Panel de contenido</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Acceso restringido a {allowedAdminEmail}.
              </p>
            </div>
            {session ? <AdminLogoutButton /> : <AdminLoginButton />}
          </div>
        </section>

        {!configured ? (
          <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-grana/20 bg-white p-5 text-sm leading-6 text-slate-700">
              Faltan variables de entorno de Supabase para activar el panel:
              `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y el
              bucket `SUPABASE_STORAGE_BUCKET`.
            </div>
          </section>
        ) : null}

        {!session ? (
          <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-azul-noche">
                Inicia sesion con Google
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Auth.js comprobara el correo de Google y solo permitira entrar
                a la cuenta autorizada de la asociacion.
              </p>
              <div className="mt-6">
                <AdminLoginButton />
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <form
                action={createEvent}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-black text-azul-noche">
                  Crear evento
                </h2>
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
                action={createPost}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-black text-azul-noche">
                  Crear noticia
                </h2>
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
                action={createGalleryImage}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-black text-azul-noche">
                  Subir imagen
                </h2>
                <div className="mt-5 grid gap-4">
                  <TextInput label="Titulo" name="title" />
                  <TextArea label="Descripcion" name="description" />
                  <ImageInput />
                  <PublishedCheckbox />
                  <SubmitButton>Subir a galeria</SubmitButton>
                </div>
              </form>
            </div>

            <AdminSection title="Eventos publicados" count={events.length}>
              <div className="grid gap-5 lg:grid-cols-2">
                {events.map((event) => (
                  <article key={event.id} className="rounded-lg bg-white p-5 shadow-sm">
                    <ImagePreview alt={event.title} src={event.image_url} />
                    <form action={updateEvent} className="mt-5 grid gap-4">
                      <input type="hidden" name="id" value={event.id} />
                      <TextInput label="Titulo" name="title" defaultValue={event.title} />
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
                      <TextArea
                        label="Descripcion"
                        name="description"
                        defaultValue={event.description}
                      />
                      <ImageInput />
                      <PublishedCheckbox defaultChecked={event.is_published} />
                      <SubmitButton>Actualizar evento</SubmitButton>
                    </form>
                    <form action={deleteEvent} className="mt-3">
                      <input type="hidden" name="id" value={event.id} />
                      <DeleteButton />
                    </form>
                  </article>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Noticias publicadas" count={posts.length}>
              <div className="grid gap-5 lg:grid-cols-2">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-lg bg-white p-5 shadow-sm">
                    <ImagePreview alt={post.title} src={post.image_url} />
                    <form action={updatePost} className="mt-5 grid gap-4">
                      <input type="hidden" name="id" value={post.id} />
                      <TextInput label="Titulo" name="title" defaultValue={post.title} />
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
                    <form action={deletePost} className="mt-3">
                      <input type="hidden" name="id" value={post.id} />
                      <DeleteButton />
                    </form>
                  </article>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Imagenes de galeria" count={gallery.length}>
              <div className="grid gap-5 lg:grid-cols-3">
                {gallery.map((image) => (
                  <article key={image.id} className="rounded-lg bg-white p-5 shadow-sm">
                    <ImagePreview alt={image.title} src={image.image_url} />
                    <form action={updateGalleryImage} className="mt-5 grid gap-4">
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
                    <form action={deleteGalleryImage} className="mt-3">
                      <input type="hidden" name="id" value={image.id} />
                      <DeleteButton />
                    </form>
                  </article>
                ))}
              </div>
            </AdminSection>
          </section>
        )}
      </main>
    </div>
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
