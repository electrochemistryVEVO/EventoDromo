# Análisis Completo del Flujo de DromoPuntos

## 📊 Estructura de Base de Datos

### Tablas Principales

#### 1. **Tabla `Punto`**
```sql
CREATE TABLE IF NOT EXISTS `Punto` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `cantidad` int NOT NULL,              -- Cantidad ORIGINAL del lote
    `cantidadRestante` int NOT NULL,      -- Cantidad DISPONIBLE (se consume con FIFO)
    `fechaHoraRegistro` datetime NOT NULL,
    `idCliente` int NOT NULL,
    `fechaExpiracion` datetime NOT NULL,  -- Vencen a 1 año de la compra
    PRIMARY KEY (`id`),
    FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`)
);
```
**Propósito**: Almacena LOTES de puntos que gana el cliente. Cada compra con tarjeta genera UN registro nuevo.

**Campos críticos**:
- `cantidad`: El total de puntos que se ganó en esa transacción (NUNCA cambia)
- `cantidadRestante`: Los puntos que AÚN NO SE HAN GASTADO (se actualiza con UPDATE en pagos con puntos)
- `fechaExpiracion`: Se calcula como `fechaHoraRegistro + 1 YEAR`

---

#### 2. **Tabla `Transaccion`**
```sql
CREATE TABLE IF NOT EXISTS `Transaccion` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `idCarrito` int NOT NULL,
    `idCliente` int NOT NULL,             -- Campo AGREGADO (no en migración original)
    `fechaHoraCompra` datetime NOT NULL,
    `numeroTransaccion` varchar(255) NOT NULL,
    `nombresCliente` varchar(255) NOT NULL,
    `apellidosCliente` varchar(255) NOT NULL,
    `emailCliente` varchar(255) NOT NULL,
    `numeroDocumentoCliente` varchar(255) NOT NULL,
    `idTipoDocumento` int NOT NULL,
    `montoTotal` decimal(10,2) NOT NULL,  -- 0.00 si se pagó con puntos
    PRIMARY KEY (`id`)
);
```
**Propósito**: Registra TODAS las transacciones (con tarjeta, con puntos, transferencias).

**Prefijos de `numeroTransaccion`**:
- `TXN-`: Pago con tarjeta
- `TRP-`: Pago con puntos
- `TRF-`: Transferencia de entradas

---

#### 3. **Tabla `LineaTransaccion`**
```sql
CREATE TABLE IF NOT EXISTS `LineaTransaccion` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `idTransaccion` int NOT NULL,
    `idEntrada` int NOT NULL,
    `precio` decimal(10,2) NOT NULL,
    `puntosGanados` int NOT NULL,        -- Puntos que GENERA esta línea (0 si se pagó con puntos)
    PRIMARY KEY (`id`),
    FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`),
    FOREIGN KEY (`idEntrada`) REFERENCES `Entrada`(`id`)
);
```
**Propósito**: Detalle de cada entrada comprada dentro de una transacción.

**Campo crítico**:
- `puntosGanados`: > 0 si se pagó con tarjeta, = 0 si se pagó con puntos

---

