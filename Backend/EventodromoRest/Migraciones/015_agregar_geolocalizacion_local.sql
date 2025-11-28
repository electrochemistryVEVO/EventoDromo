-- Migración: Agregar campos de geolocalización para Google Maps
-- Fecha: 2025-11-25
-- Descripción: Agrega latitud, longitud y URL de Google Maps a la tabla Local

ALTER TABLE Local 
ADD latitud DECIMAL(10, 8) DEFAULT NULL COMMENT 'Latitud del local (-90 a +90)',
ADD longitud DECIMAL(11, 8) DEFAULT NULL COMMENT 'Longitud del local (-180 a +180)',
ADD googleMapsUrl VARCHAR(500) DEFAULT NULL COMMENT 'URL directa de Google Maps para el local';

-- Crear índice para búsquedas geoespaciales futuras (opcional)
CREATE INDEX idx_local_coordenadas ON Local(latitud, longitud);
