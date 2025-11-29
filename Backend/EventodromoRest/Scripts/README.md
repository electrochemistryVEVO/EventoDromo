# Scripts de Base de Datos - EventoDromo

## 📁 Scripts Disponibles

### `INIT_TIPO_AUDITORIA.sql`
**Propósito:** Inicializa los tipos de auditoría necesarios para el sistema de seguimiento de actividades de usuario.

**Tipos de Auditoría:**
- **ID 1:** Compra de entradas 🛒
- **ID 2:** Inicio de sesión 🔑 (Necesario para BUG #4)
- **ID 3:** Cierre de sesión 🚪 (Necesario para BUG #4)
- **ID 4:** Uso de puntos ⭐
- **ID 5:** Transferencia enviada 📤
- **ID 6:** Transferencia recibida 📥

**¿Cuándo ejecutar?**
- Durante la configuración inicial de la base de datos
- Después de limpiar/resetear la base de datos
- Si faltan tipos de auditoría en el sistema

**Cómo ejecutar:**

#### Opción 1: MySQL Workbench
1. Abrir MySQL Workbench
2. Conectarse a la base de datos `eventodromo`
3. Abrir el archivo `INIT_TIPO_AUDITORIA.sql`
4. Ejecutar el script (Ctrl + Shift + Enter)

#### Opción 2: Línea de comandos
```bash
mysql -u root -p eventodromo < Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql
```

#### Opción 3: Docker (si usas contenedores)
```bash
docker exec -i eventodromo-mysql mysql -u root -peventodromo eventodromo < Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql
```

**Notas:**
- El script usa `ON DUPLICATE KEY UPDATE` para evitar errores si los registros ya existen
- Es seguro ejecutarlo múltiples veces
- Verifica que la tabla `TipoAuditoria` exista antes de ejecutar

---

## 🔧 Resolución de Problemas

### Error: "Table 'TipoAuditoria' doesn't exist"
La tabla debe crearse primero. Verifica que las migraciones se hayan ejecutado correctamente.

### Error: "Access denied"
Verifica que el usuario de MySQL tenga permisos de INSERT/UPDATE en la base de datos.

### Verificar tipos de auditoría existentes:
```sql
SELECT * FROM TipoAuditoria ORDER BY id;
```

---

## 📝 Cambios Recientes (BUG #4)

**Fecha:** 2025
**Descripción:** Implementación del sistema de auditoría de sesiones de usuario

**Cambios realizados:**
1. ✅ Creado script `INIT_TIPO_AUDITORIA.sql` para inicializar tipos
2. ✅ Agregado registro de auditoría en `ClienteBO.AutenticarCliente()`
3. ✅ Creado método `ClienteMapper.ActualizarUltimaSesion()`
4. ✅ Actualización de `fechaUltimaSesion` en cada login

**Archivos modificados:**
- `Backend/EventodromoRest/Negocio/ClienteBO.cs`
- `Backend/EventodromoRest/Mappers/ClienteMapper.cs`
- `Backend/EventodromoRest/Scripts/INIT_TIPO_AUDITORIA.sql` (nuevo)
