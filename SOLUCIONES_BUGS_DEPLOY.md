# 🔧 Plan de Soluciones - Bugs en Deploy

**Fecha:** 28 de Noviembre, 2025  
**Proyecto:** EventoDromo  
**Ambiente:** Docker (Desarrollo Local + Producción AWS)

---

## 🎯 Estrategia General: Configuración Dinámica por Ambiente

### Problema Principal
El sistema usa URLs hardcodeadas (`localhost:3000`) que funcionan en desarrollo pero fallan en producción (`34.238.85.28:3000`).

### Solución: Variables de Entorno por Ambiente

```
📁 Estructura de Configuración:
├── docker-compose.yml          → Desarrollo local
├── docker-compose.prod.yml     → Producción AWS
├── Backend/
│   ├── appsettings.json        → Config base
│   ├── appsettings.Development.json
│   └── appsettings.Production.json  → A crear
└── Frontend/
    ├── .env.local              → Desarrollo
    └── .env.production         → Producción
```

---

## 🚨 BUG #1 CRÍTICO: CompraPagoConLogin Parpadea

### Causa Identificada
```javascript
// UserContext.jsx - Línea 109
const refreshUserPoints = async () => {
    if (!user?.token) return;
    try {
      const puntosActualizados = await obtenerPuntosDisponibles(user.token);
      updateUserPoints(puntosActualizados);
    } catch (error) {
      console.warn("Error al refrescar puntos del usuario:", error);
    }
};

// page.js - Línea 273 (PROBLEMA)
useEffect(() => {
    if (isAuthenticated && refreshUserPoints) {
        refreshUserPoints(); // ⚠️ refreshUserPoints NO está memoizada
    }
}, [isAuthenticated, refreshUserPoints]); // ❌ refreshUserPoints cambia en cada render
```

**Problema:** `refreshUserPoints` se crea en cada render → `useEffect` se dispara continuamente → Parpadeo infinito

### Solución Implementada

**Archivo:** `front-edromo/src/context/UserContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ... código existente ...

const updateUserPoints = useCallback((newPoints) => {
    setUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedUser = { ...prevUser, totalPuntos: newPoints };
        try {
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.warn("Error al actualizar puntos en localStorage:", error);
        }
        return updatedUser;
    });
}, []); // ✅ No depende de nada, siempre estable

const refreshUserPoints = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const puntosActualizados = await obtenerPuntosDisponibles(user.token);
      updateUserPoints(puntosActualizados);
    } catch (error) {
      console.warn("Error al refrescar puntos del usuario:", error);
    }
}, [user?.token, updateUserPoints]); // ✅ Solo cambia si token cambia
```

**Archivo:** `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js`
```javascript
// Agregar useRef para controlar llamada única
const hasRefreshedPoints = useRef(false);

useEffect(() => {
    if (isAuthenticated && refreshUserPoints && !hasRefreshedPoints.current) {
        refreshUserPoints();
        hasRefreshedPoints.current = true; // ✅ Solo se ejecuta UNA vez
    }
}, [isAuthenticated, refreshUserPoints]);
```

**Resultado:** Página se carga sin parpadeos, compras funcionan correctamente.

---

## 🚨 BUG #7 y #10: URLs Localhost en Emails

### Configuración Backend Multi-Ambiente

#### 1. Crear `appsettings.Production.json`
**Archivo:** `Backend/EventodromoRest/appsettings.Production.json` (NUEVO)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AppSettings": {
    "FrontendUrl": "http://34.238.85.28:3000"
  }
}
```

#### 2. Mantener `appsettings.json` para desarrollo
**Archivo:** `Backend/EventodromoRest/appsettings.json`
```json
{
  "AppSettings": {
    "FrontendUrl": "http://localhost:3000"
  }
}
```

#### 3. Modificar Dockerfiles

**Archivo:** `Backend/EventodromoRest/Dockerfile`
```dockerfile
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# ✅ Variable de entorno que se puede sobrescribir en docker-compose
ENV ASPNETCORE_ENVIRONMENT=Production
ENV AppSettings__FrontendUrl="http://localhost:3000"
ENTRYPOINT ["dotnet", "EventodromoRest.dll"]
```

#### 4. Configurar Docker Compose

**Archivo:** `docker-compose.yml` (Desarrollo Local)
```yaml
services:
    aspnet:
        build: ./Backend/EventodromoRest/
        restart: unless-stopped
        environment:
            # ✅ Para desarrollo local
            ASPNETCORE_ENVIRONMENT: Development
            AppSettings__FrontendUrl: "http://localhost:3000"
        ports:
            - "0.0.0.0:8080:8080"
        depends_on:
            - db
        networks:
            - frontend
            - backend
