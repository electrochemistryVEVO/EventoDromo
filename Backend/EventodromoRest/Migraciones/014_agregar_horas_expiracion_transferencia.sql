-- Migración: Agregar configuración para horas de expiración de transferencias
-- Fecha: 2025-11-25
-- Descripción: Agrega el campo horas_expiracion_transferencia a la tabla configuracion

ALTER TABLE configuracion 
ADD COLUMN horas_expiracion_transferencia INT NOT NULL DEFAULT 24 
COMMENT 'Tiempo de expiracion de transferencias en horas (ej: 24 = 24 horas)';