#### 4. **Tabla `TransaccionTarjeta`**
```sql
CREATE TABLE IF NOT EXISTS `TransaccionTarjeta` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `idTransaccion` int NOT NULL,
    `idTarjeta` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`),
    FOREIGN KEY (`idTarjeta`) REFERENCES `Tarjeta`(`id`)
);
```
**Propósito**: Vincula una transacción con el pago por tarjeta.

---

#### 5. **Tabla `TransaccionPuntos`**
```sql
CREATE TABLE IF NOT EXISTS `TransaccionPuntos` (
    `id` int AUTO_INCREMENT NOT NULL UNIQUE,
    `idTransaccion` int NOT NULL,
    `idCliente` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`),
    FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`)
);
```
**Propósito**: Vincula una transacción con el pago por puntos.

---

#### 6. **Tabla `configuracion`**
```sql
CREATE TABLE IF NOT EXISTS `configuracion` (
    `id` int PRIMARY KEY,
    `puntos_por_sol` decimal(10,2) NOT NULL,      -- Cuántos SOLES vale 1 punto (ej: 10.00 = 1pt vale S/ 10)
    `meses_vigencia_puntos` int NOT NULL,         -- Vigencia de puntos en meses (ej: 6 = 6 meses)
    `minutos_vigencia_carrito` int NOT NULL       -- Vigencia del carrito en minutos (ej: 30 = 30 min)
);
```
**Propósito**: Configuraciones globales del sistema.

**Valores por defecto**:
- `puntos_por_sol = 10.00`: 1 punto vale S/ 10.00
- `meses_vigencia_puntos = 6`: Los puntos expiran a los 6 meses
- `minutos_vigencia_carrito = 30`: El carrito expira a los 30 minutos

**⚠️ IMPORTANTE**: 
- `puntos_por_sol` define cuántos SOLES vale 1 punto, NO cuántos puntos vale 1 sol
- Si `puntos_por_sol = 10`, entonces 1 punto = S/ 10.00
- Si un cliente quiere comprar entradas por S/ 30, necesita 3 puntos (30 / 10 = 3)

---

## 🔄 Flujo Completo de DromoPuntos

### 📥 **1. INGRESO DE PUNTOS (Compra con Tarjeta)**

**Trigger**: Cliente compra entradas pagando con tarjeta.

**Backend**: `TransaccionMapper.CrearTransaccionTarjeta()`

```csharp
// Paso 7: Registrar Puntos Ganados
if (puntosTotalesGanados > 0)
{
    string queryPuntos = @"
        INSERT INTO Punto (cantidad, cantidadRestante, fechaHoraRegistro, idCliente, fechaExpiracion) 
        VALUES (@cant, @cantRestante, UTC_TIMESTAMP(), @idCli, UTC_TIMESTAMP() + INTERVAL 1 YEAR)";
    
    // cantidad = cantidadRestante = puntos totales ganados
    // fechaExpiracion = ahora + 1 año
}
```

**Ejemplo**:
- Cliente compra entradas por S/ 100.00
- Conversión: 1 punto = S/ 10.00
- Se generan 10 puntos (100 / 10 = 10)
- Vigencia configurable: `UTC_TIMESTAMP() + INTERVAL {meses_vigencia_puntos} MONTH`
- Se inserta: `Punto(cantidad=10, cantidadRestante=10, fechaExpiracion=+6 meses)`

**Nota**: `puntosGanados` puede ser 0 si el administrador configuró el evento sin otorgar puntos.

**Registro en `LineaTransaccion`**:
```sql
INSERT INTO LineaTransaccion (idTransaccion, idEntrada, precio, puntosGanados) 
VALUES (123, 456, 50.00, 5); -- 5 puntos por entrada de S/ 50 (50 / 10 = 5)
```

---

### 📤 **2. SALIDA DE PUNTOS (Compra con Puntos)**

**Trigger**: Cliente canjea puntos para comprar entradas.

**Backend**: `TransaccionMapper.CrearTransaccionPuntos()`

```csharp
// Paso 4: Consumir Puntos (Lógica FIFO)
ConsumirPuntos(idCliente, puntosRequeridosServidor);
```

**Método `ConsumirPuntos()`** (FIFO - First In, First Out):
```csharp
// 1. Obtener lotes ordenados por fecha de expiración (los más antiguos primero)
SELECT id, cantidadRestante FROM Punto 
WHERE idCliente = @idCli AND cantidadRestante > 0 AND fechaExpiracion > UTC_TIMESTAMP() 
ORDER BY fechaExpiracion ASC FOR UPDATE;

// 2. Consumir puntos lote por lote
foreach (var lote in lotesDisponibles)
{
    if (puntosRestantes <= lote.CantidadRestante)
    {
        // Este lote tiene suficientes puntos
        UPDATE Punto SET cantidadRestante = cantidadRestante - @puntos WHERE id = @idLote;
        break;
    }
    else
    {
        // Consumir todo el lote y seguir con el siguiente
        UPDATE Punto SET cantidadRestante = 0 WHERE id = @idLote;
        puntosRestantes -= lote.CantidadRestante;
    }
}
```

**Registro en `Transaccion`**:
```sql
INSERT INTO Transaccion (..., montoTotal, idCliente) 
VALUES (..., 0.00, @idCliente); -- MontoTotal = 0.00 porque se pagó con puntos
```

**Registro en `LineaTransaccion`**:
```sql
INSERT INTO LineaTransaccion (idTransaccion, idEntrada, precio, puntosGanados) 
VALUES (124, 457, 30.00, 0); -- puntosGanados = 0 porque se pagó con puntos
```

**Registro en `TransaccionPuntos`**:
```sql
INSERT INTO TransaccionPuntos (idTransaccion, idCliente) VALUES (124, 5);
```

---

### ⏰ **3. EXPIRACIÓN DE PUNTOS**

**Condición**: `fechaExpiracion <= NOW()`

**Query de detección**:
```sql
SELECT id, cantidad FROM Punto 
WHERE idCliente = @idCliente 
  AND cantidad > 0 
  AND fechaExpiracion <= NOW();
