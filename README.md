# Asociacion de Festejos Valdelamusa

Web oficial de la Asociacion de Festejos Valdelamusa, creada con Next.js, TypeScript, Tailwind CSS, ESLint, App Router, Supabase y Auth.js.

## Requisitos

- Node.js 20 o superior.
- npm.

## Instalacion

Instala las dependencias:

```bash
npm install
```

## Desarrollo

Arranca el servidor local:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=content-images

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

El panel `/admin` solo permite acceso al correo:

```text
asoc.soc.cul.valdelamusa@gmail.com
```

## Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta el contenido de `supabase/schema.sql`.
4. Copia la URL del proyecto, la anon key y la service role key a `.env.local`.

El SQL crea:

- Tabla `events`.
- Tabla `posts`.
- Tabla `gallery_images`.
- Bucket publico `content-images`.
- Politicas RLS de lectura publica para contenido publicado.

## Google OAuth

Configura una aplicacion OAuth en Google Cloud y anade como callback:

```text
http://localhost:3000/api/auth/callback/google
```

En produccion usa:

```text
https://tu-dominio.vercel.app/api/auth/callback/google
```

Despues copia `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` al entorno.

## Scripts disponibles

```bash
npm run dev
npm run lint
npm run build
npm run start
```

- `npm run dev`: ejecuta la aplicacion en modo desarrollo.
- `npm run lint`: revisa el codigo con ESLint.
- `npm run build`: genera la version de produccion.
- `npm run start`: sirve la build de produccion localmente.

## Estructura inicial

- `src/app`: App Router de Next.js.
- `src/components`: componentes reutilizables.
- `src/lib`: clientes, tipos y consultas de contenido.
- `supabase/schema.sql`: esquema inicial de base de datos y storage.
- `public`: recursos estaticos de la web.

Componentes creados:

- `Header`
- `Footer`
- `EventCard`
- `PostCard`
- `GalleryGrid`
- `PageShell`
- `PageHeader`

## Despliegue en Vercel

El proyecto esta preparado para desplegarse en Vercel:

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. Importa el proyecto desde [Vercel](https://vercel.com/new).
3. Usa la configuracion detectada por defecto para Next.js.
4. Anade las variables de entorno de Supabase y Auth.js.
5. Configura el callback OAuth de Google con el dominio de Vercel.
6. Ejecuta el despliegue.
