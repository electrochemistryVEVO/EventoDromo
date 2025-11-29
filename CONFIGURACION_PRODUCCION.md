# 🚀 Configuración para Producción

## 1. ✅ URL del Frontend en Emails

**Archivo:** `Backend/EventodromoRest/appsettings.json`

```json
"AppSettings": {
  "FrontendUrl": "https://tu-dominio-frontend.com"  // ⚠️ CAMBIAR ESTO
}
```

**Afecta a:**
- Emails de recuperación de contraseña
- Emails de transferencia de entradas
- Cualquier link en notificaciones

**Pasos:**
1. Reemplazar `https://tu-dominio-frontend.com` con tu URL real de producción
2. Ejemplo: `"FrontendUrl": "https://eventodromo.netlify.app"`
3. Reiniciar el backend

---

## 2. 🔐 Credenciales AWS (S3)

**Archivo:** `Backend/EventodromoRest/appsettings.json`

```json
"AWS": {
  "BucketName": "eventodromo-s3",
  "Region": "us-east-1",
  "AccessKey": "ASIAW3MD7DAY...",      // ⚠️ ACTUALIZAR
  "SecretKey": "yaT6pBVfWQvM...",      // ⚠️ ACTUALIZAR
  "SessionToken": "IQoJb3JpZ2luX2..."  // ⚠️ ACTUALIZAR
}
```

### ⚠️ Importante: AWS Learner Lab

Las credenciales de AWS Learner Lab **expiran cada 4 horas**. Cuando el lab se cierra, las credenciales dejan de funcionar.

### Pasos para actualizar credenciales:

1. **Inicia sesión en AWS Learner Lab**
   - Ve a tu curso en AWS Academy
   - Haz clic en "Start Lab"
   - Espera a que el indicador esté verde

2. **Obtén las credenciales actualizadas**
   - Haz clic en "AWS Details"
   - Copia las credenciales:
     - `AWS_ACCESS_KEY_ID` → `AccessKey`
     - `AWS_SECRET_ACCESS_KEY` → `SecretKey`
     - `AWS_SESSION_TOKEN` → `SessionToken`

3. **Actualiza `appsettings.json`**
   - Pega las nuevas credenciales
   - Guarda el archivo
   - Reinicia el backend

### Verificar si las credenciales funcionan:

El backend ahora tiene logs que muestran:
```
[S3Service] Configurando cliente S3:
  - Bucket: eventodromo-s3
  - Region: us-east-1
  - AccessKey presente: True
  - SecretKey presente: True
  - SessionToken presente: True
```

Si al subir una imagen ves el error:
```
Las credenciales de AWS han expirado. Por favor, actualiza las credenciales...
```

Entonces necesitas actualizar las credenciales siguiendo los pasos anteriores.

---

## 3. 🪣 Configuración del Bucket S3

### Verificar que el bucket existe:

1. Ve a AWS Console → S3
2. Busca el bucket `eventodromo-s3`
3. Si no existe, créalo con estos pasos:

**Crear bucket:**
```
- Nombre: eventodromo-s3
- Región: us-east-1
- Block all public access: OFF (desactivar)
```

### Configurar CORS:

Ve a `eventodromo-s3` → Permissions → CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Configurar Bucket Policy (opcional para imágenes públicas):

Si quieres que las imágenes sean públicas sin URLs pre-firmadas:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::eventodromo-s3/*"
    }
  ]
}
```

---

## 4. 🧪 Testing

### Probar recuperación de contraseña:
1. Ir a login → "¿Olvidaste tu contraseña?"
2. Ingresar email
3. Verificar que el email llegue con el link correcto (no localhost)

### Probar subida de imágenes:
1. **Crear Local** → Subir imagen → ✅ Debe funcionar
2. **Crear Evento** → Subir imagen → ✅ Debe funcionar
3. Si falla, verificar:
   - Logs del backend para ver errores
   - Credenciales AWS actualizadas
   - Bucket existe y tiene CORS configurado

### Probar transferencia de entradas:
1. Comprar entradas
2. Transferir a otro usuario
3. Verificar que el email tenga el link correcto (no localhost)

---

## 5. 📝 Checklist de Deployment

Antes de desplegar a producción:

- [ ] `FrontendUrl` configurada en `appsettings.json`
- [ ] Credenciales AWS actualizadas (si usas Learner Lab)
- [ ] Bucket S3 existe y tiene CORS configurado
- [ ] Variables de entorno del frontend configuradas
- [ ] Base de datos accesible desde el servidor de producción
- [ ] HTTPS habilitado en frontend y backend
- [ ] Probar recuperación de contraseña
- [ ] Probar subida de imágenes (eventos y locales)
- [ ] Probar transferencia de entradas

---

## 6. 🐛 Troubleshooting

### "Las credenciales de AWS han expirado"
→ Actualiza las credenciales desde AWS Learner Lab (ver Sección 2)

### "Link de recuperación tiene localhost"
→ Verifica `AppSettings:FrontendUrl` en `appsettings.json`

### "Error 403 Forbidden al subir imagen"
→ Verifica que el bucket tenga permisos correctos y CORS configurado

### "Error al conectar con S3"
→ Verifica que la región sea `us-east-1` y el bucket name sea correcto

### "Crear evento funciona pero crear local no"
→ Ambos usan el mismo servicio S3. Si uno funciona, el otro también debería. Verificar logs del backend.

---

## 📌 Notas Importantes

1. **AWS Learner Lab tiene limitaciones:**
   - Credenciales expiran cada 4 horas
   - El lab se cierra automáticamente después de inactividad
   - Siempre verifica que el lab esté activo (indicador verde)

2. **Para producción real:**
   - Considera usar credenciales permanentes (IAM user)
   - O usar IAM roles en EC2/ECS
   - O usar AWS Secrets Manager

3. **Seguridad:**
   - Nunca commites `appsettings.json` con credenciales reales
   - Usa variables de entorno en producción
   - Considera usar `.gitignore` para `appsettings.json`
