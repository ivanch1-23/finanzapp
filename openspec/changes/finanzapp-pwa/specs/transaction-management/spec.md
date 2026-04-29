## ADDED Requirements

### Requirement: Usuario puede crear una transacción
El sistema DEBE permitir al usuario crear una transacción con monto, título (incluyendo emoji), categoría, fecha, tipo (ingreso o gasto) y opción de recurrencia.

#### Scenario: Creación exitosa de gasto
- **WHEN** el usuario completa el formulario con monto 150.00, título "🍎 Groceries", categoría "Comida", tipo "expense" y hace clic en guardar
- **THEN** el sistema guarda la transacción en Supabase y la muestra en el historial

#### Scenario: Creación exitosa de ingreso
- **WHEN** el usuario completa el formulario con monto 500.00, título "💰 Venta", categoría "Tienda", tipo "income" y hace clic en guardar
- **THEN** el sistema guarda la transacción en Supabase y actualiza el balance visible

### Requirement: Sistema agrupa transacciones por semana del mes
El sistema DEBE agrupar automáticamente las transacciones del mes actual en semanas (Week 1, Week 2, Week 3, Week 4, Week 5) y mostrar un subtotal por semana.

#### Scenario: Visualización del dashboard mensual
- **WHEN** el usuario abre la pantalla Home
- **THEN** el sistema muestra las transacciones agrupadas por semana con el subtotal de ingresos y gastos de cada semana

#### Scenario: Cálculo de semana del mes
- **WHEN** se evalúa una transacción con fecha 15 del mes
- **THEN** la utilidad `getWeekOfMonth` retorna la semana correspondiente (1-5) basada en calendario

### Requirement: Categorías predefinidas y editables
El sistema DEBE ofrecer las categorías predefinidas: Tienda, Personal, Tecnología, Comida, Ahorros (Cajitas), y permitir que el usuario seleccione una al crear la transacción.

#### Scenario: Selección de categoría
- **WHEN** el usuario abre el selector de categoría en el formulario de transacción
- **THEN** el sistema muestra las 5 categorías predefinidas y permite seleccionar una
