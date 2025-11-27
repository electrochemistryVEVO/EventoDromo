# Análisis e Implementación: Integración de Google Maps para Locales

## 📋 Estado Actual del Sistema

### Backend

#### Estructura de Base de Datos (Tabla `Local`)
```sql
CREATE TABLE `Local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `idCiudad` int NOT NULL,
  `direccion` varchar(255) NOT NULL,      -- ⚠️ Texto libre, sin validación
  `capacidad` int NOT NULL,
  `isDeleted` bit(1) NOT NULL,
  `creadoPor` int NOT NULL,
  `imagenURL` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `direccion` (`direccion`)     -- ⚠️ Solo previene duplicados
)
```

**Problemas identificados:**
- ❌ No hay campos para latitud/longitud
- ❌ No hay campo para URL del iframe de Google Maps
- ❌ La dirección es texto libre sin estructura
- ❌ El iframe está **hardcodeado** en `LocalMapper.cs` línea 235

#### Modelos C# Actuales

**`Local.cs`**:
```csharp
public class Local {
    public int id { get; set; }
    public string nombre { get; set; }
    public int idCiudad { get; set; }
    public string direccion { get; set; }    // Texto libre
    public int capacidad { get; set; }
    public string imagenURL { get; set; }
    // ... otros campos
}

public class ResponseLocal {
    public int id { get; set; }
    public string nombre { get; set; }
    public string direccion { get; set; }
    public Ciudad ciudad { get; set; }
    public string googleMapsEmbed { get; set; }  // ⚠️ Hardcodeado en mapper
}

public class CrearLocalDTO {
    public string Nombre { get; set; }
    public int CiudadId { get; set; }
    public string Direccion { get; set; }
    public int Capacidad { get; set; }
    public string? imagenURL { get; set; }
    // ❌ No hay campos para coordenadas ni URL de mapa
}
```

**`LocalMapper.cs` - Línea 235**:
```csharp
local.googleMapsEmbed = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9705727105875!2d-77.037574524449!3d-12.045545688191202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8ca3c54dd11%3A0x40b0447dcf24a5c8!2sTeatro%20Municipal%20de%20Lima!5e0!3m2!1ses!2spe!4v1760080206514!5m2!1ses!2spe\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";
```
**Problema**: Todos los locales muestran el mismo iframe del Teatro Municipal de Lima.

### Frontend

#### Creación de Locales (`/admin/locales/crear/page.js`)

**Formulario actual:**
- ✅ Nombre del local
- ✅ Ciudad (dropdown)
- ✅ Dirección (input text libre)
- ✅ Capacidad
- ✅ Imagen URL (opcional)

**Problemas:**
- ❌ No hay selector de ubicación en mapa
- ❌ No valida que la dirección sea real
- ❌ No captura coordenadas geográficas
- ❌ No genera/valida URL de Google Maps

#### Vista de Detalle (`LocationInfo.jsx`)

```jsx
const LocationInfo = ({ city, venue, address, googleMapsEmbed }) => {
  const mapHtml = { __html: googleMapsEmbed };
  
  return (
    <div className="location-panel">
      <div className="location-text-info">
        <p className="location-city">{city}</p>
        <h3 className="location-venue">{venue}</h3>
        <p className="location-address">{address}</p>
      </div>
      <div 
        className="location-map-container"
        dangerouslySetInnerHTML={mapHtml}  // ⚠️ Renderiza el iframe hardcodeado
      />
    </div>
  );
};
```

**Problema**: Todos los eventos muestran el mismo mapa.

---

## 🎯 Objetivos de la Implementación

1. **Capturar ubicación real** durante la creación del local usando Google Maps API
2. **Almacenar coordenadas** (latitud, longitud) en la base de datos
3. **Generar dinámicamente** el iframe de Google Maps basado en coordenadas
4. **Validar direcciones** usando Google Places/Geocoding API
5. **Mejorar UX** con autocompletado de direcciones

---

## 🏗️ Diseño de la Solución

### 1. Cambios en Base de Datos

**Migración SQL: `015_agregar_campos_google_maps_local.sql`**

```sql
-- Agregar campos para Google Maps
ALTER TABLE Local 
ADD COLUMN latitud DECIMAL(10, 8) DEFAULT NULL COMMENT 'Latitud del local',
ADD COLUMN longitud DECIMAL(11, 8) DEFAULT NULL COMMENT 'Longitud del local',
ADD COLUMN googlePlaceId VARCHAR(255) DEFAULT NULL COMMENT 'Place ID de Google Maps para referencia',
ADD COLUMN googleMapsUrl VARCHAR(500) DEFAULT NULL COMMENT 'URL directa de Google Maps';

