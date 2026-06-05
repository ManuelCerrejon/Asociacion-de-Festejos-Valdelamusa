import { AdminLoginButton, AdminLogoutButton } from "@/components/AdminAuthButtons";
import { AdminContentManager } from "@/components/AdminContentManager";
import { Header } from "@/components/Header";
import { allowedAdminEmail, getAdminSession } from "@/lib/auth";
import type {
  ContentImageRow,
  EventRow,
  GalleryRow,
  PostRow,
} from "@/lib/content-types";
import { getAdminSupabase, isSupabaseAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getAdminContent() {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return { associatedImages: [], events: [], gallery: [], posts: [] };
  }

  const [eventsResult, postsResult, galleryResult, associatedImagesResult] =
    await Promise.all([
    supabase.from("events").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("posts").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("gallery_images").select("*").order("created_at", {
      ascending: false,
    }),
    supabase.from("content_images").select("*").order("created_at", {
      ascending: false,
    }),
  ]);

  return {
    associatedImages: (associatedImagesResult.data ?? []) as ContentImageRow[],
    events: (eventsResult.data ?? []) as EventRow[],
    posts: (postsResult.data ?? []) as PostRow[],
    gallery: (galleryResult.data ?? []) as GalleryRow[],
  };
}

export default async function AdminPage() {
  const session = await getAdminSession();
  const configured = isSupabaseAdminConfigured();
  const { associatedImages, events, gallery, posts } = session
    ? await getAdminContent()
    : { associatedImages: [], events: [], gallery: [], posts: [] };

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
          <AdminContentManager
            associatedImages={associatedImages}
            events={events}
            gallery={gallery}
            posts={posts}
          />
        )}
      </main>
    </div>
  );
}
