## ADDED Requirements

### Requirement: Usuario puede crear recordatorios de pago
El sistema DEBE permitir al usuario crear un recordatorio con título, fecha de vencimiento y monto opcional.

#### Scenario: Creación de recordatorio
- **WHEN** el usuario ingresa título "💡 Luz", fecha de vencimiento mañana, monto 45.00 y guarda
- **THEN** el sistema almacena el recordatorio y lo muestra en la lista de recordatorios

### Requirement: Alertas visuales para pagos próximos
El sistema DEBE mostrar una alerta visual (color/icono distintivo) para los recordatorios cuya fecha de vencimiento sea dentro de las próximas 48 horas y que no estén pagados.

#### Scenario: Recordatorio dentro de 48 horas
- **WHEN** existe un recordatorio no pagado con due_date dentro de 48h desde ahora
- **THEN** el sistema muestra el recordatorio con indicador visual de urgencia (color rojo o ícono de alerta)

#### Scenario: Recordatorio vencido
- **WHEN** existe un recordatorio no pagado con due_date anterior a hoy
- **THEN** el sistema muestra el recordatorio con indicador visual de vencido

### Requirement: Usuario puede marcar recordatorio como pagado
El sistema DEBE permitir marcar un recordatorio como pagado, ocultando la alerta visual.

#### Scenario: Marcar como pagado
- **WHEN** el usuario hace clic en "Marcar como pagado"
- **THEN** el sistema actualiza `is_paid` a true y remueve las alertas visuales de urgencia
