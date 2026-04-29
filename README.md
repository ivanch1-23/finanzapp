# FinanzApp

PWA minimalista para gestionar finanzas personales y de negocio (tienda de ropa).

## Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Lucide React
- **Estado:** Zustand
- **Backend/DB:** Supabase (PostgreSQL + Auth)
- **Deploy:** Vercel

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Reemplaza los valores con los de tu proyecto de Supabase.

## Base de datos

Ejecuta el contenido de `supabase/schema.sql` en el SQL Editor de Supabase para crear las tablas:

- `profiles`
- `transactions`
- `reminders`

Con Row Level Security (RLS) habilitado.

## Instalación local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build para producción

```bash
npm run build
```

Genera archivos estáticos en la carpeta `dist/` lista para desplegar en Vercel.

## Características principales

- Registro de transacciones con emoji, categoría y agrupación semanal.
- Recordatorios de pagos con alertas visuales (< 48h).
- Temas Light / Dark / System.
- Navegación mobile-first con bottom bar.
- PWA: manifest.json y service worker para "Add to Home Screen".

## Notas

- Los datos se sincronizan con Supabase. Si no hay conexión, el estado se mantiene en localStorage vía Zustand (modo local hasta que se conecte Supabase).
- Para producción con Supabase Auth, considera implementar middleware de sesión en Next.js.
