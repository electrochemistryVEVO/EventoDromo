# 🐛 Bug Tracking - Sistema Desplegado EventoDromo

**Fecha de inicio:** 28 de Noviembre, 2025  
**Rama:** main-iteracion4  
**Ambiente:** Producción (http://34.238.85.28:3000/)  
**Responsable:** Equipo de desarrollo

---

## 📋 Lista de Bugs Identificados en Deploy

### 🔴 BUG #1: Código de Descuento - No Está Fijo
**Prioridad:** Media  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- El componente del código de descuento debe permanecer fijo en la pantalla
- Actualmente se desplaza con el scroll
- Debería estar visible siempre como el resumen de compra
- **Mejora adicional**: Reducir altura de tabla de entradas en carrito

**Solución implementada:**
```css
/* entradaDetalle.module.css */
.rightColumn > *:first-child {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fff;
    padding-bottom: 0.5rem;
}
```

```jsx
// TablaEntradas.jsx - Reducción de altura del header
<header className="... py-2 ..."> {/* Reducido de py-5 a py-2 */}
  <div className="text-sm">Evento</div> {/* Reducido de text-base a text-sm */}
  <div className="text-sm ...">Cantidad</div>
  <div className="text-sm ...">Precio</div>
</header>
<footer className="... py-3 ..."> {/* Reducido de py-4 a py-3 */}
```

**Detalles técnicos:**
- El código de descuento es el primer hijo de `.rightColumn`
- Usa `position: sticky` con `top: 0` para mantenerse visible
- `z-index: 10` asegura que esté sobre otros elementos
- Tabla de carrito más compacta: reducido padding y tamaño de texto en encabezados
- Mejor aprovechamiento del espacio vertical

**Testing completado:**
- [x] Código de descuento permanece visible al hacer scroll
- [x] No oculta otros elementos importantes
- [x] Funciona en diferentes tamaños de pantalla
- [x] Resto del contenido scrollea normalmente debajo
- [x] Tabla de carrito más compacta y legible
- [x] Encabezados ocupan menos espacio vertical

---

### 🔴 BUG #2: CompraPagoConLogin - Parpadeo/Actualización Rápida
**Prioridad:** 🚨 **CRÍTICA**  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- La página `CompraPagoConLogin` parpadeaba o se actualizaba muy rápidamente
- **No se podía completar ninguna compra** (bug bloqueante)
- La página re-renderizaba constantemente
- Loop infinito causado por `refreshUserPoints()`

**Causa raíz identificada:**
- `refreshUserPoints` no estaba memoizada con `useCallback`
- Se recreaba en cada render del UserContext
- useEffect en page.js se disparaba infinitamente

**Solución implementada:**
1. ✅ Envuelto `updateUserPoints` y `refreshUserPoints` en `useCallback`
2. ✅ Cambiado a usar `getResumenDromopuntos` (servicio más confiable)
3. ✅ Eliminada llamada inmediata al montar componente
4. ✅ Actualización en segundo plano cada 60 segundos (silenciosa)

**Archivos modificados:**
- `front-edromo/src/context/UserContext.jsx`
- `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js`

**Testing completado:**
- [x] Página carga sin parpadeos
- [x] Se puede completar compra con tarjeta
- [x] Se puede completar compra con puntos
- [x] Puntos se muestran correctamente (34 puntos, no 0)

---

### 🔴 BUG #3: Filtros de Eventos - No Funcionan (Estados)
**Prioridad:** Alta  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Los filtros por estado de eventos no funcionan correctamente
- Estados esperados: Próximos, En curso, Finalizados
- Los filtros no aplican correctamente o no muestran resultados

**Archivos a revisar:**
- `front-edromo/src/app/user/web/eventos/lista/page.js`
- `front-edromo/src/services/Evento.service.js`
- Backend: `EventodromoRest/Controllers/EventoController.cs`
- Backend: `EventodromoRest/Mappers/EventoMapper.cs`

**Solución implementada:**
```csharp
// EventoMapper.cs - Todos los métodos de listado filtran por fecha
SELECT DISTINCT e.* FROM Evento e
INNER JOIN FechaEvento fe ON e.id = fe.idEvento
WHERE fe.fechaHora >= NOW() AND e.isDeleted = 0

// ListarEventos() - Línea 17
// ListarEventosPorTipo() - Similar filtrado
// ListarEventosPorBusqueda() - Similar filtrado
```

**Testing completado:**
- [x] Solo se muestran eventos con al menos una fecha futura
- [x] Eventos sin fechas futuras no aparecen en listados
- [x] Búsqueda respeta el filtro de fechas
- [x] JOIN con FechaEvento asegura validación correcta

---

### 🟢 BUG #4: Auditoría - Última Sesión No Se Registra
**Prioridad:** Media  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 15 de Enero, 2025

**Descripción:**
- La última sesión de usuario no se estaba auditando correctamente
- Debería registrar: Login, Logout, Acciones importantes
- Tabla: `Auditoria` (campo `idTipoAuditoria`)
- Campo `fechaUltimaSesion` en tabla Cliente no se actualizaba

**Solución implementada:**

**1. Backend - ClienteBO.cs:**
```csharp
// Agregado registro de auditoría en AutenticarCliente()
if (cliente != null)
{
    // ... código existente ...
    
    // ✅ REGISTRAR LOGIN EN AUDITORÍA
    try
    {
        // Actualizar fecha de última sesión
        mapper.ActualizarUltimaSesion(idCliente);

        // Registrar auditoría de login solo para clientes (no admins)
        if (tipoUsuario == 'C')
        {
            var auditoriaMapper = new AuditoriaMapper(globales, DB);
            var auditoria = new Auditoria
            {
                idcliente = idCliente,
                idtipoauditoria = 2, // ID 2 = Login
                descripcion = $"Inicio de sesión exitoso desde {email}",
                fechahora = DateTime.Now,
                monto = 0
            };
            auditoriaMapper.InsertarAuditoria(auditoria);
        }
    }
    catch (Exception ex)
    {
        // No fallar el login si la auditoría falla
        Console.WriteLine($"⚠️ Error al registrar auditoría de login: {ex.Message}");
    }
}
```

**2. Backend - ClienteMapper.cs:**
```csharp
/// <summary>
/// Actualiza la fecha de última sesión del cliente
/// </summary>
public int ActualizarUltimaSesion(int idCliente)
{
    lock (DB)
    {
        string query = "UPDATE Cliente SET fechaUltimaSesion = NOW() WHERE id = @idCliente";
        var parametros = new ParameterList();
        parametros.Add("@idCliente", idCliente);
        int rowsAffected = DB.ExecuteNonQuery(query, parametros);
        return rowsAffected;
    }
}
```

**3. Base de Datos - Script INIT_TIPO_AUDITORIA.sql:**
```sql
-- Creado script para inicializar tipos de auditoría
INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(1, 'Compra de entradas', 'shopping_cart', '#4CAF50'),
(2, 'Inicio de sesión', 'login', '#2196F3'),
(3, 'Cierre de sesión', 'logout', '#FF9800'),
(4, 'Uso de puntos', 'stars', '#9C27B0'),
(5, 'Transferencia enviada', 'send', '#FF5722'),
(6, 'Transferencia recibida', 'inbox', '#03A9F4')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);
```

**Archivos modificados:**
- ✅ `Backend/EventodromoRest/Negocio/ClienteBO.cs`
- ✅ `Backend/EventodromoRest/Mappers/ClienteMapper.cs`

**Archivos creados:**
- ✅ `Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql`
- ✅ `Backend/EventodromoRest/Scripts/README.md`

**Tipos de auditoría implementados:**
- ✅ ID 1: Compra de entradas (ya existía)
- ✅ ID 2: Inicio de sesión (IMPLEMENTADO)
- ⏸️ ID 3: Cierre de sesión (preparado en BD, no implementado en código)
- ✅ ID 4: Uso de puntos (ya existía)
- ✅ ID 5: Transferencia enviada (ya existía)
- ✅ ID 6: Transferencia recibida (ya existía)

**Decisiones de diseño:**
- ✅ Solo se audita login de clientes (rol 'C'), no de administradores
- ✅ Try-catch para no bloquear el login si la auditoría falla
- ✅ `fechaUltimaSesion` se actualiza antes de registrar auditoría
- ✅ Script SQL usa `ON DUPLICATE KEY UPDATE` para ser idempotente
- ⏸️ Logout endpoint no implementado (requiere cambios frontend)

**Instrucciones de despliegue:**
```bash
# Ejecutar script SQL ANTES de desplegar código
mysql -u root -p eventodromo < Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql

# O en Docker:
docker exec -i eventodromo-mysql mysql -u root -peventodromo eventodromo < Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql

# Verificar tipos de auditoría:
SELECT * FROM TipoAuditoria ORDER BY id;
```

**Testing completado:**
- ✅ Login crea entrada en tabla Auditoria con idTipoAuditoria = 2
- ✅ fechaUltimaSesion se actualiza en cada login
- ✅ Login funciona correctamente incluso si auditoría falla
- ✅ No se auditan logins de administradores
- ✅ Script SQL es idempotente (puede ejecutarse múltiples veces)

**Notas adicionales:**
- La funcionalidad de logout (tipo 3) queda preparada en la base de datos
- Para implementar logout completo se requiere:
  1. Crear endpoint en ClienteController.cs
  2. Agregar botón de logout en frontend
  3. Registrar auditoría con idTipoAuditoria = 3

---

### 🔴 BUG #5: Eventos Pasados - Se Muestran y Permiten Compra
**Prioridad:** 🚨 **CRÍTICA**  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Se podían ver eventos que ya pasaron su fecha
- Peor aún: **Se podían comprar entradas de eventos pasados**
- Error crítico de lógica de negocio
- **Problema adicional identificado**: Los eventos tienen múltiples fechas (FechaEvento), necesitaba validar correctamente

**Análisis del problema:**
- Un evento puede tener múltiples fechas (ej: concierto viernes, sábado, domingo)
- El sistema debe mostrar el evento si AL MENOS UNA fecha es futura
- El sistema debe permitir comprar SOLO las fechas futuras
- El frontend debe filtrar y mostrar solo fechas válidas

**Solución implementada:**

**Backend:**
1. ✅ Modificado `ListarEventos()` - JOIN con FechaEvento filtra eventos con al menos una fecha futura
2. ✅ Modificado `ListarEventosPorTipo()` - Mismo filtro por fecha futura
3. ✅ Modificado `ListarEventosBusqueda()` - Solo busca eventos con fechas futuras
4. ✅ Agregada validación en `AgregarItemAlCarrito()` - Rechaza entradas de fechas pasadas
5. ✅ `ListarEventosActivosCompletos()` - Ya usaba `MIN(f.fechaHora)` correctamente para mostrar fecha más próxima
6. ✅ `MisEntradasMapper` - Filtra por `FE.fechaHora > NOW()` para entradas vigentes

**Frontend:**
1. ✅ `BookingPanel.jsx` - Filtra fechas pasadas del selector de fechas
2. ✅ `BookingPanel.jsx` - Inicializa automáticamente con la primera fecha FUTURA
3. ✅ Lista de eventos - Ya mostraba `fechaProximoEvento` (fecha más cercana futura)
4. ✅ Mis entradas - Backend ya filtra correctamente por estado vigente/vencido

**Archivos modificados:**
- `Backend/EventodromoRest/Mappers/EventoMapper.cs` (3 métodos)
- `Backend/EventodromoRest/Mappers/CarritoMapper.cs` (validación agregada)
- `front-edromo/src/components/detalle-evento/BookingPanel.jsx` (filtro de fechas)

**Queries actualizados:**
```sql
-- ListarEventos, ListarEventosPorTipo, ListarEventosBusqueda:
SELECT DISTINCT e.* FROM Evento e
INNER JOIN FechaEvento fe ON e.id = fe.idEvento
WHERE fe.fechaHora > NOW() AND e.isDeleted = 0

-- AgregarItemAlCarrito (validación):
SELECT COUNT(*) FROM TipoEntrada te
INNER JOIN FechaEvento fe ON te.idFechaEvento = fe.id
WHERE te.id = @idTipoEntrada AND fe.fechaHora > NOW()
```

**Lógica Frontend BookingPanel:**
```javascript
// Filtra solo fechas futuras o del día actual
const availableDates = useMemo(() => {
  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0);
  
  functions.forEach((func) => {
    const fechaEvento = parsearFecha(func.fecha);
    if (fechaEvento >= ahora) {
      // Agregar al selector
    }
  });
}, [functions]);
```

**Testing completado:**
- [x] Lista de eventos NO muestra eventos sin fechas futuras
- [x] Eventos con múltiples fechas se muestran si tienen al menos una futura
- [x] Selector de fechas en detalle solo muestra fechas futuras
- [x] Primera fecha futura se selecciona automáticamente
- [x] No se puede agregar evento pasado al carrito (validación backend)
- [x] Búsqueda solo retorna eventos con fechas futuras
- [x] Filtro de entradas vencidas funciona correctamente

---

### 🔴 BUG #6: Transferencias - Permiten Entradas Vencidas
**Prioridad:** Alta  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Se pueden transferir entradas de eventos que ya pasaron
- No tiene sentido transferir entrada de un evento finalizado
- Validación de fecha falta en transferencias

**Archivos a revisar:**
- Backend: `EventodromoRest/Controllers/TransaccionController.cs`
- Backend: `EventodromoRest/Mappers/TransferirEntradasMapper.cs`
- Backend: `EventodromoRest/Negocio/TransaccionBO.cs`
- Frontend: `front-edromo/src/app/transferir/page.js`

**Solución implementada:**
```csharp
// TransferirEntradasBO.cs - Línea 105
bool entradasValidas = mapper.ValidarEntradasDisponibles(request.entradas);
if (!entradasValidas)
{
    return new GenericResponse<TransferirEntradasResponse>
    {
        Success = false,
        Message = "Entradas no disponibles",
        Error = "No se pueden transferir entradas de eventos pasados o que no están disponibles"
    };
}

// TransferirEntradasMapper.cs - ValidarEntradasDisponibles
// Valida que las entradas existan, estén disponibles Y sean de eventos futuros
// Query incluye: fe.fechaHora > NOW()
```

**Frontend:**
```jsx
// mis-entrada-item.jsx - Línea 215
<TransferirButton 
  disabled={eventoVencido || (estadoEntradas.disponibles === 0)}
  disabledReason={eventoVencido ? 'expired' : 'no-available'}
/>

// esEventoVencido() valida fecha/hora del evento
const fechaEvento = new Date(anio, mes - 1, dia, horas, minutos);
return fechaEvento < ahora;
```

**Testing completado:**
- [x] Backend valida fechas antes de transferir
- [x] Frontend deshabilita botón para eventos pasados
- [x] Mensaje claro: "No se pueden transferir entradas de eventos pasados"
- [x] Solo entradas de eventos futuros son transferibles

---

### 🔴 BUG #7: Email Transferencia - URL Localhost en Deploy
**Prioridad:** 🚨 **CRÍTICA**  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Correos de transferencia (aceptar/rechazar) envían links a `localhost:3000`
- Debería enviar a: `http://34.238.85.28:3000/`
- Los usuarios no pueden aceptar/rechazar transferencias desde el correo

**Archivos a revisar:**
- Backend: `EventodromoRest/Servicios/EmailService.cs`
- Backend: `EventodromoRest/assets/hbsTemplates/confirmacion-transferencia.hbs`
- Backend: `EventodromoRest/appsettings.json` o `appsettings.Production.json`

**Solución implementada:**
```csharp
// TransferirEntradasBO.cs - Línea 184
string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";

// docker-compose.yml (Desarrollo)
environment:
    AppSettings__FrontendUrl: "http://localhost:3000"

// docker-compose.prod.yml (Producción)
environment:
    AppSettings__FrontendUrl: "http://34.238.85.28:3000"
```

**Testing completado:**
- [x] URL se obtiene dinámicamente de configuración
- [x] Fallback a localhost si variable no existe
- [x] docker-compose.yml configurado para desarrollo
- [x] docker-compose.prod.yml configurado para producción
- [x] Emails usan URL correcta según ambiente

---

### 🟡 BUG #8: Entrada Pendiente - Se Puede Descargar
**Prioridad:** Media  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Se puede descargar PDF de entrada con estado "Pendiente" (transferencia no aceptada)
- Solo se debería poder descargar entradas confirmadas o propias
- Estados: `null` (propia), `pendiente`, `aceptada`, `rechazada`

**Archivos a revisar:**
- Backend: `EventodromoRest/Mappers/EntradaMapper.cs`
- Frontend: `front-edromo/src/components/Layouts/perfil/mis-entradas.jsx`
- Frontend: `front-edromo/src/services/PDFGenerator.service.js`

**Solución implementada:**
```csharp
// Backend - TransaccionMapper.cs
// ObtenerDetalleCompleto filtra entradas por estadoTransferencia
// Solo retorna entradas disponibles (null o 'disponible')
// Las entradas 'pendiente' no se incluyen en el detalle

// TransferirEntradasMapper.cs - Múltiples validaciones:
// Línea 39: WHERE COALESCE(E.estadoTransferencia, 'disponible') = 'disponible'
// Línea 90: WHERE COALESCE(E.estadoTransferencia, 'disponible') = 'disponible'
// Línea 136: WHERE COALESCE(E2.estadoTransferencia, 'disponible') = 'disponible'
```

**Frontend:**
```jsx
// DescargarButton.jsx
// Usa obtenerDetalleTransaccion que internamente filtra por estado
// Solo carga entradas disponibles desde el backend

// mis-entrada-item.jsx - Muestra estado visual
{estadoEntradas.pendientes > 0 && (
  <span className="mei-estado-pendiente">{estadoEntradas.pendientes}</span>
)}
```

**Testing completado:**
- [x] Backend filtra entradas pendientes en ObtenerDetalleCompleto
- [x] Frontend solo muestra entradas disponibles para descarga
- [x] Estado de transferencia visible en UI (disponibles/pendientes/transferidas)
- [x] Sistema de estados funciona correctamente

---

### 🟡 BUG #9: Información Personal - Carga Más Lenta
**Prioridad:** Baja (Optimización)  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Pestaña "Información Personal" tarda más en cargar que "Mis Entradas" y "Mis Puntos"
- Diferencia notable en tiempo de respuesta
- Experiencia de usuario inconsistente

**Archivos a revisar:**
- Backend: `EventodromoRest/Mappers/PerfilMapper.cs`
- Backend: `EventodromoRest/Controllers/ClienteController.cs`
- Frontend: `front-edromo/src/components/Layouts/perfil/informacion-personal.jsx`

**Posibles causas:**
1. Query SQL con múltiples JOINs innecesarios
2. Consulta hace N+1 queries (ciudades, países, sexos)
3. No hay caché para datos estáticos (países, ciudades)
4. Frontend hace múltiples requests secuenciales

**Solución propuesta:**
- Optimizar query SQL (revisar EXPLAINs)
- Implementar caché para datos estáticos
- Usar Promise.all() para requests paralelos
- Considerar lazy loading de listas grandes

**Testing requerido:**
- [ ] Medir tiempo de carga actual (baseline)
- [ ] Optimizar queries
- [ ] Medir mejora de performance
- [ ] Tiempos similares entre pestañas

---

### 🔴 BUG #10: Recuperar Contraseña - Solo Funciona en Localhost
**Prioridad:** 🚨 **CRÍTICA**  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Función de recuperar contraseña solo funciona en localhost
- Debería ser un **botón**, no una URL directa
- Actualmente podría estar hardcodeado a `http://localhost:3000`

**Archivos a reviewer:**
- Backend: `EventodromoRest/Servicios/EmailService.cs`
- Backend: `EventodromoRest/Controllers/ClienteController.cs` (endpoint recuperar)
- Backend: `EventodromoRest/assets/hbsTemplates/recuperar-password.hbs`
- Frontend: `front-edromo/src/components/ForgotPasswordModal/`

**Solución implementada:**
```csharp
// ClienteController.cs - Línea 670 (RecuperarContrasena)
string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
string urlFinal = $"{urlBase}/auth/recuperarContrasena?token={tokenRecuperacion}";

// Email incluye tiempo de expiración configurable (BUG #13 resuelto)
string tiempoExpiracion = FormatearTiempoExpiracion(minutosExpiracion);
```

**Mejoras adicionales implementadas:**
- ✅ Tiempo de expiración del token ahora es configurable desde admin (tabla configuracion)
- ✅ Email muestra tiempo de expiración de forma amigable ("1 hora", "30 minutos", "1 hora y 30 minutos")
- ✅ Mismo sistema de configuración multi-ambiente que BUG #7

**Testing completado:**
- [x] Email de recuperación contiene URL correcta según ambiente
- [x] Link funciona en desarrollo (localhost:3000)
- [x] Link funciona en producción (34.238.85.28:3000)
- [x] Tiempo de expiración es configurable por admin
- [x] Email muestra tiempo formateado correctamente

---

### 🟢 BUG #11: Admin - Crear Más Administradores (Feature Request)
**Prioridad:** Media  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- Actualmente no existe funcionalidad para crear nuevos administradores
- Solo existe el admin inicial de la migración
- Se necesita UI y backend para gestión de admins

**Archivos a crear/modificar:**
- Frontend: `front-edromo/src/app/admin/usuarios/` (nueva página)
- Backend: `EventodromoRest/Controllers/AdministradorController.cs`
- Backend: `EventodromoRest/Mappers/AdministradorMapper.cs`

**Solución implementada:**
- ✅ Funcionalidad completa de gestión de administradores implementada
- ✅ Backend: AdministradorController con CRUD completo
- ✅ Frontend: UI para listar, crear, editar y desactivar administradores
- ✅ Sistema de roles y permisos funcionando correctamente

**Testing completado:**
- [x] Admin puede crear nuevos administradores
- [x] Admin puede listar administradores existentes
- [x] Admin puede desactivar otros administradores
- [x] Sistema de autenticación y autorización funciona correctamente

---

### 🟡 BUG #12: Configuración Admin - Mensaje de Confirmación Mejorable
**Prioridad:** Baja (UX)  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Página de configuraciones del admin usa `alert()` simple de JavaScript
- Debería usar un modal/toast más profesional
- Mensajes de confirmación no son consistentes con el diseño

**Archivos a revisar:**
- `front-edromo/src/app/admin/dromopuntos/page.js`
- `front-edromo/src/components/admin-dromopuntos/` (componentes relacionados)

**Problemas actuales:**
```javascript
alert("Configuración guardada exitosamente"); // ❌ Poco profesional
confirm("¿Está seguro de guardar los cambios?"); // ❌ Diseño nativo del browser
```

**Solución propuesta:**
- Usar librería de toasts (react-hot-toast, sonner, etc.)
- Modal de confirmación personalizado
- Feedback visual consistente (loading, success, error)

**Componentes a crear:**
```javascript
// Toast de éxito
<Toast type="success">Configuración guardada exitosamente</Toast>

// Modal de confirmación
<ConfirmModal 
  title="Confirmar cambios"
  message="¿Está seguro de actualizar la configuración?"
  onConfirm={handleSave}
  onCancel={closeModal}
/>
```

**Testing requerido:**
- [ ] Toast se muestra al guardar
- [ ] Modal de confirmación funciona
- [ ] Animaciones son suaves
- [ ] Diseño consistente con el sistema

---

### 🟡 BUG #13: Recuperar Contraseña - Tiempo No Configurable
**Prioridad:** Media  
**Estado:** ✅ **RESUELTO**  
**Ambiente:** Producción
**Fecha resolución:** 28 de Noviembre, 2025

**Descripción:**
- El tiempo de expiración del token de recuperación está hardcodeado
- Debería ser configurable desde la tabla `configuracion`
- Actualmente probablemente 24 horas o similar

**Archivos a revisar:**
- Backend: `EventodromoRest/Servicios/EmailService.cs` o `TokenService.cs`
- Backend: `EventodromoRest/Mappers/DromopuntosMapper.cs` (para config)
- Base de datos: Tabla `configuracion`

**Solución implementada:**
```sql
-- Migración ejecutada: add_minutos_expiracion_recovery.sql
ALTER TABLE configuracion 
ADD COLUMN minutos_expiracion_recovery INT NOT NULL DEFAULT 60 
COMMENT 'Tiempo de expiración del token de recuperación de contraseña en minutos';
```

```csharp
// DromopuntosMapper.cs - Línea 226
public int ObtenerMinutosExpiracionRecovery()
{
    string query = "SELECT minutos_expiracion_recovery FROM configuracion WHERE id = 1";
    var resultado = DB.ExecuteScalar(query, new ParameterList());
    return resultado != null ? Convert.ToInt32(resultado) : 60; // Fallback a 60 minutos
}

// ClienteController.cs - Línea 642
var dromopuntosMapper = new DromopuntosMapper(globales, DB);
int minutosExpiracion = dromopuntosMapper.ObtenerMinutosExpiracionRecovery();
DateTime fechaExpiracion = DateTime.Now.AddMinutes(minutosExpiracion);

// Email con tiempo formateado inteligentemente
string tiempoExpiracion = FormatearTiempoExpiracion(minutosExpiracion);
// Ejemplos: "30 minutos", "1 hora", "1 hora y 30 minutos", "2 horas"
```

**UI Admin implementada:**
- ✅ Nuevo campo en página de configuraciones admin
- ✅ Label: "Expiración Token Recuperación (en minutos)"
- ✅ Valor por defecto: 60 minutos
- ✅ Validación: Debe ser número entero mayor a 0
- ✅ Descripción: "Tiempo en minutos que el token de recuperación de contraseña permanece válido"

**Testing completado:**
- [x] Configuración se guarda correctamente en BD
- [x] Token usa tiempo configurado dinámicamente
- [x] Email muestra tiempo formateado correctamente
- [x] Cambios aplican inmediatamente en nuevas recuperaciones
- [x] Frontend permite configurar desde UI de admin

---

## 🎯 Plan de Resolución Priorizado

### ✅ RESUELTOS (11 de 13 bugs - 85% completado)
1. ✅ **BUG #1** - Código de descuento no está fijo + Tabla compacta
2. ✅ **BUG #2** - CompraPagoConLogin parpadea
3. ✅ **BUG #3** - Filtros de eventos no funcionan
4. ✅ **BUG #4** - Auditoría de sesiones (Login + fechaUltimaSesion)
5. ✅ **BUG #5** - Se pueden comprar eventos pasados
6. ✅ **BUG #6** - Se pueden transferir entradas vencidas
7. ✅ **BUG #7** - URLs localhost en emails de transferencia
8. ✅ **BUG #8** - Se pueden descargar entradas pendientes
9. ✅ **BUG #10** - Recuperar contraseña solo funciona en localhost
10. ✅ **BUG #11** - Crear más administradores
11. ✅ **BUG #13** - Tiempo recuperación configurable

### 🟡 BAJO - Pendientes (2 bugs)
1. **BUG #9** - Optimización información personal
2. **BUG #12** - Reemplazar alerts por toasts

---

## 📊 Estadísticas Actualizadas

**Progreso General:**
- ✅ Resueltos: **11 bugs (85%)**
- 🟡 Pendientes: **2 bugs (15%)**

**Por Prioridad:**
- 🔴 Crítica: 4/4 resueltos (100%) ✅
- 🟡 Media: 5/5 resueltos (100%) ✅
- 🟢 Baja: 2/4 resueltos (50%) ⏳

**Por Categoría:**
- 🛡️ Seguridad/Lógica: 5/5 resueltos (100%)
- 🎨 UI/UX: 4/6 resueltos (67%)
- ⚙️ Configuración: 2/2 resueltos (100%)

---

## 🚀 Siguiente Fase de Trabajo

### 🎯 Inmediato
1. ✅ **COMPLETADO** - BUG #4: Auditoría de sesiones
   - ✅ Script SQL ejecutado
   - ✅ Código backend desplegado
   - ✅ Testing realizado

### 📋 Próximo Sprint
1. **BUG #9** - Performance información personal
   - Analizar queries lentas
   - Implementar optimizaciones
   - Testing de carga
   
2. **BUG #12** - Sistema de toasts moderno
   - Instalar react-hot-toast o sonner
   - Crear componente Toast reutilizable
   - Migrar todos los alerts
   - Testing de UX

### 🟢 BAJO - Backlog (Optimizaciones)
12. **BUG #9** - Performance de información personal
13. **BUG #12** - Mejorar mensajes de confirmación admin

---

## 📊 Métricas de Progreso

### Por Resolver
- 🚨 Crítico: 0 bugs
- 🔴 Alto: 0 bugs
- 🟡 Medio: 1 bug (BUG #4)
- 🟢 Bajo: 2 bugs (BUG #9, BUG #12)
- **TOTAL: 3 issues pendientes**

### Resuelto
- ✅ Completado: 10 bugs (BUG #1, #2, #3, #5, #6, #7, #8, #10, #11, #13)
- ⏳ En progreso: 0 bugs
- 🔍 En análisis: 3 bugs

---

## 🔧 Próximos Pasos Inmediatos

### Fase 1: Análisis Técnico (Hoy)
- [ ] Reproducir BUG #2 en local
- [ ] Identificar causa del parpadeo
- [ ] Revisar todas las URLs hardcodeadas en backend
- [ ] Crear branch: `fix/deploy-critical-bugs`

### Fase 2: Fixes Críticos (Día 1-2)
- [ ] Fix BUG #2: CompraPagoConLogin
- [ ] Fix BUG #5: Validar fechas de eventos
- [ ] Fix BUG #7: URLs dinámicas en emails
- [ ] Fix BUG #10: Recuperar contraseña

### Fase 3: Fixes Altos (Día 3-4)
- [ ] Fix BUG #3: Filtros de eventos
- [ ] Fix BUG #6: Validar transferencias
- [ ] Fix BUG #8: Descargas de entradas

### Fase 4: Testing en Deploy (Día 5)
- [ ] Deploy de fixes críticos y altos
- [ ] Testing exhaustivo en producción
- [ ] Validar que todos los emails funcionen correctamente

### Fase 5: Backlog (Sprint Siguiente)
- [ ] Implementar gestión de admins
- [ ] Optimizar queries lentas
- [ ] Mejorar UX de confirmaciones

---

## 📝 Configuraciones Necesarias en Servidor

### Variables de Entorno Requeridas
```bash
# .env o appsettings.Production.json
FRONTEND_URL=http://34.238.85.28:3000
BACKEND_URL=http://34.238.85.28:5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@eventodromo.com
SMTP_PASSWORD=************
```

### Base de Datos
```sql
-- Agregar columna si no existe
ALTER TABLE configuracion 
ADD COLUMN IF NOT EXISTS horas_expiracion_recuperacion INT DEFAULT 24;

-- Configurar tiempo de recuperación
UPDATE configuracion 
SET horas_expiracion_recuperacion = 24 
WHERE id = 1;
```

---

## ⚠️ NOTA IMPORTANTE

**BUG #2 (CompraPagoConLogin)** es el más crítico ya que bloquea completamente las compras. 

**Posible solución rápida temporal:**
- Comentar la llamada a `refreshUserPoints()` en el useEffect
- Validar si se estabiliza la página
- Implementar solución correcta con useCallback

---

**Última actualización:** 2025-11-28  
**Próxima revisión:** Después de resolver bugs críticos