```

**Estado en la tabla**:
- `cantidad`: Mantiene el valor original
- `cantidadRestante`: Ya debería ser 0 (si se consumieron) o > 0 (si expiraron sin usarse)

---

## 📊 **Consulta de Resumen (Frontend)**

### Query Principal en `DromopuntosMapper.ObtenerResumenCompletoSQL()`

```sql
-- PARTE 1: Puntos por Vencer (Lotes activos)
SELECT 
    'porVencer' AS tipoResultado,
    P.id, 
    P.cantidadRestante AS cantidad,  -- ⚠️ IMPORTANTE: Usa cantidadRestante, NO cantidad
    P.fechaExpiracion,
    NULL AS tipoMovimiento,
    NULL AS nombreEventoAsociado,
    NULL AS fechaMovimiento
FROM Punto P
WHERE P.idCliente = @idCliente 
  AND P.cantidadRestante > 0         -- Solo lotes con puntos disponibles
  AND P.fechaExpiracion > NOW()      -- Solo lotes no vencidos

UNION ALL

-- PARTE 2: Ingresos (Compras con tarjeta)
SELECT 
    'movimiento' AS tipoResultado,
    LT.id,
    LT.puntosGanados AS cantidad,    -- Puntos que GENERÓ esta compra
    NULL AS fechaExpiracion,
    'ingreso' AS tipoMovimiento,
    E.nombre AS nombreEventoAsociado,
    T.fechaHoraCompra AS fechaMovimiento
FROM Transaccion T
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
JOIN Entrada EN ON LT.idEntrada = EN.id
JOIN TipoEntrada TE ON EN.idTipoEntrada = TE.id
JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
JOIN Evento E ON FE.idEvento = E.id
WHERE T.idCliente = @idCliente 
  AND LT.puntosGanados > 0           -- Solo líneas que generaron puntos

UNION ALL

-- PARTE 3: Salidas (Canjes con puntos)
SELECT 
    'movimiento' AS tipoResultado,
    TP.id,
    -T.montoTotal AS cantidad,       -- ⚠️ PROBLEMA POTENCIAL: Ver análisis abajo
    NULL AS fechaExpiracion,
    'salida' AS tipoMovimiento,
    E.nombre AS nombreEventoAsociado,
    T.fechaHoraCompra AS fechaMovimiento
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion 
JOIN Entrada EN ON LT.idEntrada = EN.id
JOIN TipoEntrada TE ON EN.idTipoEntrada = TE.id
JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
JOIN Evento E ON FE.idEvento = E.id
WHERE T.idCliente = @idCliente
GROUP BY T.id 

UNION ALL

-- PARTE 4: Expiraciones
SELECT 
    'movimiento' AS tipoResultado,
    P.id,
    -P.cantidad AS cantidad,         -- Puntos que expiraron
    NULL AS fechaExpiracion,
    'expiracion' AS tipoMovimiento,
    'Puntos expirados' AS nombreEventoAsociado,
    P.fechaExpiracion AS fechaMovimiento
FROM Punto P
WHERE P.idCliente = @idCliente 
  AND P.cantidad > 0 
  AND P.fechaExpiracion <= NOW();