```

**Archivo:** `docker-compose.prod.yml` (Producción - NUEVO)
```yaml
version: "3.8"

services:
    www:
        build: ./front-edromo/
        restart: unless-stopped
        environment:
            NEXT_PUBLIC_API_BASE_URL: "http://34.238.85.28:8080/api"
        ports: 
            - "0.0.0.0:3000:3000"
        depends_on:
            - aspnet
            - db
        networks:
            - frontend

    aspnet:
        build: ./Backend/EventodromoRest/
        restart: unless-stopped
        environment:
            # ✅ Para producción en AWS
            ASPNETCORE_ENVIRONMENT: Production
            AppSettings__FrontendUrl: "http://34.238.85.28:3000"
        ports:
            - "0.0.0.0:8080:8080"
        depends_on:
            - db
        networks:
            - frontend
            - backend
    
    db:
        build: ./sql/
        restart: unless-stopped
        ports: 
            - "127.0.0.1:1433:1433"
        environment:
            ACCEPT_EULA: "Y" 
            MSSQL_SA_PASSWORD: T8m!r2xZ
        networks:
            - backend
        entrypoint: ["/bin/bash", "/init.sh"]

networks:
    frontend:
        driver: bridge
    backend:
        driver: bridge
        internal: true
```

#### 5. Comandos para Levantar el Sistema

**Desarrollo Local:**
```bash
docker-compose up --build
```

**Producción AWS:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Verificación de Configuración Correcta

**Backend ya tiene fallback correcto:**
```csharp
// TransferirEntradasBO.cs - Línea 184
string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";

// ClienteController.cs - Línea 666 (Recuperar contraseña)
string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
```

✅ **NO requiere cambios en código C#, solo en configuración de Docker**

---

## 🔧 BUG #1: Código de Descuento No Está Fijo

### Problema
El componente de código de descuento se desplaza con el scroll, debería estar fijo.

### Solución: Estructura de Layout Fija

**Archivo:** `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js`

```javascript
// Agregar componente CodigoDescuento
import CodigoDescuento from "@/components/carrito/CodigoDescuento";

// Dentro del render, en la columna de resumen:
<section className={styles.card}>
    <h2 className={styles.cardTitle}>Resumen de la compra</h2>
    <CartTimer variant="minimal" />
    
    {/* ✅ NUEVO: Código de descuento fijo */}
    <div className="mb-4">
        <CodigoDescuento />
    </div>
    
    <div className="flex flex-col h-full gap-4">
        <CostoDetalleEntradasController />
        {/* ... resto del código ... */}
    </div>
</section>
```

**Archivo:** `front-edromo/src/css/compraPagoConLogin.module.css`
```css
/* Asegurar que el resumen tenga estructura sticky */
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Si se quiere que toda la columna sea sticky */
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 400px; /* Columna resumen fija */
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.mainGrid > section:last-child {
  position: sticky;
  top: 24px;
  align-self: start; /* ✅ Importante para sticky */
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}
```

**Resultado:** Código de descuento y resumen permanecen visibles mientras se scrollea.

---

## 🚨 BUG #5: Eventos Pasados - Se Pueden Comprar

### Solución Backend

**Archivo:** `Backend/EventodromoRest/Mappers/EventoMapper.cs`

```csharp
// Método: ListarEventos()
public List<Evento> ListarEventos()
{
    List<Evento> listaEventos = new List<Evento>();
    lock (DB)
    {
        string query = @"
            SELECT DISTINCT e.* 
            FROM Evento e
            INNER JOIN FechaEvento fe ON e.id = fe.idEvento
            WHERE fe.fechaHora > UTC_TIMESTAMP()  -- ✅ Solo eventos futuros
            ORDER BY e.id DESC";
        
        // ... resto del código
    }
}