-- Índices para búsquedas geoespaciales (opcional, para futuras features)
CREATE INDEX idx_local_coordenadas ON Local(latitud, longitud);
```

**Justificación de tipos de datos:**
- `DECIMAL(10, 8)` para latitud: Rango -90 a +90 con 8 decimales (~1.1mm precisión)
- `DECIMAL(11, 8)` para longitud: Rango -180 a +180 con 8 decimales
- `VARCHAR(255)` para Place ID: IDs de Google como "ChIJN1t_tDeuEmsRUsoyG83frY4"
- `VARCHAR(500)` para URL: URLs completas de Google Maps

### 2. Cambios en Backend (C#)

#### 2.1 Actualizar Modelos

**`Local.cs`**:
```csharp
public class Local
{
    // ... campos existentes
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }
    public string? GooglePlaceId { get; set; }
    public string? GoogleMapsUrl { get; set; }
}

public class CrearLocalDTO
{
    public string Nombre { get; set; }
    public int CiudadId { get; set; }
    public string Direccion { get; set; }
    public int Capacidad { get; set; }
    public string? imagenURL { get; set; }
    
    // Nuevos campos
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }
    public string? GooglePlaceId { get; set; }
    public string? GoogleMapsUrl { get; set; }
}

public class LocalModificarLocalRequest
{
    // ... campos existentes
    
    // Nuevos campos
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }
    public string? GooglePlaceId { get; set; }
    public string? GoogleMapsUrl { get; set; }
}

