# 🐛 Bug Tracking - Sistema Desplegado EventoDromo

**Fecha de inicio:** 28 de Noviembre, 2025  
**Rama:** main-iteracion4  
**Ambiente:** Producción (http://34.238.85.28:3000/)  
**Responsable:** Equipo de desarrollo

---

## 📋 Lista de Bugs Identificados en Deploy

### 🔴 BUG #1: Código de Descuento - No Está Fijo
**Prioridad:** Media  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- El componente del código de descuento debe permanecer fijo en la pantalla
- Actualmente se desplaza con el scroll
- Debería estar visible siempre como el resumen de compra

**Archivos a revisar:**
- `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js`
- `front-edromo/src/components/carrito/CodigoDescuento.jsx` (si existe)
- `front-edromo/src/css/compraPagoConLogin.module.css`

**Posible causa:**
- Falta `position: sticky` o `position: fixed` en el CSS
- Estructura de layout no permite elemento fijo

**Solución propuesta:**
- Aplicar `position: sticky` con `top: 0`
- O incluir en el mismo contenedor fixed que el resumen de compra

**Testing requerido:**
- [ ] Verificar posición fija en desktop
- [ ] Verificar comportamiento en móvil
- [ ] No debe ocultar otros elementos importantes

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
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Los filtros por estado de eventos no funcionan correctamente
- Estados esperados: Próximos, En curso, Finalizados
- Los filtros no aplican correctamente o no muestran resultados

**Archivos a revisar:**
- `front-edromo/src/app/user/web/eventos/lista/page.js`
- `front-edromo/src/services/Evento.service.js`
- Backend: `EventodromoRest/Controllers/EventoController.cs`
- Backend: `EventodromoRest/Mappers/EventoMapper.cs`

**Posible causa:**
1. Query SQL no filtra correctamente por fechas
2. Frontend no envía parámetros correctos al backend
3. Comparación de fechas incorrecta (timezone issues)
4. Estados hardcodeados vs calculados dinámicamente

**Solución propuesta:**
- Verificar query SQL que filtra eventos
- Asegurar que fechas se comparen en UTC
- Validar parámetros enviados desde frontend

**Testing requerido:**
- [ ] Filtro "Próximos" muestra solo eventos futuros
- [ ] Filtro "En curso" muestra eventos del día actual
- [ ] Filtro "Finalizados" muestra eventos pasados
- [ ] Filtro "Todos" muestra todos los eventos

---

### 🟡 BUG #4: Auditoría - Última Sesión No Se Registra
**Prioridad:** Media  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- La última sesión de usuario no se está auditando correctamente
- Debería registrar: Login, Logout, Acciones importantes
- Tabla: `Auditoria` (campo `idTipoAuditoria`)

**Archivos a revisar:**
- Backend: `EventodromoRest/Controllers/BaseController.cs`
- Backend: `EventodromoRest/Mappers/AuditoriaMapper.cs`
- Backend: `EventodromoRest/Controllers/ClienteController.cs` (Login/Logout)

**Tipos de auditoría esperados:**
- ID 1: Compra de entradas
- ID 2: Login
- ID 3: Logout
- ID 4: Uso de puntos
- ID 5: Transferencia de entradas
- Otros según tabla `TipoAuditoria`

**Posible causa:**
- Middleware de auditoría no se ejecuta en todas las rutas
- Logout no llama al endpoint correcto
- Token expirado no se audita

**Solución propuesta:**
- Revisar que todos los endpoints importantes auditen
- Agregar auditoría en logout del frontend
- Validar que tabla `Auditoria` recibe inserts

**Testing requerido:**
- [ ] Login se registra en auditoría
- [ ] Logout se registra en auditoría
- [ ] Compras se registran
- [ ] Transferencias se registran

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
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Se pueden transferir entradas de eventos que ya pasaron
- No tiene sentido transferir entrada de un evento finalizado
- Validación de fecha falta en transferencias

**Archivos a revisar:**
- Backend: `EventodromoRest/Controllers/TransaccionController.cs`
- Backend: `EventodromoRest/Mappers/TransferirEntradasMapper.cs`
- Backend: `EventodromoRest/Negocio/TransaccionBO.cs`
- Frontend: `front-edromo/src/app/transferir/page.js`

**Reglas de negocio esperadas:**
1. Solo se pueden transferir entradas de eventos futuros
2. Validar `FechaEvento.fechaHora > NOW()` antes de permitir transferencia
3. Frontend debe deshabilitar opción de transferir si evento pasó

**Solución propuesta:**
- Agregar validación en `TransferirEntradas` del backend
- Filtrar entradas transferibles por fecha en frontend
- Mostrar mensaje claro: "No se pueden transferir entradas de eventos pasados"

**Testing requerido:**
- [ ] No se pueden transferir entradas vencidas
- [ ] UI deshabilita opción para eventos pasados
- [ ] Backend rechaza transferencia con error claro
- [ ] Entradas futuras SÍ se pueden transferir normalmente

---

### 🔴 BUG #7: Email Transferencia - URL Localhost en Deploy
**Prioridad:** 🚨 **CRÍTICA**  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Correos de transferencia (aceptar/rechazar) envían links a `localhost:3000`
- Debería enviar a: `http://34.238.85.28:3000/`
- Los usuarios no pueden aceptar/rechazar transferencias desde el correo

**Archivos a revisar:**
- Backend: `EventodromoRest/Servicios/EmailService.cs`
- Backend: `EventodromoRest/assets/hbsTemplates/confirmacion-transferencia.hbs`
- Backend: `EventodromoRest/appsettings.json` o `appsettings.Production.json`

**Código sospechoso:**
```csharp
// Probablemente en EmailService.cs
var acceptUrl = $"http://localhost:3000/transferir/aceptar?token={token}"; // ❌ HARDCODED
var rejectUrl = $"http://localhost:3000/transferir/rechazar?token={token}"; // ❌ HARDCODED
```

**Solución propuesta:**
```csharp
// appsettings.json
{
  "AppSettings": {
    "FrontendUrl": "http://34.238.85.28:3000"
  }
}

// EmailService.cs
var frontendUrl = _configuration["AppSettings:FrontendUrl"];
var acceptUrl = $"{frontendUrl}/transferir/aceptar?token={token}"; // ✅ DINÁMICO
```

**Testing requerido:**
- [ ] Email de transferencia contiene URL correcta en desarrollo
- [ ] Email de transferencia contiene URL correcta en producción
- [ ] Links de aceptar/rechazar funcionan correctamente
- [ ] Variables de entorno configuradas en servidor

---

### 🟡 BUG #8: Entrada Pendiente - Se Puede Descargar
**Prioridad:** Media  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Se puede descargar PDF de entrada con estado "Pendiente" (transferencia no aceptada)
- Solo se debería poder descargar entradas confirmadas o propias
- Estados: `null` (propia), `pendiente`, `aceptada`, `rechazada`

**Archivos a revisar:**
- Backend: `EventodromoRest/Mappers/EntradaMapper.cs`
- Frontend: `front-edromo/src/components/Layouts/perfil/mis-entradas.jsx`
- Frontend: `front-edromo/src/services/PDFGenerator.service.js`

**Reglas de negocio esperadas:**
1. **Entradas propias** (sin transferencia): Siempre descargables
2. **Entradas pendientes**: NO descargables (transferencia no confirmada)
3. **Entradas aceptadas**: Descargables por nuevo dueño
4. **Entradas rechazadas**: Descargables por dueño original

**Solución propuesta:**
```javascript
// Frontend - mis-entradas.jsx
const puedeDescargar = (entrada) => {
  return entrada.estadoTransferencia === null || 
         entrada.estadoTransferencia === 'aceptada';
};
```

**Testing requerido:**
- [ ] No se puede descargar entrada pendiente
- [ ] Se puede descargar entrada propia
- [ ] Se puede descargar entrada aceptada
- [ ] Botón descargar está deshabilitado para pendientes

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
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Función de recuperar contraseña solo funciona en localhost
- Debería ser un **botón**, no una URL directa
- Actualmente podría estar hardcodeado a `http://localhost:3000`

**Archivos a reviewer:**
- Backend: `EventodromoRest/Servicios/EmailService.cs`
- Backend: `EventodromoRest/Controllers/ClienteController.cs` (endpoint recuperar)
- Backend: `EventodromoRest/assets/hbsTemplates/recuperar-password.hbs`
- Frontend: `front-edromo/src/components/ForgotPasswordModal/`

**Problema similar a BUG #7:**
- URL hardcodeada en lugar de usar variable de configuración
- Template de email con localhost

**Solución propuesta:**
```csharp
// Mismo patrón que BUG #7
var resetUrl = $"{_configuration["AppSettings:FrontendUrl"]}/auth/reset-password?token={token}";
```

**UI Mejorada:**
- Modal con formulario de email
- Botón "Enviar link de recuperación"
- Mensaje de confirmación claro
- Manejo de errores visible

**Testing requerido:**
- [ ] Email de recuperación contiene URL correcta
- [ ] Link funciona en producción
- [ ] UI del modal es clara y funcional
- [ ] Mensajes de error son comprensibles

---

### 🟢 BUG #11: Admin - Crear Más Administradores (Feature Request)
**Prioridad:** Media  
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- Actualmente no existe funcionalidad para crear nuevos administradores
- Solo existe el admin inicial de la migración
- Se necesita UI y backend para gestión de admins

**Archivos a crear/modificar:**
- Frontend: `front-edromo/src/app/admin/usuarios/` (nueva página)
- Backend: `EventodromoRest/Controllers/AdministradorController.cs`
- Backend: `EventodromoRest/Mappers/AdministradorMapper.cs`

**Funcionalidades requeridas:**
1. **Listar admins:** Tabla con admins actuales
2. **Crear admin:** Formulario (email, nombre, password temporal)
3. **Desactivar admin:** No eliminar, solo deshabilitar
4. **Rol validation:** Solo admins pueden crear admins
5. **Email notificación:** Enviar credenciales al nuevo admin

**Reglas de negocio:**
- Validar email único
- Password temporal debe cambiarse en primer login
- No se puede eliminar el último admin
- Auditar creación de admins

**Testing requerido:**
- [ ] Admin puede ver lista de admins
- [ ] Admin puede crear nuevo admin
- [ ] Admin puede desactivar otro admin
- [ ] No puede desactivarse a sí mismo si es el último
- [ ] Email de bienvenida se envía correctamente

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
**Estado:** 🔍 **PENDIENTE ANÁLISIS**  
**Ambiente:** Producción

**Descripción:**
- El tiempo de expiración del token de recuperación está hardcodeado
- Debería ser configurable desde la tabla `configuracion`
- Actualmente probablemente 24 horas o similar

**Archivos a revisar:**
- Backend: `EventodromoRest/Servicios/EmailService.cs` o `TokenService.cs`
- Backend: `EventodromoRest/Mappers/DromopuntosMapper.cs` (para config)
- Base de datos: Tabla `configuracion`

**Implementación actual (probable):**
```csharp
var tokenExpiration = DateTime.UtcNow.AddHours(24); // ❌ HARDCODED
```

**Solución propuesta:**
```sql
-- Migración: Agregar columna a tabla configuracion
ALTER TABLE configuracion 
ADD COLUMN horas_expiracion_recuperacion INT DEFAULT 24;
```

```csharp
// Código dinámico
var dromopuntosMapper = new DromopuntosMapper(globales, DB);
var horasExpiracion = dromopuntosMapper.ObtenerHorasExpiracionRecuperacion();
var tokenExpiration = DateTime.UtcNow.AddHours(horasExpiracion);
```

**UI Admin (página configuraciones):**
- Agregar campo: "Tiempo de expiración link recuperación (horas)"
- Valor por defecto: 24 horas
- Validación: Mínimo 1 hora, máximo 168 horas (7 días)

**Testing requerido:**
- [ ] Configuración se guarda correctamente
- [ ] Token expira después del tiempo configurado
- [ ] Token NO expira antes del tiempo configurado
- [ ] Cambios en configuración aplican inmediatamente

---

## 🎯 Plan de Resolución Priorizado

### 🚨 CRÍTICO - Resolver Primero (Bloquean funcionalidad)
1. **BUG #2** - CompraPagoConLogin parpadea (no se puede comprar) 🔥
2. **BUG #5** - Se pueden comprar eventos pasados 🔥
3. **BUG #7** - URLs localhost en emails de transferencia 🔥
4. **BUG #10** - Recuperar contraseña solo funciona en localhost 🔥

### 🔴 ALTO - Resolver en Sprint Actual (Afectan UX/Seguridad)
5. **BUG #3** - Filtros de eventos no funcionan
6. **BUG #6** - Se pueden transferir entradas vencidas
7. **BUG #8** - Se pueden descargar entradas pendientes

### 🟡 MEDIO - Resolver en Siguiente Sprint (Mejoras importantes)
8. **BUG #1** - Código de descuento no está fijo
9. **BUG #4** - Auditoría de sesiones
10. **BUG #11** - Crear más administradores (feature)
11. **BUG #13** - Tiempo recuperación configurable

### 🟢 BAJO - Backlog (Optimizaciones)
12. **BUG #9** - Performance de información personal
13. **BUG #12** - Mejorar mensajes de confirmación admin

---

## 📊 Métricas de Progreso

### Por Resolver
- 🚨 Crítico: 2 bugs (BUG #7, BUG #10)
- 🔴 Alto: 3 bugs (BUG #3, BUG #6, BUG #8)
- 🟡 Medio: 4 bugs (BUG #1, BUG #4, BUG #11, BUG #13)
- 🟢 Bajo: 2 bugs (BUG #9, BUG #12)
- **TOTAL: 11 issues pendientes**

### Resuelto
- ✅ Completado: 2 bugs (BUG #2, BUG #5)
- ⏳ En progreso: 0 bugs
- 🔍 En análisis: 11 bugs

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