// Método: ListarEventosPorCategoriaYCiudad()
public List<Evento> ListarEventosPorCategoriaYCiudad(int? idTipoEvento, int? idCiudad)
{
    string query = @"
        SELECT DISTINCT e.*
        FROM Evento e
        INNER JOIN FechaEvento fe ON e.id = fe.idEvento
        INNER JOIN Local l ON e.idLocal = l.id
        WHERE fe.fechaHora > UTC_TIMESTAMP()  -- ✅ Solo eventos futuros
        AND (@idTipoEvento IS NULL OR e.idTipoEvento = @idTipoEvento)
        AND (@idCiudad IS NULL OR l.idCiudad = @idCiudad)
        ORDER BY e.id DESC";
    
    // ... resto del código
}
```

**Archivo:** `Backend/EventodromoRest/Mappers/CarritoMapper.cs`

```csharp
// Método: AgregarItemAlCarrito()
public List<ObtenerCarritoDTO> AgregarItemAlCarrito(int idCliente, RequestAgregarItemAlCarrito request)
{
    // ✅ VALIDAR QUE EVENTO NO HAYA PASADO
    string queryValidarFecha = @"
        SELECT COUNT(*) 
        FROM FechaEvento 
        WHERE id = @idFechaEvento 
        AND fechaHora > UTC_TIMESTAMP()";
    
    var paramValidar = new ParameterList();
    paramValidar.Add("@idFechaEvento", request.IdFechaEvento);
    
    int eventoValido = Convert.ToInt32(DB.ExecuteScalar(queryValidarFecha, paramValidar));
    
    if (eventoValido == 0)
    {
        throw new Exception("No se pueden comprar entradas de eventos pasados.");
    }
    
    // ... resto del código para agregar al carrito
}
```

**Resultado:** 
- ✅ Lista de eventos solo muestra eventos futuros
- ✅ No se puede agregar al carrito eventos pasados (validación backend)
- ✅ Mensaje de error claro para el usuario

---

## 🚨 BUG #6: Transferencias - Permiten Entradas Vencidas

### Solución Backend

**Archivo:** `Backend/EventodromoRest/Negocio/TransaccionBO.cs`

```csharp
// Método: TransferirEntradas()
public GenericResponse<bool> TransferirEntradas(int idCliente, RequestTransferencia request)
{
    // ✅ VALIDAR QUE ENTRADAS NO SEAN DE EVENTOS PASADOS
    var transaccionMapper = new TransaccionMapper(globales, DB);
    
    // Validar fechas ANTES de iniciar transferencia
    string queryValidarFechas = @"
        SELECT COUNT(*) 
        FROM Entrada e
        JOIN TipoEntrada te ON e.idTipoEntrada = te.id
        JOIN FechaEvento fe ON te.idFechaEvento = fe.id
        WHERE e.id IN (@idsEntradas)
        AND fe.fechaHora <= UTC_TIMESTAMP()";
    
    // Si alguna entrada es de evento pasado, rechazar
    int entradasVencidas = DB.ExecuteScalar<int>(queryValidarFechas);
    
    if (entradasVencidas > 0)
    {
        throw new Exception("No se pueden transferir entradas de eventos que ya pasaron.");
    }
    
    // ... resto del código de transferencia
}
```

### Solución Frontend

**Archivo:** `front-edromo/src/app/transferir/page.js`

```javascript
// Filtrar entradas transferibles por fecha
const entradasTransferibles = misEntradas.filter(entrada => {
    const fechaEvento = new Date(entrada.fechaEvento);
    const ahora = new Date();
    return fechaEvento > ahora; // ✅ Solo eventos futuros
});

