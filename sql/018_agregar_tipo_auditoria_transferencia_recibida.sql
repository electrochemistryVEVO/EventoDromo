-- =====================================================================
-- Migración 018: Agregar tipo de auditoría "Transferencia Recibida"
-- =====================================================================
-- Descripción: 
--   Esta migración agrega el tipo de auditoría 6 (Transferencia Recibida)
--   para registrar cuando un usuario recibe entradas transferidas.
--   
-- Fecha: 2025-11-21
-- Autor: Sistema EventoDromo
-- =====================================================================

USE eventodromo;

-- Insertar el nuevo tipo de auditoría
INSERT INTO TipoAuditoria (id, nombre, descripcion) 
VALUES (6, 'Transferencia Recibida', 'Registro cuando un cliente recibe entradas transferidas por otro usuario')
ON DUPLICATE KEY UPDATE 
    nombre = 'Transferencia Recibida',
    descripcion = 'Registro cuando un cliente recibe entradas transferidas por otro usuario';

-- Verificar la inserción
SELECT * FROM TipoAuditoria WHERE id = 6;

-- =====================================================================
-- Fin de la migración
-- =====================================================================
