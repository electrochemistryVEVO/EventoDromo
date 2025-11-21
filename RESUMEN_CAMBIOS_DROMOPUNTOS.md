# Resumen de Cambios - Corrección Flujo DromoPuntos

## 📋 Cambios Implementados

### 1. **Migración de Base de Datos** ✅
**Archivo**: `017_agregar_puntos_gastados_y_configuracion.sql`

**Cambios**:
- ✅ Agregado campo `puntosGastados` a tabla `TransaccionPuntos`
- ✅ Agregado campo `meses_vigencia_puntos` a tabla `configuracion` (default: 6 meses)
- ✅ Agregado campo `minutos_vigencia_carrito` a tabla `configuracion` (default: 30 minutos)
- ✅ Backfill automático de `puntosGastados` para transacciones existentes

### 2. **Correcciones en Queries** ✅

#### `DromopuntosMapper.ObtenerResumenCompletoSQL()`
- ✅ **PARTE 3 (Salidas)**: Cambió de `-T.montoTotal` a `-TP.puntosGastados`
- ✅ **PARTE 4 (Expiraciones)**: Cambió de `-P.cantidad` a `-P.cantidadRestante`
- ✅ **GROUP BY**: Cambió de `T.id` a `TP.id` en salidas

**Antes** ❌:
```sql
-T.montoTotal AS cantidad  -- Siempre era 0.00 en pagos con puntos
```

**Ahora** ✅:
```sql
-TP.puntosGastados AS cantidad  -- Muestra los puntos reales gastados
```

### 3. **Configuraciones Dinámicas** ✅

#### Nuevos Métodos en `DromopuntosMapper`:
- ✅ `ObtenerMesesVigenciaPuntos()`: Lee desde configuracion.meses_vigencia_puntos
- ✅ `ObtenerMinutosVigenciaCarrito()`: Lee desde configuracion.minutos_vigencia_carrito
- ✅ `ObtenerConfiguracionCompleta()`: Retorna todas las configuraciones
- ✅ `ActualizarConfiguracion()`: Actualiza solo los campos enviados

#### `TransaccionMapper.CrearTransaccionTarjeta()`:
**Antes** ❌:
```csharp
"VALUES (@cant, @cantRestante, UTC_TIMESTAMP(), @idCli, UTC_TIMESTAMP() + INTERVAL 1 YEAR);"
```

**Ahora** ✅:
```csharp
int mesesVigencia = dromopuntosMapper.ObtenerMesesVigenciaPuntos();
$"VALUES (@cant, @cantRestante, UTC_TIMESTAMP(), @idCli, UTC_TIMESTAMP() + INTERVAL {mesesVigencia} MONTH);"
```

#### `TransaccionMapper.CrearTransaccionPuntos()`:
**Antes** ❌:
```csharp
"INSERT INTO TransaccionPuntos (idTransaccion, idCliente) VALUES (@idTrans, @idCli);"
```

**Ahora** ✅:
```csharp
"INSERT INTO TransaccionPuntos (idTransaccion, idCliente, puntosGastados) VALUES (@idTrans, @idCli, @puntosGastados);"
```

### 4. **Nuevos DTOs** ✅
**Archivo**: `ConfiguracionDTO.cs`

```csharp
public class ConfiguracionDTO
{
    public decimal PuntosPorSol { get; set; }          // Cuántos soles vale 1 punto
    public int MesesVigenciaPuntos { get; set; }       // Vigencia de puntos
    public int MinutosVigenciaCarrito { get; set; }    // Vigencia del carrito
}

public class ActualizarConfiguracionDTO
{
    public decimal? PuntosPorSol { get; set; }
    public int? MesesVigenciaPuntos { get; set; }
    public int? MinutosVigenciaCarrito { get; set; }
}
```

### 5. **Nuevos Endpoints** ✅

#### **GET** `/api/Dromopuntos/ObtenerConfiguracion`
- Retorna todas las configuraciones del sistema
- Requiere autenticación (`[Authorize]`)

#### **PUT** `/api/Dromopuntos/ActualizarConfiguracion`
- Actualiza configuraciones (solo campos enviados)
- Requiere autenticación (`[Authorize]`)
- Acepta `ActualizarConfiguracionDTO` en el body

## 🔧 Instrucciones de Despliegue

### Paso 1: Ejecutar Migración SQL
```bash
mysql -u root -p eventodromo < Backend/EventodromoRest/Migraciones/017_agregar_puntos_gastados_y_configuracion.sql
```

### Paso 2: Compilar Backend
```bash
cd Backend/EventodromoRest
dotnet build
```

### Paso 3: Verificar Logs
Buscar en la consola:
- ✅ "Migración aplicada correctamente"
- ✅ Sin errores de compilación

### Paso 4: Testing

#### Test 1: Verificar Configuración
```bash
GET /api/Dromopuntos/ObtenerConfiguracion
Authorization: Bearer <token>
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "puntosPorSol": 10.00,
    "mesesVigenciaPuntos": 6,
    "minutosVigenciaCarrito": 30
  }
}
```