public class ResponseLocal
{
    public int id { get; set; }
    public string nombre { get; set; }
    public string direccion { get; set; }
    public Ciudad ciudad { get; set; }
    public string googleMapsEmbed { get; set; }  // Generado dinámicamente
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }
}
```

#### 2.2 Actualizar `LocalMapper.cs`

**Método `InsertarLocal` (línea 114)**:
```csharp
public int InsertarLocal(Local local)
{
    lock (DB)
    {
        string query = @"INSERT INTO Local 
            (NOMBRE, IDCIUDAD, DIRECCION, CAPACIDAD, IMAGENURL, ISDELETED, CREADOPOR, 
             latitud, longitud, googlePlaceId, googleMapsUrl) 
            VALUES 
            (@NOMBRE, @IDCIUDAD, @DIRECCION, @CAPACIDAD, @IMAGENURL, @ISDELETED, @CREADOPOR,
             @LATITUD, @LONGITUD, @GOOGLEPLACEID, @GOOGLEMAPSURL); 
            SELECT LAST_INSERT_ID();";
            
        var parametros = new ParameterList();
        parametros.Add("@NOMBRE", local.nombre);
        parametros.Add("@IDCIUDAD", local.idCiudad);
        parametros.Add("@DIRECCION", local.direccion);
        parametros.Add("@CAPACIDAD", local.capacidad);
        parametros.Add("@IMAGENURL", local.imagenURL);
        parametros.Add("@ISDELETED", local.isDeleted);
        parametros.Add("@CREADOPOR", local.idAdministrador);
        parametros.Add("@LATITUD", local.Latitud);
        parametros.Add("@LONGITUD", local.Longitud);
        parametros.Add("@GOOGLEPLACEID", local.GooglePlaceId);
        parametros.Add("@GOOGLEMAPSURL", local.GoogleMapsUrl);
        
        object result = DB.ExecuteScalar(query, parametros);
        return Convert.ToInt32(result);
    }
}
```

**Método `ObtenerLocalPorIdEvento` (línea 205)** - Generar iframe dinámicamente:
```csharp
public ResponseLocal ObtenerLocalPorIdEvento(int eventoId)
{
    lock (DB)
    {
        string query = @"SELECT
                            L.id AS ID,
                            L.nombre AS NOMBRE,
                            L.direccion AS DIRECCION,
                            L.idCiudad AS IDCIUDAD,
                            L.latitud AS LATITUD,
                            L.longitud AS LONGITUD
                        FROM Local AS L
                        JOIN Evento AS E ON L.id = E.idLocal
                        WHERE E.id = @IdEvento;";

        var parametros = new ParameterList();
        parametros.Add("@IdEvento", eventoId);
        DB.Select(query, parametros);
        
        if (DB.Read())
        {
            ResponseLocal local = new ResponseLocal();
            local.id = DB.GetInt("ID");
            local.nombre = DB.GetString("NOMBRE");
            local.direccion = DB.GetString("DIRECCION");
            local.ciudad = new Ciudad() { id = DB.GetInt("IDCIUDAD") };
            
            // Obtener coordenadas
            var latitud = DB.GetNullableDecimal("LATITUD");
            var longitud = DB.GetNullableDecimal("LONGITUD");
            
            local.Latitud = latitud;
            local.Longitud = longitud;
            
            // Generar iframe dinámicamente si hay coordenadas
            if (latitud.HasValue && longitud.HasValue)
            {
                local.googleMapsEmbed = GenerarGoogleMapsIframe(latitud.Value, longitud.Value, local.nombre);
            }
            else
            {
                // Fallback al iframe hardcodeado si no hay coordenadas
                local.googleMapsEmbed = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9705727105875!2d-77.037574524449!3d-12.045545688191202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8ca3c54dd11%3A0x40b0447dcf24a5c8!2sTeatro%20Municipal%20de%20Lima!5e0!3m2!1ses!2spe!4v1760080206514!5m2!1ses!2spe\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";
            }

            local.ciudad = ciudadMapper.ObtenerCiudadPorId((int)local.ciudad.id);
            return local;
        }
        return null;
    }
}

// Nuevo método helper
private string GenerarGoogleMapsIframe(decimal latitud, decimal longitud, string nombreLocal)
{
    // Formato: https://www.google.com/maps?q=LAT,LNG
    string mapUrl = $"https://www.google.com/maps?q={latitud.ToString(System.Globalization.CultureInfo.InvariantCulture)},{longitud.ToString(System.Globalization.CultureInfo.InvariantCulture)}";
    
    return $"<iframe src=\"{mapUrl}&output=embed\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";
}
```

### 3. Cambios en Frontend

#### 3.1 Obtener API Key de Google Maps

**Archivo: `.env.local`** (crear si no existe):
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```

**⚠️ IMPORTANTE**: 
- Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
- Habilitar APIs: Maps JavaScript API, Places API, Geocoding API
- Generar API Key
- Restringir por dominio en producción

#### 3.2 Instalar Google Maps React Library

```bash
npm install @react-google-maps/api
```

#### 3.3 Crear Componente de Selector de Ubicación

**Archivo: `src/components/admin-locales/MapLocationPicker.jsx`**