```

---

## ⚠️ **PROBLEMAS IDENTIFICADOS**

### 🔴 **Problema 1: Cálculo de "Salidas" en el historial**

**Línea problemática**:
```sql
-T.montoTotal AS cantidad  -- En TransaccionPuntos, montoTotal = 0.00 ❌
```

**Contexto**:
- Cuando pagas con puntos, `Transaccion.montoTotal = 0.00`
- Esto significa que el historial mostrará **0 puntos gastados** en lugar del número real

**Solución**:
Necesitas almacenar el **número de puntos gastados** en algún lugar. Opciones:

#### **Opción A: Agregar campo a `TransaccionPuntos`**
```sql
ALTER TABLE TransaccionPuntos ADD COLUMN puntosGastados int NOT NULL DEFAULT 0;
```

Luego en `CrearTransaccionPuntos()`:
```csharp
string queryLinkPuntos = @"
    INSERT INTO TransaccionPuntos (idTransaccion, idCliente, puntosGastados) 
    VALUES (@idTrans, @idCli, @puntosGastados)";
pLinkPuntos.Add("@puntosGastados", puntosRequeridosServidor);
```

Query actualizada:
```sql
SELECT 
    'movimiento' AS tipoResultado,
    TP.id,
    -TP.puntosGastados AS cantidad,  -- ✅ Ahora sí muestra los puntos reales
    ...
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
...
```

#### **Opción B: Calcular desde `LineaTransaccion.precio`**
```sql
SELECT 
    'movimiento' AS tipoResultado,
    TP.id,
    -CEILING(SUM(LT.precio) / (SELECT puntos_por_sol FROM configuracion WHERE id = 1)) AS cantidad,
    ...
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
...
GROUP BY TP.id
```

**Recomendación**: Opción A es más limpia y eficiente.

---

### 🟡 **Problema 2: Inconsistencia en `Punto.cantidad` vs `Punto.cantidadRestante`**

**Contexto actual**:
- `cantidad`: Valor original (nunca cambia)
- `cantidadRestante`: Valor disponible (se actualiza con UPDATE)

**Query de "Puntos por Vencer"**:
```sql
P.cantidadRestante AS cantidad  -- ✅ CORRECTO
```

**Query de "Expiraciones"**:
```sql
-P.cantidad AS cantidad  -- ⚠️ Podría ser incorrecto
```

**Escenario problemático**:
1. Cliente gana 1000 puntos (cantidad=1000, cantidadRestante=1000)
2. Cliente gasta 600 puntos (cantidad=1000, cantidadRestante=400)
3. Los 400 restantes expiran
4. El historial mostrará "-1000 pt. Expiraron por inactividad" ❌ (debería ser -400)

**Solución**:
```sql
-- Opción 1: Usar cantidadRestante
-P.cantidadRestante AS cantidad

-- Opción 2: Calcular lo que realmente expiró
-(P.cantidad - (SELECT IFNULL(SUM(...), 0) FROM ... WHERE se gastaron puntos de este lote))
```

**Recomendación**: Usa `cantidadRestante` ya que representa los puntos que NO se usaron y expiraron.

---

### 🟡 **Problema 3: Filtro de "Próximos 60 días"**

**Código actual en `DromopuntosBO.ObtenerResumenCompleto()`**:
```csharp
var proximos60Dias = ahora.AddDays(60);
resumen.PorVencer = resumen.PorVencer
    .Where(p => p.FechaExpiracion <= proximos60Dias)  // ✅ Filtro correcto
    .OrderBy(p => p.FechaExpiracion)
    .ToList();
```

**Frontend**: Muestra 4 lotes que vencen en "Agosto 2025" (todos tienen la misma fecha).

**Preguntas**:
1. ¿Todos los lotes tienen `fechaExpiracion` idéntica? (Poco probable si compraste en fechas diferentes)
2. ¿El filtro de 60 días está funcionando correctamente?

**Validación recomendada**:
```sql
-- Ejecuta esto para verificar los lotes del cliente
SELECT 
    id,
    cantidad,
    cantidadRestante,
    fechaHoraRegistro,
    fechaExpiracion,
    DATEDIFF(fechaExpiracion, NOW()) AS diasRestantes
FROM Punto
WHERE idCliente = <TU_ID_CLIENTE>
  AND cantidadRestante > 0
  AND fechaExpiracion > NOW()
