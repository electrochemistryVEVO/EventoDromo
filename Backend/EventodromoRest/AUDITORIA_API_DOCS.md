# 📋 API de Auditorías - Documentación

## Endpoints Implementados

### 1. **Obtener Lista de Clientes**

**Endpoint:** `GET /api/Auditoria/ObtenerClientes`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `page` (opcional, default: 1): Número de página
- `search` (opcional): Término de búsqueda (filtra por nombre, email o teléfono)

**Ejemplo de Request:**
```
GET /api/Auditoria/ObtenerClientes?page=1&search=juan
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Clientes obtenidos exitosamente",
  "data": {
    "clientes": [
      {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "jperez@email.com",
        "telefono": "993345782",
        "fechaCreacion": "08-07-2025",
        "ultimaEdicion": "05-10-2025",
        "ultimaSesion": {
          "fecha": "09-09-2025",
          "hora": "10:56 pm"
        },
        "actividad": {
          "compras": 8,
          "total": "S/1300",
          "puntosUsados": "150 puntos usados"
        },
        "transferencias": {
          "enviadas": 2,
          "recibidas": 0
        }
      }
    ],
    "totalPages": 10,
    "currentPage": 1,
    "totalClientes": 58
  },
  "error": null
}
```

---

### 2. **Obtener Detalle de Cliente**

**Endpoint:** `GET /api/Auditoria/ObtenerDetalleCliente/{clienteId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `clienteId` (requerido): ID del cliente

**Ejemplo de Request:**
```
GET /api/Auditoria/ObtenerDetalleCliente/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Detalle del cliente obtenido exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "jperez@email.com",
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "telefono": "993345782",
    "puntos": 10,
    "resumen": {
      "comprasTotales": 8,
      "gastoTotal": "S/1300",
      "transferencias": 3,
      "puntosUsados": 150
    },
    "historialActividades": [
      {
        "id": 1,
        "tipo": "compra",
        "icono": "compra",
        "etiqueta": "Compra",
        "monto": "S/ 300",
        "descripcion": "Compra de 2 entradas para \"Concierto de Rock Nacional\"",
        "fecha": "2025-03-10",
        "hora": "14:30:00"
      },
      {
        "id": 2,
        "tipo": "transferencia_enviada",
        "icono": "transferencia_enviada",
        "etiqueta": "Transferencia Enviada",
        "descripcion": "Transferencia de 1 entrada a usuario con ID J1833290203",
        "fecha": "2025-03-09",
        "hora": "16:45:00"
      },
      {
        "id": 4,
        "tipo": "uso_puntos",
        "icono": "uso_puntos",
        "etiqueta": "Uso de Puntos",
        "puntosUsados": "50 DP",
        "descripcion": "Uso de 50 puntos para descuento en compra",
        "fecha": "2025-03-07",
        "hora": "19:20:00"
      }
    ]
  },
  "error": null
}
```

---

## 🔐 Autenticación

Ambos endpoints requieren autenticación JWT. El token debe ser proporcionado en el header `Authorization` con el formato:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Lógica de Cálculo

### **Puntos Usados:**
Se calcula como: `SUM(cantidad - cantidadRestante)` de la tabla `Punto`

### **Transferencias Enviadas:**
Se cuenta desde la tabla `Auditoria` donde `idTipoAuditoria = 2` (Transferencia Enviada)

### **Gasto Total:**
Suma del campo `montoTotal` de la tabla `Transaccion` del cliente

### **Compras Totales:**
Conteo de registros en la tabla `Transaccion` del cliente

---

## 🗂️ Tipos de Auditoría

| ID | Nombre | Tipo Frontend |
|----|--------|---------------|
| 1  | Compra | `compra` |
| 2  | Transferencia Enviada | `transferencia_enviada` |
| 3  | Actualización Perfil | `actualizacion_perfil` |
| 4  | Uso de Puntos | `uso_puntos` |
| 5  | Inicio Sesión | `inicio_sesion` |

---

## ⚙️ Configuración del Frontend

Para activar el backend en el servicio del frontend:

**Archivo:** `front-edromo/src/services/service-auditoria.js`

```javascript
// Cambiar de false a true
const USE_BACKEND = true;
```

---

## 🔍 Paginación

- **Items por página:** 6 clientes
- **Página inicial:** 1
- **Cálculo de páginas totales:** `Math.Ceiling(totalClientes / 6)`

---

## ❌ Manejo de Errores

### Cliente no encontrado (404):
```json
{
  "success": false,
  "message": "No se encontró el cliente con ID 999",
  "data": null,
  "error": "CLIENT_NOT_FOUND"
}
```

### ID inválido:
```json
{
  "success": false,
  "message": "ID de cliente inválido",
  "data": null,
  "error": "INVALID_CLIENT_ID"
}
```

### Error de servidor (500):
```json
{
  "success": false,
  "message": "Error al obtener los clientes",
  "data": null,
  "error": "Descripción del error técnico"
}
```

---

## 📝 Notas Importantes

1. ✅ Los queries están optimizados con subqueries para evitar múltiples llamadas a la BD
2. ✅ El formato de fechas es `dd-MM-yyyy` para la fecha y `hh:mm tt` para la hora
3. ✅ El campo `monto` en la tabla `Auditoria` se usa para:
   - Tipo 1 (Compra): Monto en soles
   - Tipo 4 (Uso de Puntos): Cantidad de puntos usados
4. ⚠️ Las "Transferencias Recibidas" están en 0 por ahora (se puede implementar después)
5. ✅ El controlador incluye `[Authorize]` para requerir JWT
6. ✅ Todos los métodos están documentados con comentarios XML

---

## 🧪 Testing

### Test 1: Listar clientes sin búsqueda
```bash
curl -X GET "http://localhost:8080/api/Auditoria/ObtenerClientes?page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Listar clientes con búsqueda
```bash
curl -X GET "http://localhost:8080/api/Auditoria/ObtenerClientes?page=1&search=juan" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Obtener detalle de cliente
```bash
curl -X GET "http://localhost:8080/api/Auditoria/ObtenerDetalleCliente/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🏗️ Estructura de Archivos Creados/Modificados

```
Backend/EventodromoRest/
├── Controllers/
│   └── AuditoriaController.cs         ✅ NUEVO
├── Negocio/
│   └── AuditoriaBO.cs                 ✅ MODIFICADO
├── Mappers/
│   └── AuditoriaMapper.cs             ✅ MODIFICADO
└── Modelos/
    └── Cliente.cs                      ✅ MODIFICADO (DTOs agregados)
```

---

## ✨ Próximos Pasos Recomendados

1. ✅ Cambiar `USE_BACKEND = true` en el frontend
2. ✅ Probar los endpoints con Postman o el frontend
3. 🔄 (Opcional) Implementar lógica para "Transferencias Recibidas"
4. 🔄 (Opcional) Agregar validación de rol de administrador en el controller
5. 🔄 (Opcional) Agregar logs más detallados para debugging

---

**Última actualización:** 18 de Noviembre, 2025
