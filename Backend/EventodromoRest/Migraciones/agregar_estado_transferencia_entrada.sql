-- Script de migración para agregar campo estadoTransferencia a la tabla Entrada
-- Ejecutar en MySQL Workbench antes de probar la funcionalidad de transferencia

-- Agregar columna estadoTransferencia con valor por defecto 'disponible'
ALTER TABLE Entrada 
ADD COLUMN estadoTransferencia ENUM('disponible', 'transferida', 'pendiente') 
NOT NULL DEFAULT 'disponible'
COMMENT 'Estado de transferencia de la entrada: disponible, transferida, pendiente';

-- Crear índice para optimizar consultas por estado
CREATE INDEX idx_entrada_estado_transferencia ON Entrada(estadoTransferencia);

-- Actualizar todas las entradas existentes a 'disponible' (usando WHERE con clave primaria)
UPDATE Entrada SET estadoTransferencia = 'disponible' WHERE id > 0;

SELECT 'Migración completada exitosamente' AS resultado;