#### Test 2: Compra con Tarjeta
1. Agregar entradas al carrito
2. Procesar pago con tarjeta
3. Verificar que se creó el lote de puntos:
   ```sql
   SELECT cantidad, cantidadRestante, fechaExpiracion 
   FROM Punto 
   WHERE idCliente = <ID> 
   ORDER BY fechaHoraRegistro DESC 
   LIMIT 1;
   ```
4. Verificar que `fechaExpiracion = fechaHoraRegistro + 6 MONTHS`

#### Test 3: Compra con Puntos
1. Agregar entradas al carrito
2. Procesar pago con puntos
3. Verificar historial en `/api/Dromopuntos/ObtenerResumen`
4. Verificar que las "Salidas" muestren el número correcto de puntos
5. Verificar en BD:
   ```sql
   SELECT TP.puntosGastados, T.montoTotal 
   FROM TransaccionPuntos TP
   JOIN Transaccion T ON TP.idTransaccion = T.id
   WHERE TP.idCliente = <ID>
   ORDER BY T.fechaHoraCompra DESC
   LIMIT 1;
   ```
   - `puntosGastados` debe ser > 0
   - `montoTotal` debe ser 0.00

#### Test 4: Actualizar Configuración
```bash
PUT /api/Dromopuntos/ActualizarConfiguracion
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "puntosPorSol": 15.00,
  "mesesVigenciaPuntos": 12
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "puntosPorSol": 15.00,
    "mesesVigenciaPuntos": 12,
    "minutosVigenciaCarrito": 30
  }
}
```

## 📊 Validación de Datos

### Query 1: Verificar Lotes de Puntos
```sql
SELECT 
    id,
    cantidad,
    cantidadRestante,
    fechaHoraRegistro,
    fechaExpiracion,
    TIMESTAMPDIFF(MONTH, fechaHoraRegistro, fechaExpiracion) AS meses_vigencia,
    CASE 
        WHEN cantidadRestante = 0 THEN '✅ Totalmente gastado'
        WHEN fechaExpiracion <= NOW() THEN '⚠️ Expirado'
        ELSE '🟢 Activo'
    END AS estado
FROM Punto
WHERE idCliente = <TU_ID>
ORDER BY fechaHoraRegistro DESC;
```

### Query 2: Verificar Transacciones con Puntos
```sql
SELECT 
    T.id,
    T.numeroTransaccion,
    T.montoTotal AS monto_transaccion,
    TP.puntosGastados AS puntos_usados,
    SUM(LT.precio) AS monto_real_entradas
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
WHERE T.idCliente = <TU_ID>
GROUP BY T.id
ORDER BY T.fechaHoraCompra DESC;
```

**Validación**:
- ✅ `monto_transaccion = 0.00`
- ✅ `puntos_usados > 0`
- ✅ `puntos_usados = CEILING(monto_real_entradas / puntos_por_sol)`

### Query 3: Verificar Historial Correcto
```sql
-- Simular la query del frontend
SELECT 'salida' AS tipo, -TP.puntosGastados AS cantidad, T.fechaHoraCompra
FROM Transaccion T
JOIN TransaccionPuntos TP ON T.id = TP.idTransaccion
WHERE T.idCliente = <TU_ID>
UNION ALL
SELECT 'ingreso' AS tipo, LT.puntosGanados AS cantidad, T.fechaHoraCompra
FROM Transaccion T
JOIN LineaTransaccion LT ON T.id = LT.idTransaccion
WHERE T.idCliente = <TU_ID> AND LT.puntosGanados > 0
ORDER BY fechaHoraCompra DESC;
```

## ⚠️ Consideraciones Importantes

### 1. **Conversión de Puntos**
- ✅ **CORRECTO**: `puntos_por_sol = 10` significa que **1 punto vale S/ 10.00**
- ❌ **INCORRECTO**: NO significa que 10 puntos valen S/ 1.00

**Ejemplo**:
- Entrada cuesta S/ 50.00
- Conversión: 1 punto = S/ 10.00
- Puntos necesarios: 50 / 10 = **5 puntos**

### 2. **Vigencia de Puntos**
- Se calcula dinámicamente desde `configuracion.meses_vigencia_puntos`
- Ya NO está hardcodeado a 1 año
- Cambios en configuración NO afectan puntos ya generados

### 3. **Backfill de Datos**
- La migración calcula automáticamente `puntosGastados` para transacciones existentes
- Si hay discrepancias, ejecutar manualmente la query UPDATE del paso 4 de la migración

## 📝 Notas Finales

- ✅ Todos los cambios son **backward compatible**
- ✅ Se agregaron valores por defecto (no rompe instalaciones existentes)
- ✅ Backfill automático de datos históricos
- ⚠️ Recomendado: Crear índice en `TransaccionPuntos.puntosGastados` si hay muchas transacciones
- ⚠️ Frontend necesitará actualizar la visualización si actualmente muestra "0 puntos" en salidas

---

**Fecha**: 21 de Noviembre de 2025  
**Autor**: GitHub Copilot  
**Estado**: ✅ Implementado - Pendiente de Testing