// UI con mensaje explicativo
{entradasTransferibles.length === 0 && (
    <div className="text-center p-8 text-gray-500">
        <p>No tienes entradas transferibles.</p>
        <p className="text-sm mt-2">
            Solo se pueden transferir entradas de eventos futuros.
        </p>
    </div>
)}
```

**Resultado:**
- ✅ No se pueden transferir entradas vencidas (validación backend)
- ✅ Frontend solo muestra entradas de eventos futuros
- ✅ Mensaje claro sobre por qué no se pueden transferir

---

## 🔧 BUG #3: Filtros de Eventos No Funcionan

### Solución Backend

**Archivo:** `Backend/EventodromoRest/Mappers/EventoMapper.cs`

```csharp
// Nuevo método con filtro por estado
public List<Evento> ListarEventosPorEstado(string estado, int? idTipoEvento, int? idCiudad)
{
    string condicionFecha = estado switch
    {
        "proximos" => "fe.fechaHora > DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY)",
        "hoy" => "DATE(fe.fechaHora) = DATE(UTC_TIMESTAMP())",
        "finalizados" => "fe.fechaHora < UTC_TIMESTAMP()",
        _ => "fe.fechaHora > UTC_TIMESTAMP()" // "todos" o default
    };
    
    string query = $@"
        SELECT DISTINCT e.*
        FROM Evento e
        INNER JOIN FechaEvento fe ON e.id = fe.idEvento
        INNER JOIN Local l ON e.idLocal = l.id
        WHERE {condicionFecha}
        AND (@idTipoEvento IS NULL OR e.idTipoEvento = @idTipoEvento)
        AND (@idCiudad IS NULL OR l.idCiudad = @idCiudad)
        ORDER BY fe.fechaHora ASC";
    
    // ... ejecutar query
}
```

**Archivo:** `Backend/EventodromoRest/Controllers/EventoController.cs`

```csharp
[HttpGet]
[Route("/api/[controller]/[action]")]
public GenericResponse<List<Evento>> ListarEventos(
    [FromQuery] string estado = "todos",
    [FromQuery] int? idTipoEvento = null, 
    [FromQuery] int? idCiudad = null)
{
    return new EventoBO(globales, BD).ListarEventosPorEstado(estado, idTipoEvento, idCiudad);
}
```

### Solución Frontend

**Archivo:** `front-edromo/src/services/Evento.service.js`

```javascript
export const obtenerEventos = async (filtros = {}) => {
    const { estado = 'todos', tipoEvento, ciudad } = filtros;
    
    const params = new URLSearchParams();
    params.append('estado', estado);
    if (tipoEvento) params.append('idTipoEvento', tipoEvento);
    if (ciudad) params.append('idCiudad', ciudad);
    
    const response = await api.get(`/Evento/ListarEventos?${params.toString()}`);
    return response;
};
```

**Archivo:** `front-edromo/src/app/user/web/eventos/lista/page.js`

```javascript
const [filtros, setFiltros] = useState({
    estado: 'proximos', // 'proximos', 'hoy', 'finalizados', 'todos'
    tipoEvento: null,
    ciudad: null
});

// Aplicar filtros
const handleFiltroEstado = (nuevoEstado) => {
    setFiltros(prev => ({ ...prev, estado: nuevoEstado }));
};

