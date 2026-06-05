# Asociacion de Festejos Valdelamusa

Web oficial de la Asociacion de Festejos Valdelamusa, inicializada con Next.js, TypeScript, Tailwind CSS, ESLint, App Router y carpeta `src`.

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
- `public`: recursos estaticos de la web.

Componentes creados:

- `Header`
- `Footer`
- `EventCard`
- `PostCard`

## Despliegue en Vercel

El proyecto esta preparado para desplegarse en Vercel sin configuracion extra:

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. Importa el proyecto desde [Vercel](https://vercel.com/new).
3. Usa la configuracion detectada por defecto para Next.js.
4. Ejecuta el despliegue.

No se ha configurado todavia Supabase, Auth.js ni Vercel Blob.
