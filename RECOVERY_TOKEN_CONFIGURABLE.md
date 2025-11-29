# 🔧 Tiempo de Expiración Configurable para Recuperación de Contraseña

## 📋 Resumen de Cambios

Se implementó una funcionalidad que permite al administrador configurar el tiempo de vida del token de recuperación de contraseña. Anteriormente estaba hardcodeado en 1 hora (60 minutos), ahora es completamente configurable desde la tabla de configuración del sistema.

## 🗄️ Cambios en Base de Datos

### Nueva Columna: `minutos_expiracion_recovery`
- **Tabla:** `configuracion`
- **Tipo:** `INT NOT NULL`
- **Valor por defecto:** `60` (1 hora)
- **Descripción:** Tiempo de vigencia del token de recuperación de contraseña en minutos

### Migración SQL
**Archivo:** `Backend/EventodromoRest/Migraciones/add_minutos_expiracion_recovery.sql`

```sql
ALTER TABLE `configuracion` 
ADD COLUMN `minutos_expiracion_recovery` INT NOT NULL DEFAULT 60 
COMMENT 'Tiempo de vigencia del token de recuperación de contraseña en minutos (ej: 60 = 1 hora)';
```

## 🔨 Cambios en Backend

### 1. **ConfiguracionDTO.cs** (Modelos)
Agregadas nuevas propiedades:
```csharp
public int MinutosExpiracionRecovery { get; set; }  // En ConfiguracionDTO
public int? MinutosExpiracionRecovery { get; set; } // En ActualizarConfiguracionDTO
```

### 2. **DromopuntosMapper.cs** (Mappers)
Nuevo método para leer la configuración:
```csharp
public int ObtenerMinutosExpiracionRecovery()
{
    // Lee minutos_expiracion_recovery de la BD
    // Fallback: 60 minutos si no existe
}
```

Actualizado:
- `ObtenerConfiguracionCompleta()`: Ahora incluye `MinutosExpiracionRecovery`
- `ActualizarConfiguracion()`: Permite actualizar el nuevo campo

### 3. **ClienteController.cs** (Controllers)
Método `RecuperarContrasena` actualizado:
- **Antes:** `DateTime.Now.AddHours(1)` (hardcoded)
- **Ahora:** `DateTime.Now.AddMinutes(minutosExpiracion)` (dinámico)

```csharp
var dromopuntosMapper = new DromopuntosMapper(globales, BD);
int minutosExpiracion = dromopuntosMapper.ObtenerMinutosExpiracionRecovery();
DateTime fechaExpiracion = DateTime.Now.AddMinutes(minutosExpiracion);
```

### 4. **Mensaje de Email Dinámico**
El email ahora muestra el tiempo de expiración en formato amigable:
- **< 60 min:** "30 minutos", "45 minutos"
- **≥ 60 min:** "1 hora", "2 horas", "1 hora y 30 minutos"

```csharp
// Ejemplos de salida:
// 30 minutos → "El enlace expirará en 30 minutos."
// 60 minutos → "El enlace expirará en 1 hora."
// 90 minutos → "El enlace expirará en 1 hora y 30 minutos."
// 120 minutos → "El enlace expirará en 2 horas."
```

## 📦 Ejecución de la Migración

### Opción 1: PowerShell (Windows) ⭐ Recomendado
```powershell
cd "c:\yo\8vo ciclo\Ingenieria de software\codigo\EventoDromo"
.\run_migration_recovery.ps1
```

### Opción 2: Manual con Docker
```powershell
# 1. Encontrar el contenedor de la BD
docker ps

# 2. Copiar el archivo SQL
docker cp Backend/EventodromoRest/Migraciones/add_minutos_expiracion_recovery.sql <container_name>:/tmp/

# 3. Ejecutar la migración
docker exec <container_name> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "T8m!r2xZ" -d myDb -i /tmp/add_minutos_expiracion_recovery.sql

# 4. Verificar
docker exec <container_name> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "T8m!r2xZ" -d myDb -Q "SELECT * FROM configuracion"
```

## 🎮 Uso del Administrador

### Consultar Configuración Actual
```http
GET http://localhost:8080/api/Dromopuntos/ObtenerConfiguracion
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Configuración obtenida correctamente.",
  "data": {
    "puntosPorSol": 10.00,
    "mesesVigenciaPuntos": 6,
    "minutosVigenciaCarrito": 10,
    "horasExpiracionTransferencia": 24,
    "minutosExpiracionRecovery": 60  // ← NUEVO CAMPO
  }
}
```

### Actualizar Tiempo de Expiración
```http
POST http://localhost:8080/api/Dromopuntos/ActualizarConfiguracion
Content-Type: application/json

{
  "minutosExpiracionRecovery": 120  // 2 horas
}
```

## 📊 Ejemplos de Configuración

| Valor | Descripción | Mensaje Email |
|-------|-------------|---------------|
| `30` | 30 minutos | "El enlace expirará en 30 minutos." |
| `60` | 1 hora (default) | "El enlace expirará en 1 hora." |
| `90` | 1.5 horas | "El enlace expirará en 1 hora y 30 minutos." |
| `120` | 2 horas | "El enlace expirará en 2 horas." |
| `1440` | 24 horas | "El enlace expirará en 24 horas." |

## ✅ Pruebas Recomendadas

### 1. Verificar Migración
```powershell
docker exec <container> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "T8m!r2xZ" -d myDb -Q "SELECT minutos_expiracion_recovery FROM configuracion WHERE id = 1"
```

### 2. Probar Configuración
1. Actualizar a 30 minutos mediante el endpoint
2. Solicitar recuperación de contraseña
3. Verificar que el email dice "30 minutos"
4. Verificar que el token expira después de 30 minutos

### 3. Probar Diferentes Tiempos
- **30 min:** Email debe decir "30 minutos"
- **60 min:** Email debe decir "1 hora"
- **90 min:** Email debe decir "1 hora y 30 minutos"
- **120 min:** Email debe decir "2 horas"

## 🔐 Seguridad

- ✅ El valor se valida en backend
- ✅ Solo administradores pueden modificarlo (requiere token JWT)
- ✅ El tiempo de expiración se valida al intentar usar el token
- ✅ Tokens expirados no pueden ser reutilizados

## 📝 Notas Adicionales

1. **Compatibilidad con BUG #7:** Los emails ya usan la URL del frontend correcta (`AppSettings:FrontendUrl`) configurada en `docker-compose.yml` o `docker-compose.prod.yml`

2. **Fallback:** Si la columna no existe o hay error, el sistema usará 60 minutos por defecto

3. **Formato del Email:** El tiempo se muestra de forma natural y amigable en español

4. **Frontend:** El componente `page.js` de recuperación de contraseña NO necesita cambios, solo trabaja con el token recibido

## 🐛 Relación con BUG #13

✅ **BUG #13 RESUELTO:** "Tiempo de expiración del token de recuperación configurable"
- Estado: IMPLEMENTADO
- Prioridad: 🟡 Media
- Archivos afectados: 8 archivos (SQL, DTOs, Mappers, Controllers)

## 🚀 Deployment

### Development
```powershell
docker-compose down
docker-compose up --build
# Ejecutar migración con run_migration_recovery.ps1
```

### Production
```powershell
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build
# Ejecutar migración manualmente en el servidor
```

---

**Autor:** GitHub Copilot  
**Fecha:** 2025-01-28  
**Versión:** 1.0
