## 1. Setup Proyecto y Dependencias

- [x] 1.1 Inicializar proyecto Next.js 14+ con App Router, TypeScript y Tailwind CSS
- [x] 1.2 Instalar dependencias: `lucide-react`, `zustand`, `@supabase/supabase-js`
- [x] 1.3 Configurar variables de entorno para Supabase (`.env.local` template)
- [x] 1.4 Configurar `tailwind.config.ts` con soporte para modo oscuro (`darkMode: 'class'`)

## 2. Base de Datos y Auth (Supabase)

- [x] 2.1 Crear esquema SQL en Supabase: tablas `profiles`, `transactions`, `reminders` con RLS básico
- [x] 2.2 Crear cliente Supabase (`lib/supabase/client.ts` y `lib/supabase/server.ts`)
- [x] 2.3 Implementar helper de auth para obtener usuario actual en cliente/servidor

## 3. Tema y PWA

- [x] 3.1 Crear store Zustand para tema (`stores/theme.ts`) con persistencia en localStorage
- [x] 3.2 Implementar `ThemeProvider` que sincronice clase `dark` en `<html>` y preferencia del sistema
- [x] 3.3 Crear componente `ThemeToggle` en UI
- [x] 3.4 Crear `manifest.json` con nombre, íconos, colores y `display: standalone`
- [x] 3.5 Registrar service worker básico en `layout.tsx` para cache del shell

## 4. Layout y Navegación Móvil

- [x] 4.1 Crear layout raíz con `layout.tsx` y estructura mobile-first
- [x] 4.2 Implementar `BottomNav` con rutas: Home, History, Add, Reminders (íconos Lucide)
- [x] 4.3 Crear páginas base: `/page.tsx` (Home), `/history/page.tsx`, `/add/page.tsx`, `/reminders/page.tsx`
- [x] 4.4 Aplicar estilos de bottom bar con safe-area padding y tamaños táctiles (min 44px)

## 5. Gestión de Transacciones

- [x] 5.1 Crear tipo TypeScript `Transaction` y helper `getWeekOfMonth(date)`
- [x] 5.2 Implementar formulario `TransactionForm` (monto, título con emoji, categoría, fecha, tipo, recurrencia)
- [x] 5.3 Crear store Zustand `useTransactionStore` con CRUD local y sync a Supabase
- [x] 5.4 Implementar listado `TransactionList` con agrupación por semana del mes y subtotales
- [x] 5.5 Mostrar cards de transacciones con bordes sutiles (light) / grises profundos (dark)
- [x] 5.6 Implementar selector de emoji simple en el formulario (input nativo o picker mínimo)

## 6. Recordatorios de Pagos

- [x] 6.1 Crear tipo TypeScript `Reminder` y formulario `ReminderForm` (título, due_date, monto)
- [x] 6.2 Implementar store/reminders con CRUD y sync a Supabase
- [x] 6.3 Crear lista `ReminderList` con indicadores visuales: normal, urgente (<48h), vencido
- [x] 6.4 Implementar acción "Marcar como pagado" que actualice `is_paid`
- [x] 6.5 Mostrar recordatorios próximos en Home o en pantalla dedicada según diseño

## 7. Dashboard Home y Utilidades

- [x] 7.1 Implementar dashboard Home con resumen mensual: total ingresos, total gastos, balance
- [x] 7.2 Mostrar semanas del mes actual con subtotales de ingresos/gastos
- [x] 7.3 Crear componentes reutilizables: `Card`, `Button`, `Input`, `SelectCategory`

## 8. Documentación y Deploy

- [x] 8.1 Crear `README.md` con instrucciones de instalación y variables de entorno Supabase
- [x] 8.2 Verificar responsive en viewports de iPhone 12 (390x844)
- [x] 8.3 Revisar que todos los checkboxes de specs estén cubiertos por implementación

## 9. Mejora Visual UI/UX (Extra)

- [x] 9.1 Rediseñar paleta de colores con CSS variables profesionales y gradientes
- [x] 9.2 Mejorar dashboard Home con cards con sombras, gradiente de balance y tipografía jerárquica
- [x] 9.3 Rediseñar TransactionList con cards redondeados, iconos de categoría y skeleton loaders
- [x] 9.4 Rediseñar TransactionForm con toggle de tipo, botones de categoría, iconos en inputs
- [x] 9.5 Rediseñar BottomNav con indicadores animados, fondo blur y estilo nativo
- [x] 9.6 Rediseñar ReminderList con indicadores de estado por color y avatar circular
- [x] 9.7 Rediseñar ThemeToggle con estilo segmentado moderno
- [x] 9.8 Agregar fuente Inter y meta tags PWA optimizados para iOS
- [x] 9.9 Agregar estados vacíos ilustrados y micro-interacciones hover/active

## 10. Animaciones y Experiencia Premium

- [x] 10.1 Instalar framer-motion para animaciones fluidas
- [x] 10.2 Crear sistema de transiciones de página (PageTransition)
- [x] 10.3 Implementar animaciones staggered para listas (StaggerContainer/StaggerItem)
- [x] 10.4 Agregar animaciones de entrada/salida con FadeIn, ScaleIn, SlideIn
- [x] 10.5 Animar BottomNav con indicador deslizante y efectos de presión
- [x] 10.6 Animar ThemeToggle con indicador de tema animado (layoutId)
- [x] 10.7 Implementar skeleton loaders con shimmer animation
- [x] 10.8 Animar balance card con gradiente, sombras y elementos flotantes
- [x] 10.9 Animar transacción al eliminar (exit animation)
- [x] 10.10 Animar estados de éxito/guardado en formularios
- [x] 10.11 Implementar micro-interacciones: hover scale, tap scale, rotate en iconos
- [x] 10.12 Agregar paleta de colores financiera: verde esmeralda (ingresos), rojo coral (gastos), gradientes
