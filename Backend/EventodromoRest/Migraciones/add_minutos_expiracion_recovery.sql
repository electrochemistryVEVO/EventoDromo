-- Migración: Agregar columna minutos_expiracion_recovery a la tabla configuracion
-- Descripción: Esta columna define el tiempo de vida del token de recuperación de contraseña en minutos
-- Fecha: 2025-01-28

-- 1. Agregar la columna con valor por defecto de 60 minutos (1 hora)
ALTER TABLE `configuracion` 
ADD COLUMN `minutos_expiracion_recovery` INT NOT NULL DEFAULT 60 
COMMENT 'Tiempo de vigencia del token de recuperación de contraseña en minutos (ej: 60 = 1 hora)';

-- 2. Verificar que la columna se agregó correctamente
SELECT * FROM configuracion;