```jsx
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: -12.046374, // Lima, Perú por defecto
  lng: -77.042793
};

export default function MapLocationPicker({ 
  onLocationSelect, 
  initialLocation = null,
  initialAddress = ''
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [markerPosition, setMarkerPosition] = useState(
    initialLocation || defaultCenter
  );
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const autocompleteRef = useRef(null);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setMarkerPosition({ lat, lng });
    
    // Geocodificación inversa para obtener dirección
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        const placeId = results[0].place_id;
        
        setSelectedAddress(address);
        onLocationSelect({
          lat,
          lng,
          address,
          placeId,
          googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`
        });
      }
    });
  }, [onLocationSelect]);

  const onPlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;
        const placeId = place.place_id;
        
        setMarkerPosition({ lat, lng });
        setSelectedAddress(address);
        
        onLocationSelect({
          lat,
          lng,
          address,
          placeId,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`
        });
      }
    }
  }, [onLocationSelect]);

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error al cargar Google Maps. Verifica tu API Key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-gray-600">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Buscador de direcciones */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Buscar dirección
        </label>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceSelect}
          options={{
            componentRestrictions: { country: 'pe' }, // Restringir a Perú
            fields: ['formatted_address', 'geometry', 'place_id']
          }}
        >
          <input
            type="text"
            placeholder="Busca una dirección..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C49A] focus:border-transparent outline-none"
            defaultValue={selectedAddress}
          />
        </Autocomplete>
        <p className="text-xs text-gray-500">
          Busca una dirección o haz clic en el mapa para seleccionar la ubicación
        </p>
      </div>

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={markerPosition}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        <Marker position={markerPosition} />
      </GoogleMap>

      {/* Dirección seleccionada */}
      {selectedAddress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Dirección seleccionada:</strong> {selectedAddress}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Coordenadas: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
```

#### 3.4 Integrar en el Formulario de Creación

**Archivo: `src/app/admin/locales/crear/page.js`** - Modificar:

```jsx
import MapLocationPicker from '@/components/admin-locales/MapLocationPicker';

function CrearLocal() {
  // ... estado existente
  const [locationData, setLocationData] = useState(null);

  const handleLocationSelect = (data) => {
    setLocationData(data);
    // Actualizar el input de dirección automáticamente
    const direccionInput = document.getElementById('direccion');
    if (direccionInput) {
      direccionInput.value = data.address;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.target);
    
    // Validar que se haya seleccionado ubicación
    if (!locationData) {
      setError('Por favor, selecciona una ubicación en el mapa');
      setIsLoading(false);
      return;
    }
    
    const localDTO = {
      nombre: formData.get('nombre'),
      ciudadId: parseInt(formData.get('idCiudad')),
      direccion: locationData.address,
      capacidad: parseInt(formData.get('capacidad')),
      imagenURL: formData.get('imagenUrl') || null,
      // Nuevos campos
      latitud: locationData.lat,
      longitud: locationData.lng,
      googlePlaceId: locationData.placeId,
      googleMapsUrl: locationData.googleMapsUrl
    };
    
    // ... resto del código de validación y envío
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* ... header existente */}
      
      <form onSubmit={handleSubmit}>
        {/* ... campos existentes: nombre, ciudad */}
        
        {/* NUEVO: Selector de ubicación en mapa */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ubicación del Local <span className="text-red-500">*</span>
          </label>
          <MapLocationPicker 
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Campo de dirección (ahora readonly, se llena automáticamente) */}
        <div className="space-y-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            readOnly
            value={locationData?.address || ''}
            placeholder="Selecciona una ubicación en el mapa"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            required
          />
          <p className="text-xs text-gray-500">
            Esta dirección se completa automáticamente al seleccionar en el mapa
          </p>
        </div>

        {/* ... resto de campos: capacidad, imagen */}
      </form>
    </div>
  );
}
```

#### 3.5 Actualizar Servicio Frontend

**Archivo: `src/services/gestionLocal.service.js`**:

```javascript
export async function insertarLocal(local) {
    const token = getAuthToken();
    if (!token) {
        return { success: false, message: "No se encontró el token de autenticación" };
    }
    
    try {
        const url = await getApiUrl();
        
        // Validar campos requeridos
        if (!local.latitud || !local.longitud) {
            return { 
                success: false, 
                message: "Debes seleccionar una ubicación en el mapa" 
            };
        }
        
        const response = await fetch(`${url}/Local/LocalCrearLocales`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: local.nombre,
                ciudadId: local.ciudadId,
                direccion: local.direccion,
                capacidad: local.capacidad,
                imagenURL: local.imagenURL,
                latitud: local.latitud,
                longitud: local.longitud,
                googlePlaceId: local.googlePlaceId,
                googleMapsUrl: local.googleMapsUrl
            })
        });

        // ... resto de manejo de respuesta
    } catch (err) {
        console.error("Error en insertarLocal:", err);
        return { success: false, message: err.message };
    }
}
```

---

## 📝 Plan de Implementación

### Fase 1: Base de Datos ✅
1. Crear migración SQL `015_agregar_campos_google_maps_local.sql`
2. Ejecutar migración en desarrollo
3. Verificar estructura con `DESCRIBE Local;`

### Fase 2: Backend (C#) ✅
1. Actualizar modelos en `Local.cs`
2. Modificar `LocalMapper.cs`:
   - Método `InsertarLocal` (agregar campos)
   - Método `ModificarLocal` (agregar campos)
   - Método `ObtenerLocalPorIdEvento` (generar iframe dinámicamente)
   - Agregar método helper `GenerarGoogleMapsIframe`
3. Actualizar `LocalBO.cs` si es necesario
4. Probar endpoints con Postman

### Fase 3: Frontend ✅
1. Obtener Google Maps API Key
2. Configurar `.env.local`
3. Instalar `@react-google-maps/api`
4. Crear componente `MapLocationPicker.jsx`
5. Integrar en formulario de creación
6. Actualizar servicio `gestionLocal.service.js`
7. Probar flujo completo de creación

### Fase 4: Migración de Datos Existentes (Opcional)
```sql
-- Script para geocodificar locales existentes (ejecutar manualmente)
-- Necesitarás usar un servicio externo o API de Google para obtener coordenadas
UPDATE Local SET 
  latitud = -12.046374,  -- Coordenadas de ejemplo
  longitud = -77.042793,
  googleMapsUrl = CONCAT('https://www.google.com/maps?q=', latitud, ',', longitud)
WHERE id = 1;  -- Actualizar local por local
```

### Fase 5: Testing ✅
1. Crear local nuevo con mapa
2. Verificar que se guarden coordenadas en BD
3. Ver evento y verificar que el iframe muestre ubicación correcta
4. Editar local y cambiar ubicación
5. Probar con diferentes ciudades

---

## 🔒 Consideraciones de Seguridad

1. **API Key Protection**:
   - Usar variables de entorno
   - Restringir por dominio en producción
   - Monitorear cuotas de uso

2. **Validación de Datos**:
   - Validar rangos de latitud (-90 a 90)
   - Validar rangos de longitud (-180 a 180)
   - Sanitizar Place IDs

3. **Rate Limiting**:
   - Google Maps tiene límites de requests
   - Implementar caché de geocodificaciones

---

## 💰 Costos de Google Maps API

**Plan gratuito**: $200 crédito mensual
- **Maps JavaScript API**: ~$7 por 1,000 loads
- **Places API**: $17 por 1,000 requests
- **Geocoding API**: $5 por 1,000 requests

**Estimación para EventoDromo**:
- Creación de locales: ~50/mes → $0.85
- Vistas de eventos: ~10,000/mes → $70
- **Total estimado**: ~$71/mes (dentro del crédito gratuito)

---

## 🚀 Mejoras Futuras

1. **Búsqueda por proximidad**: Eventos cerca de ti
2. **Rutas**: Cómo llegar al evento
3. **Street View**: Vista previa del local
4. **Geofencing**: Notificaciones por ubicación
5. **Análisis geográfico**: Heatmaps de eventos populares

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migración SQL
- [ ] Actualizar modelos C#
- [ ] Modificar LocalMapper
- [ ] Obtener Google Maps API Key
- [ ] Configurar .env.local
- [ ] Instalar paquete npm
- [ ] Crear MapLocationPicker
- [ ] Integrar en formulario
- [ ] Actualizar servicio
- [ ] Probar creación de local
- [ ] Verificar iframe en detalle
- [ ] Probar edición de local
- [ ] Documentar cambios
- [ ] Deploy a producción

