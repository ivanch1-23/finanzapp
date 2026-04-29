## Context

Se construye una PWA desde cero para gestión de finanzas personales/negocio de ropa. El usuario principal usa un iPhone 12 y necesita navegación con una mano, registro rápido de transacciones y visibilidad semanal del gasto. No hay sistema previo; todo es nuevo.

## Goals / Non-Goals

**Goals:**
- App móvil-first con bottom navigation usable con el pulgar.
- Registro de transacciones con emoji, categoría y agrupación semanal automática.
- Recordatorios de pagos con alerta visual si vencen en menos de 48 horas.
- Temas Light/Dark/System con persistencia en localStorage.
- PWA funcional: manifest, íconos, service worker básico para offline shell.
- Backend con Supabase: auth, PostgreSQL, Row Level Security.

**Non-Goals:**
- Sincronización offline completa de datos (solo shell caching).
- Reportes avanzados o exportación a CSV/Excel.
- Multi-tenancy complejo o roles de usuario.
- Integraciones bancarias o APIs externas.

## Decisions

- **Next.js 14+ App Router**: Simplifica SSR/SSG, layouts anidados y API routes si se necesitan. Es nativo para Vercel.
- **Tailwind CSS**: Velocidad de desarrollo, utilidades para dark mode con `dark:` y soporte de tema vía clase en `<html>`.
- **Supabase (PostgreSQL + Auth)**: Base de datos relacional gratuita, auth integrada, SDK de JS fácil de usar.
- **Zustand para tema + transacciones locales**: Menos boilerplate que Context para estado global pequeño. Para transacciones se usará Zustand como caché local mientras se sincroniza con Supabase.
- **Agrupación semanal en cliente**: Evita lógica compleja en PostgreSQL. Se usa una utilidad `getWeekOfMonth(date)` basada en calendario.
- **Service Worker vía next-pwa o Workbox básico**: Se opta por un SW mínimo generado manualmente o con `next-pwa` si la dependencia es ligera. Dado el alcance, se usará un SW simple para cache del shell.

## Risks / Trade-offs

- [Risk] Supabase free tier tiene límites de conexiones y rate limits → Mitigation: implementar retry sencillo y cache local con Zustand.
- [Risk] El service worker manual puede quedar obsoleto con updates de Next.js → Mitigation: mantener el SW mínimo y documentar que se debe invalidar cache en nuevos deploys.
- [Risk] El bottom bar en iPhone puede taparse con la home bar → Mitigation: usar `pb-safe` o padding inferior generoso con `env(safe-area-inset-bottom)`.