ORDER BY fechaExpiracion;
```

---

### 🟢 **Problema 4: Cálculo de "Total de Puntos Disponibles"**

**Código actual**:
```csharp
resumen.Total = resumen.PorVencer.Sum(p => p.Cantidad);
```

**Validación**: ✅ CORRECTO, porque `p.Cantidad` viene de `P.cantidadRestante` en la query.

---

## 📋 **Recomendaciones Finales**

### 1. **Migración de Base de Datos**

Crea un archivo `Backend/EventodromoRest/Migraciones/017_agregar_puntos_gastados.sql`:

```sql
-- Agregar campo para almacenar puntos gastados en cada transacción con puntos
ALTER TABLE TransaccionPuntos 
ADD COLUMN puntosGastados int NOT NULL DEFAULT 0;

-- Opcional: Backfill de datos existentes (calcula puntos gastados en base a precios)
UPDATE TransaccionPuntos TP
JOIN Transaccion T ON TP.idTransaccion = T.id
JOIN (
    SELECT idTransaccion, CEILING(SUM(precio) / 10) AS puntosCalculados
    FROM LineaTransaccion
    GROUP BY idTransaccion
) LT ON T.id = LT.idTransaccion
SET TP.puntosGastados = LT.puntosCalculados
WHERE TP.puntosGastados = 0;
```

### 2. **Actualizar `TransaccionMapper.CrearTransaccionPuntos()`**

```csharp
// Línea ~515
string queryLinkPuntos = @"
    INSERT INTO TransaccionPuntos (idTransaccion, idCliente, puntosGastados) 
    VALUES (@idTrans, @idCli, @puntosGastados)";
var pLinkPuntos = new ParameterList();
pLinkPuntos.Add("@idTrans", idTransaccion);
pLinkPuntos.Add("@idCli", idCliente);
pLinkPuntos.Add("@puntosGastados", puntosRequeridosServidor);  // ✅ NUEVO
DB.ExecuteNonQuery(queryLinkPuntos, pLinkPuntos);
```

### 3. **Actualizar Query en `DromopuntosMapper.ObtenerResumenCompletoSQL()`**

```sql
-- Reemplazar PARTE 3 (Salidas)
SELECT 
    'movimiento' AS tipoResultado,
    TP.id,
    -TP.puntosGastados AS cantidad,  -- ✅ Ahora usa el campo correcto
    NULL AS fechaExpiracion,
    'salida' AS tipoMovimiento,
    E.nombre AS nombreEventoAsociado,
    T.fechaHoraCompra AS fechaMovimiento
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion 
JOIN Entrada EN ON LT.idEntrada = EN.id
JOIN TipoEntrada TE ON EN.idTipoEntrada = TE.id
JOIN FechaEvento FE ON TE.idFechaEvento = FE.id
JOIN Evento E ON FE.idEvento = E.id
WHERE T.idCliente = @idCliente
GROUP BY TP.id  -- ✅ Agrupa por TransaccionPuntos.id en lugar de Transaccion.id

-- Reemplazar PARTE 4 (Expiraciones)
SELECT 
    'movimiento' AS tipoResultado,
    P.id,
    -P.cantidadRestante AS cantidad,  -- ✅ Usa cantidadRestante en lugar de cantidad
    NULL AS fechaExpiracion,
    'expiracion' AS tipoMovimiento,
    'Puntos expirados' AS nombreEventoAsociado,
    P.fechaExpiracion AS fechaMovimiento
FROM Punto P
WHERE P.idCliente = @idCliente 
  AND P.cantidadRestante > 0  -- ✅ Solo lotes con puntos sin gastar
  AND P.fechaExpiracion <= NOW();
```

### 4. **Verificación de Datos**

Ejecuta estas queries para validar la integridad:

```sql
-- 1. Verificar lotes de puntos
SELECT 
    id,
    cantidad,
    cantidadRestante,
    fechaExpiracion,
    CASE 
        WHEN cantidadRestante = 0 THEN 'Totalmente gastado'
        WHEN fechaExpiracion <= NOW() THEN 'Expirado'
        ELSE 'Activo'
    END AS estado
FROM Punto
WHERE idCliente = <TU_ID>;

-- 2. Verificar transacciones con puntos
SELECT 
    T.id,
    T.numeroTransaccion,
    T.montoTotal,
    TP.puntosGastados,
    SUM(LT.precio) AS montoRealEntradas
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
WHERE T.idCliente = <TU_ID>
GROUP BY T.id;

