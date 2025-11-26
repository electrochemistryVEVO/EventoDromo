# Verificación de Amazon Location Service - AWS Academy

## 🎓 AWS Academy (Cuenta Educativa) - Limitaciones

### ⚠️ Problema Principal
Las cuentas de **AWS Academy Learner Lab** tienen restricciones importantes:

1. **NO tienen acceso a Amazon Location Service** por defecto
2. Solo tienen acceso a servicios básicos: EC2, S3, RDS, Lambda, etc.
3. Las credenciales temporales expiran al finalizar el laboratorio (4 horas máx)
4. No puedes crear API Keys permanentes

### 🔍 Cómo Verificar si Tienes Acceso

#### Opción 1: Desde la Consola AWS
```
1. Inicia tu laboratorio en AWS Academy
2. Ve a AWS Management Console
3. Busca "Location Service" en la barra de búsqueda
4. Si ves "You don't have permissions" o no aparece → NO tienes acceso
5. Si puedes entrar → SÍ tienes acceso (muy raro en cuentas educativas)
```

#### Opción 2: Verificar con AWS CLI
```bash
# En tu terminal local, configura las credenciales temporales del lab
aws configure set aws_access_key_id YOUR_ACCESS_KEY
aws configure set aws_secret_access_key YOUR_SECRET_KEY
aws configure set aws_session_token YOUR_SESSION_TOKEN
aws configure set region us-east-1

# Intenta listar mapas de Location Service
aws location list-maps

# Si responde con error "AccessDeniedException" → NO tienes acceso
# Si responde con "[]" o lista de mapas → SÍ tienes acceso
```

#### Opción 3: Revisar IAM Policies del Lab
```bash
# Obtener el usuario actual
aws sts get-caller-identity

# Ver políticas asociadas (busca "Location" en los permisos)
aws iam list-attached-user-policies --user-name LabUser
```

---

## 🚫 Por Qué AWS Academy NO es Viable

### 1. **Credenciales Temporales**
- Expiran cada 4 horas
- Necesitarías renovarlas manualmente en producción
- No puedes generar API Keys permanentes

### 2. **Servicios Limitados**
- AWS Academy suele dar acceso solo a:
  ✅ EC2, S3, RDS, Lambda, DynamoDB
  ❌ Location Service, Cognito, SageMaker, etc.

### 3. **Costos de Migración**
- Si funciona en el lab, NO funcionará en producción
- Tendrías que migrar a cuenta AWS real ($$$)

---

## ✅ Alternativas GRATIS y Permanentes

### 🗺️ Opción 1: OpenStreetMap + Leaflet (RECOMENDADA)
```
- 100% gratuito
- Sin API keys
- Sin límites de uso
- Buen rendimiento
- Autocompletado con Nominatim (gratis)
```

**Para implementar:**
```bash
npm install leaflet react-leaflet
```

### 🗺️ Opción 2: Google Maps Embed (Solo Visualización)
```
- Gratis para embeds básicos
- No requiere API key para iframes simples
- Formato: https://maps.google.com/maps?q=LAT,LNG&output=embed
- Limitado: solo para mostrar, no para seleccionar
```

**Combinación ideal:**
- Admin usa Leaflet para seleccionar ubicación
- Usuarios ven iframe de Google Maps (más familiar)

### 🗺️ Opción 3: Mapbox (Freemium)
```
- 50,000 mapas loads gratis/mes
- API key gratuita permanente
- Mejor que OSM, pero con límites
```

---

## 🎯 Decisión Recomendada

### ❌ NO usar AWS Academy porque:
1. No tendrás acceso a Location Service
2. Credenciales temporales (4 horas)
3. No escalable a producción
4. Tendrías que pagar AWS real después

### ✅ SÍ usar Solución Híbrida:

**Backend (Base de Datos):**
```sql
ALTER TABLE Local 
ADD COLUMN latitud DECIMAL(10, 8),
ADD COLUMN longitud DECIMAL(11, 8);
```

**Frontend Admin (Crear Local):**
- OpenStreetMap + Leaflet (gratis, selector interactivo)
- Captura lat/lng y guarda en BD

**Frontend Usuario (Ver Evento):**
- Generar iframe de Google Maps desde lat/lng
- `<iframe src="https://maps.google.com/maps?q={lat},{lng}&output=embed" />`
- Sin API key, totalmente gratis

---

## 📝 Script de Verificación AWS

Si aún quieres probar, copia este script:

```bash
#!/bin/bash
# verificar_aws_location.sh

echo "🔍 Verificando acceso a Amazon Location Service..."
echo ""

# Verificar credenciales configuradas
echo "1. Verificando credenciales AWS..."
aws sts get-caller-identity 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ No hay credenciales configuradas"
    echo "   Configura con: aws configure"
    exit 1
fi
echo "✅ Credenciales OK"
echo ""

# Intentar listar mapas
echo "2. Intentando acceder a Location Service..."
result=$(aws location list-maps --region us-east-1 2>&1)
if [[ $result == *"AccessDenied"* ]] || [[ $result == *"not authorized"* ]]; then
    echo "❌ NO tienes acceso a Location Service"
    echo "   Tu cuenta AWS Academy está limitada"
elif [[ $result == *"could not be found"* ]]; then
    echo "❌ Location Service no está disponible en tu región"
else
    echo "✅ SÍ tienes acceso a Location Service"
    echo "   Respuesta: $result"
fi
echo ""

# Verificar políticas IAM
echo "3. Verificando permisos IAM..."
policies=$(aws iam list-attached-user-policies --user-name LabUser 2>&1)
if [[ $policies == *"Location"* ]]; then
    echo "✅ Tienes permisos de Location en IAM"
else
    echo "⚠️  No se encontraron permisos de Location"
fi
```

---

## 🚀 Siguiente Paso

¿Quieres que implemente la **Solución Híbrida Gratuita** (OpenStreetMap + Google Maps Embed)?

Solo necesito tu confirmación para:
1. ✅ Crear migración SQL (latitud/longitud)
2. ✅ Instalar Leaflet (`npm install leaflet react-leaflet`)
3. ✅ Crear componente de selector de ubicación
4. ✅ Integrar en formulario de creación
5. ✅ Generar iframes de Google Maps dinámicamente

**Tiempo estimado:** 30-45 minutos
**Costo:** $0.00 (100% gratis)
**Dependencias de AWS:** Ninguna
