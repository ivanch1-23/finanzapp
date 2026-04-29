## Why

Se necesita una aplicación mínima y rápida para gestionar las finanzas personales y del negocio de ropa (tienda). Actualmente no existe una solución centralizada que permita registrar gastos/ingresos semanalmente, ver recordatorios de pagos próximos y usar la app como PWA en móvil. La app debe ser mobile-first, con soporte claro de temas claro/oscuro y despliegue sencillo en Vercel + Supabase.

## What Changes

- Crear una PWA con Next.js 14+ (App Router), Tailwind CSS y Supabase.
- Implementar gestión de transacciones (ingresos/gastos) con campos: monto, título (con emoji), categoría, fecha, tipo y recurrencia.
- Agrupar transacciones automáticamente por semana del mes con subtotales semanales.
- Crear sección de recordatorios de pagos con alertas visuales para vencimientos en 48h.
- Soportar temas System/Light/Dark con React Context/Zustand.
- Navegación mobile-first con bottom bar (Home, History, Add, Reminders).
- Generar manifest.json y service workers para capacidad PWA (Add to Home Screen).
- Crear esquema de base de datos en Supabase (PostgreSQL) para perfiles, transacciones y recordatorios.

## Capabilities

### New Capabilities
- `transaction-management`: Crear, listar y agrupar transacciones por semana del mes con subtotales.
- `payment-reminders`: Gestión de recordatorios de pagos con alertas de proximidad (48h).
- `theme-pwa`: Soporte de temas claro/oscuro/sistema y configuración PWA (manifest + service worker).
- `mobile-navigation`: Navegación bottom bar optimizada para móvil y layout general de la app.

### Modified Capabilities
- *(Ninguna: proyecto nuevo desde cero)*

## Impact

- Nuevo proyecto Next.js completo con App Router.
- Nueva base de datos Supabase con tablas `profiles`, `transactions`, `reminders`.
- Dependencias nuevas: `lucide-react`, posiblemente `zustand`.
- Despliegue en Vercel requiere variables de entorno de Supabase.
