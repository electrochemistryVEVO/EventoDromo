# API de Carga Masiva de Eventos

## Endpoint: EventoCrearMasivo

### Información General
- **Ruta:** `POST /api/Evento/EventoCrearMasivo`
- **Autenticación:** Bearer Token (JWT) - Solo administradores
- **Content-Type:** `application/json`

### Descripción
Este endpoint permite crear múltiples eventos de forma masiva mediante un archivo CSV procesado. El sistema es **tolerante a fallos parciales**: si algunos eventos fallan la validación, los eventos válidos se crearán de todas formas.

---

## Request Body

### Estructura JSON

```json
{
    "eventos": [
        {
            "nombre": "string",
            "descripcion": "string",
            "localId": 0,
            "tipoEventoId": 0,
            "capacidad": 0,
            "fechaPublicacion": "string (YYYY-MM-DD)",
            "fechaCompra": "string (YYYY-MM-DD)",
            "imagenURL": "string (URL opcional)",
            "horarios": [
                "string (formato ISO 8601: 2025-02-15T20:00:00)"
            ],
            "entradas": [
                {
                    "nombre": "string",
                    "precio": 0.0,
                    "cantidad": 0,
                    "limiteCompra": 0,
                    "puntos": 0
                }
            ]
        }
    ]
}
```

### Ejemplo de Request Completo

```json
{
    "eventos": [
        {
            "nombre": "Concierto de Rock",
            "descripcion": "Gran concierto con bandas locales",
            "localId": 1,
            "tipoEventoId": 2,
            "capacidad": 500,
            "fechaPublicacion": "2025-01-15",
            "fechaCompra": "2025-02-01",
            "imagenURL": "https://ejemplo.com/imagen-concierto.jpg",
            "horarios": [
                "2025-02-15T20:00:00",
                "2025-02-16T20:00:00"
            ],
            "entradas": [
                {
                    "nombre": "General",
                    "precio": 25.00,
                    "cantidad": 300,
                    "limiteCompra": 5,
                    "puntos": 10
                },
                {
                    "nombre": "VIP",
                    "precio": 50.00,
                    "cantidad": 200,
                    "limiteCompra": 3,
                    "puntos": 25
                }
            ]
        },
        {
            "nombre": "Festival de Jazz",
            "descripcion": "Una noche mágica con los mejores músicos de jazz",
            "localId": 2,
            "tipoEventoId": 2,
            "capacidad": 300,
            "fechaPublicacion": "2025-01-20",
            "fechaCompra": "2025-02-10",
            "imagenURL": "https://ejemplo.com/imagen-jazz.jpg",
            "horarios": [
                "2025-03-05T19:00:00"
            ],
            "entradas": [
                {
                    "nombre": "Platea",
                    "precio": 40.00,
                    "cantidad": 150,
                    "limiteCompra": 4,
                    "puntos": 20
                },
                {
                    "nombre": "Palco",
                    "precio": 80.00,
                    "cantidad": 150,
                    "limiteCompra": 2,
                    "puntos": 40
                }
            ]
        }
    ]
}
```

---

## Validaciones

### Campos Obligatorios por Evento
- ✅ `nombre` (string no vacío)
- ✅ `descripcion` (string no vacío)
- ✅ `localId` (entero > 0 y debe existir en BD)
- ✅ `tipoEventoId` (entero > 0 y debe existir en BD)
- ✅ `capacidad` (entero > 0)
- ✅ `fechaPublicacion` (formato YYYY-MM-DD)
- ✅ `fechaCompra` (formato YYYY-MM-DD)
- ✅ Al menos 1 horario
- ✅ Al menos 1 entrada