-- 3. Verificar total de puntos disponibles
SELECT 
    SUM(cantidadRestante) AS puntosDisponibles
FROM Punto
WHERE idCliente = <TU_ID>
  AND cantidadRestante > 0
  AND fechaExpiracion > NOW();
```

---

## 🎯 **Resumen del Flujo Correcto**

```
COMPRA CON TARJETA (S/ 100)
    ↓
INSERT INTO Transaccion (montoTotal=100.00, idCliente=X)
    ↓
INSERT INTO TransaccionTarjeta (idTransaccion, idTarjeta)
    ↓
INSERT INTO LineaTransaccion (puntosGanados=1000)  -- 10 pts x S/ 1
    ↓
INSERT INTO Punto (cantidad=1000, cantidadRestante=1000, fechaExpiracion=+1 año)
    ↓
✅ Cliente tiene 1000 puntos disponibles

---

COMPRA CON PUNTOS (300 pts)
    ↓
ConsumirPuntos(300) → UPDATE Punto SET cantidadRestante=700
    ↓
INSERT INTO Transaccion (montoTotal=0.00, idCliente=X)
    ↓
INSERT INTO TransaccionPuntos (idTransaccion, idCliente, puntosGastados=300)  -- ✅ NUEVO
    ↓
INSERT INTO LineaTransaccion (puntosGanados=0)
    ↓
✅ Cliente tiene 700 puntos disponibles

---

CONSULTA DE RESUMEN
    ↓
SELECT cantidadRestante FROM Punto WHERE ... → Total: 700 pts
    ↓
SELECT puntosGanados FROM LineaTransaccion WHERE ... → Historial Ingresos
    ↓
SELECT puntosGastados FROM TransaccionPuntos WHERE ... → Historial Salidas ✅
    ↓
SELECT cantidadRestante FROM Punto WHERE fechaExpiracion <= NOW() → Expiraciones ✅
```

---

## ✅ **Checklist de Implementación**

- [x] Crear migración `017_agregar_puntos_gastados_y_configuracion.sql`
- [ ] Ejecutar migración en base de datos
- [x] Actualizar `TransaccionMapper.CrearTransaccionTarjeta()` para usar configuración de vigencia
- [x] Actualizar `TransaccionMapper.CrearTransaccionPuntos()` para insertar `puntosGastados`
- [x] Actualizar `DromopuntosMapper.ObtenerResumenCompletoSQL()` query PARTE 3 (usar `TP.puntosGastados`)
- [x] Actualizar `DromopuntosMapper.ObtenerResumenCompletoSQL()` query PARTE 4 (usar `P.cantidadRestante`)
- [x] Agregar métodos para obtener y actualizar configuraciones
- [x] Crear DTOs para ConfiguracionDTO y ActualizarConfiguracionDTO
- [x] Agregar endpoints en DromopuntosController
- [ ] Probar compra con tarjeta y verificar vigencia configurable
- [ ] Probar compra con puntos y verificar historial correcto
- [ ] Verificar que el total de puntos sea correcto
- [ ] Verificar que las expiraciones muestren el número correcto

---

## 🆕 **Nuevos Endpoints Disponibles**

### **GET** `/api/Dromopuntos/ObtenerConfiguracion`
Obtiene todas las configuraciones del sistema.

**Response**:
```json
{
  "success": true,
  "message": "Configuración obtenida correctamente.",
  "data": {
    "puntosPorSol": 10.00,
    "mesesVigenciaPuntos": 6,
    "minutosVigenciaCarrito": 30
  },
  "error": null
}
```

### **PUT** `/api/Dromopuntos/ActualizarConfiguracion`
Actualiza las configuraciones (solo los campos enviados).

**Request Body**:
```json
{
  "puntosPorSol": 15.00,
  "mesesVigenciaPuntos": 12,
  "minutosVigenciaCarrito": 45
}
```

**Response**:
```json
{
  "success": true,
  "message": "Configuración actualizada exitosamente.",
  "data": {
    "puntosPorSol": 15.00,
    "mesesVigenciaPuntos": 12,
    "minutosVigenciaCarrito": 45
  },
  "error": null
}
```

---

**Fecha de Análisis**: 21 de Noviembre de 2025  
**Estado**: ✅ Correcciones implementadas - Pendiente de testing