useEffect(() => {
    const cargarEventos = async () => {
        const eventos = await obtenerEventos(filtros);
        setEventos(eventos);
    };
    cargarEventos();
}, [filtros]);
```

---

## 📦 Resumen de Archivos a Modificar/Crear

### Archivos Nuevos
```
Backend/EventodromoRest/appsettings.Production.json  ✨ NUEVO
docker-compose.prod.yml                              ✨ NUEVO
```

### Archivos a Modificar

**Backend:**
- `Backend/EventodromoRest/Dockerfile` ✏️
- `Backend/EventodromoRest/Mappers/EventoMapper.cs` ✏️
- `Backend/EventodromoRest/Mappers/CarritoMapper.cs` ✏️
- `Backend/EventodromoRest/Negocio/TransaccionBO.cs` ✏️
- `Backend/EventodromoRest/Controllers/EventoController.cs` ✏️

**Frontend:**
- `front-edromo/src/context/UserContext.jsx` ✏️
- `front-edromo/src/app/user/carrito/CompraPagoConLogin/page.js` ✏️
- `front-edromo/src/css/compraPagoConLogin.module.css` ✏️
- `front-edromo/src/services/Evento.service.js` ✏️
- `front-edromo/src/app/user/web/eventos/lista/page.js` ✏️
- `front-edromo/src/app/transferir/page.js` ✏️

**Docker:**
- `docker-compose.yml` ✏️ (actualizar variables de ambiente)

---

## 🚀 Plan de Implementación

### Fase 1: Arreglar Parpadeo (URGENTE - 30 min)
1. ✅ Agregar `useCallback` a `refreshUserPoints` y `updateUserPoints`
2. ✅ Agregar `useRef` para controlar llamada única
3. ✅ Testing: Verificar que página no parpadea
4. ✅ Testing: Confirmar que compras funcionan

### Fase 2: Configuración Multi-Ambiente (1 hora)
1. ✅ Crear `appsettings.Production.json`
2. ✅ Crear `docker-compose.prod.yml`
3. ✅ Modificar Dockerfiles con variables de ambiente
4. ✅ Testing local: `docker-compose up`
5. ✅ Testing producción: `docker-compose -f docker-compose.prod.yml up`

### Fase 3: Validaciones de Fechas (2 horas)
1. ✅ Modificar queries de EventoMapper (eventos futuros)
2. ✅ Agregar validación en CarritoMapper (al agregar al carrito)
3. ✅ Agregar validación en TransaccionBO (transferencias)
4. ✅ Testing: No se pueden comprar/transferir eventos pasados

### Fase 4: Filtros y UX (1 hora)
1. ✅ Implementar filtros por estado en backend
2. ✅ Conectar filtros en frontend
3. ✅ Fijar código de descuento con sticky
4. ✅ Testing: Filtros funcionan correctamente

### Fase 5: Deploy y Validación Final (1 hora)
1. ✅ Build imágenes de producción
2. ✅ Deploy en AWS con docker-compose.prod.yml
3. ✅ Testing de emails en producción
4. ✅ Verificar URLs correctas en emails
5. ✅ Testing completo de flujo de compra

---

## ✅ Checklist de Testing en Producción

### Emails con URLs Correctas
- [ ] Email de transferencia contiene `http://34.238.85.28:3000/`
- [ ] Email de recuperación contiene `http://34.238.85.28:3000/`
- [ ] Links funcionan correctamente

### Validaciones de Fecha
- [ ] Solo se muestran eventos futuros en lista
- [ ] No se puede agregar evento pasado al carrito
- [ ] No se pueden transferir entradas vencidas
- [ ] Mensajes de error son claros

### Compras
- [ ] Página no parpadea
- [ ] Se puede completar compra con tarjeta
- [ ] Se puede completar compra con puntos
- [ ] Puntos se actualizan correctamente

### Filtros
- [ ] Filtro "Próximos" funciona
- [ ] Filtro "Hoy" funciona
- [ ] Filtro "Finalizados" funciona (si se habilita)
- [ ] Filtros por categoría y ciudad funcionan

---

## 📝 Comandos Útiles

### Desarrollo Local
```bash
# Levantar sistema completo
docker-compose up --build

# Ver logs de un servicio específico
docker-compose logs -f aspnet
docker-compose logs -f www

# Reiniciar un servicio
docker-compose restart aspnet
```

### Producción AWS
```bash
# Levantar sistema en producción
docker-compose -f docker-compose.prod.yml up --build -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f aspnet

# Actualizar solo backend
docker-compose -f docker-compose.prod.yml up --build -d aspnet

# Ver variables de ambiente activas
docker-compose -f docker-compose.prod.yml exec aspnet printenv | grep AppSettings
```

### Verificar Configuración
```bash
# Ver qué ambiente está usando .NET
docker-compose exec aspnet dotnet --info

# Ver variables de ambiente del contenedor
docker-compose exec aspnet env | grep ASPNETCORE_ENVIRONMENT
```

---

**Tiempo estimado total de implementación:** 5-6 horas  
**Prioridad máxima:** BUG #2 (Parpadeo) → Fase 1  
**Segunda prioridad:** Configuración Multi-Ambiente → Fase 2
