## ADDED Requirements

### Requirement: Soporte de temas Light, Dark y System
El sistema DEBE soportar tres modos de tema: Light, Dark y System. El tema System debe sincronizarse con la preferencia del sistema operativo del usuario.

#### Scenario: Cambio a tema oscuro
- **WHEN** el usuario selecciona "Dark" en el selector de tema
- **THEN** la aplicación aplica la clase `dark` al elemento `<html>` y todos los componentes adaptan sus estilos

#### Scenario: Tema system detecta preferencia OS
- **WHEN** el usuario selecciona "System" y su OS está en modo oscuro
- **THEN** la aplicación aplica el tema oscuro automáticamente

### Requirement: Persistencia del tema seleccionado
El sistema DEBE persistir la preferencia de tema del usuario en `localStorage` y restaurarla al recargar la aplicación.

#### Scenario: Recarga de página
- **WHEN** el usuario recarga la aplicación
- **THEN** el sistema lee `localStorage` y aplica el último tema seleccionado antes de renderizar la UI

### Requirement: Manifest y configuración PWA
El sistema DEBE incluir un `manifest.json` válido con nombre, íconos, colores y `display: standalone`, y un service worker que permita la instalación en la pantalla de inicio.

#### Scenario: Instalación en iOS/Android
- **WHEN** el usuario visita la app desde Safari/Chrome
- **THEN** el navegador ofrece la opción "Add to Home Screen" gracias al manifest y SW registrado

### Requirement: Service worker mínimo para offline shell
El sistema DEBE registrar un service worker que cachee el shell de la aplicación para que la página cargue offline (aunque los datos dinámicos requieran conexión).

#### Scenario: Carga offline del shell
- **WHEN** el usuario abre la app sin conexión después de haberla usado antes
- **THEN** el shell de la app se muestra desde cache