### Validaciones de Fechas
- `fechaPublicacion` debe ser **anterior** a `fechaCompra`
- Los horarios deben estar en formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`

### Validaciones de Entradas
- `nombre`: No puede estar vacío
- `precio`: Debe ser >= 0
- `cantidad`: Debe ser > 0
- `limiteCompra`: Debe ser > 0
- La **suma total de cantidades** de todas las entradas no debe exceder la `capacidad` del evento

### Validaciones de Relaciones
- El `localId` debe existir en la tabla de Locales
- El `tipoEventoId` debe existir en la tabla de TipoEvento

---

## Respuestas

### Response Exitoso (200 OK)

Cuando **todos** los eventos se crean correctamente:

```json
{
    "success": true,
    "message": "5 eventos creados exitosamente",
    "error": null,
    "data": {
        "insertados": 5,
        "fallidos": 0,
        "errores": []
    }
}
```

### Response con Fallos Parciales (200 OK)

Cuando algunos eventos se crean correctamente pero otros fallan:

```json
{
    "success": true,
    "message": "Se crearon 2 eventos, fallaron 3",
    "error": null,
    "data": {
        "insertados": 2,
        "fallidos": 3,
        "errores": [
            "Evento 'Concierto X': El local con ID 999 no existe.",
            "Evento 'Festival Y': La fecha de publicación debe ser anterior a la fecha de compra.",
            "Evento 'Teatro Z': La suma de entradas (600) excede la capacidad del evento (500)."
        ]
    }
}
```

### Response con Error Total (400 Bad Request)

Cuando **todos** los eventos fallan o hay un error en el request:

```json
{
    "success": false,
    "message": "El array de eventos no puede estar vacío.",
    "error": null,
    "data": {
        "insertados": 0,
        "fallidos": 0,
        "errores": [
            "El array de eventos no puede estar vacío."
        ]
    }
}
```

### Response con Error Fatal (500 Internal Server Error)

```json
{
    "success": false,
    "message": "Error fatal al procesar la carga masiva de eventos.",
    "error": "Detalles técnicos del error...",
    "data": {
        "insertados": 0,
        "fallidos": 5,
        "errores": [
            "Mensaje de error técnico"
        ]
    }
}
```

---

## Comportamiento del Sistema

### Procesamiento Individual
- Cada evento se procesa de forma **independiente**
- Si un evento falla, el sistema continúa con los siguientes
- No hay transacción global: cada evento exitoso queda guardado

### Creación de Entidades Relacionadas
Por cada evento exitoso, el sistema crea automáticamente:

1. **Registro del Evento** en la tabla principal
2. **Registros de Horarios** (FechaEvento) por cada horario especificado
3. **Registros de Entradas** (TipoEntrada) por cada tipo de entrada, multiplicado por cada horario

**Ejemplo:** Si un evento tiene 2 horarios y 3 tipos de entradas, se crearán:
- 1 Evento
- 2 FechaEvento
- 6 TipoEntrada (3 tipos × 2 horarios)

### Estado Inicial
- Todos los eventos creados tienen `isDeleted = false` por defecto
- El campo `creadoPor` se obtiene del token JWT del administrador

---

## Ejemplo de Uso con curl

```bash
curl -X POST "https://api.eventodromo.com/api/Evento/EventoCrearMasivo" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventos": [
        {
            "nombre": "Concierto de Rock",
            "descripcion": "Gran concierto con bandas locales",
            "localId": 1,
            "tipoEventoId": 2,
            "capacidad": 500,
            "fechaPublicacion": "2025-01-15",
            "fechaCompra": "2025-02-01",
            "imagenURL": "https://ejemplo.com/imagen.jpg",
            "horarios": ["2025-02-15T20:00:00"],
            "entradas": [
                {
                    "nombre": "General",
                    "precio": 25.00,
                    "cantidad": 500,
                    "limiteCompra": 5,
                    "puntos": 10
                }
            ]
        }
    ]
}'
```

---

## Códigos de Error Comunes

| Mensaje de Error | Causa | Solución |
|------------------|-------|----------|
| `El nombre es requerido` | Campo `nombre` vacío o nulo | Proporcionar un nombre válido |
| `El local con ID X no existe` | El `localId` no existe en la BD | Verificar el ID del local |
| `El tipo de evento con ID X no existe` | El `tipoEventoId` no existe en la BD | Verificar el ID del tipo de evento |
| `La fecha de publicación debe ser anterior...` | `fechaPublicacion >= fechaCompra` | Ajustar las fechas correctamente |
| `Formato de horario inválido` | Horario no cumple formato ISO 8601 | Usar formato `YYYY-MM-DDTHH:mm:ss` |
| `La suma de entradas excede la capacidad` | Total entradas > capacidad | Reducir cantidades o aumentar capacidad |
| `Debe tener al menos un horario` | Array `horarios` vacío | Agregar al menos un horario |
| `Debe tener al menos una entrada` | Array `entradas` vacío | Agregar al menos una entrada |

---

## Notas Importantes

1. **Autenticación**: Actualmente el endpoint usa un `idAdministrador` por defecto (valor: 1). Para habilitar autenticación JWT, descomentar las líneas correspondientes en el controlador.

2. **Límite de Eventos**: No hay límite técnico en la cantidad de eventos por request, pero se recomienda procesar lotes de máximo 100 eventos para evitar timeouts.

3. **Formato de Fechas**: 
   - `fechaPublicacion` y `fechaCompra`: `YYYY-MM-DD`
   - `horarios`: `YYYY-MM-DDTHH:mm:ss` (ISO 8601)

4. **Integridad Referencial**: El sistema verifica automáticamente que los IDs de Local y TipoEvento existan antes de insertar.

5. **Capacidad vs Entradas**: La capacidad del evento es un límite global, mientras que cada horario tiene sus propias entradas. El sistema valida que la suma de cantidades de entradas no exceda la capacidad.

---

## Integración con CSV

Este endpoint está diseñado para trabajar con archivos CSV procesados en el frontend. El flujo típico es:

1. Usuario carga archivo CSV
2. Frontend parsea el CSV y convierte cada fila en un objeto `EventoMasivoItem`
3. Frontend envía el array de eventos al endpoint
4. Backend procesa y retorna resumen de éxitos/errores
5. Frontend muestra resultados al usuario

### Ejemplo de estructura CSV

```csv
nombre,descripcion,localId,tipoEventoId,capacidad,fechaPublicacion,fechaCompra,imagenURL,horarios,entradas
"Concierto Rock","Gran concierto",1,2,500,"2025-01-15","2025-02-01","https://img.com/1.jpg","2025-02-15T20:00:00|2025-02-16T20:00:00","General:25:300:5:10|VIP:50:200:3:25"
```

Donde `entradas` sigue el formato: `nombre:precio:cantidad:limiteCompra:puntos` separados por `|`
