## ADDED Requirements

### Requirement: Bottom navigation bar en móvil
El sistema DEBE mostrar una barra de navegación inferior en dispositivos móviles con al menos cuatro pestañas: Home, History, Add y Reminders.

#### Scenario: Navegación entre pestañas
- **WHEN** el usuario hace clic en una pestaña de la bottom bar
- **THEN** el sistema navega a la ruta correspondiente y resalta la pestaña activa

#### Scenario: Bottom bar accesible con una mano
- **WHEN** el usuario sostiene el teléfono con una mano
- **THEN** la bottom bar está posicionada dentro del alcance del pulgar y los botones son táctiles (mínimo 44x44px)

### Requirement: Layout mobile-first responsive
El sistema DEBE usar un layout optimizado para móvil (iPhone 12 de referencia) con tipografía legible, cards con bordes sutiles en light mode y grises profundos en dark mode.

#### Scenario: Visualización en iPhone 12
- **WHEN** la app se renderiza en una pantalla de 390x844px
- **THEN** el layout no tiene overflow horizontal, el texto es legible y los cards tienen padding adecuado

### Requirement: Página Add como modal o ruta dedicada
El sistema DEBE permitir agregar transacciones desde la pestaña Add, ya sea como una ruta dedicada `/add` o como un modal centrado en pantalla.

#### Scenario: Acceso rápido a agregar transacción
- **WHEN** el usuario hace clic en el botón central "Add" de la bottom bar
- **THEN** el sistema presenta el formulario de transacción de forma inmediata
