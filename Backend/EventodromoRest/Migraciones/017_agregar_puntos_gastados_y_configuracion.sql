-- Migración 017: Agregar campos configurables y puntosGastados
-- Fecha: 2025-11-21
-- Descripción: 
--   1. Agrega puntosGastados a TransaccionPuntos para trackear puntos canjeados
--   2. Agrega parámetros configurables a la tabla configuracion:
--      - meses_vigencia_puntos: Tiempo de vida de los puntos (default 6 meses)
--      - minutos_vigencia_carrito: Tiempo de vida del carrito (default 30 minutos)

-- 1. Agregar campo puntosGastados a TransaccionPuntos
ALTER TABLE TransaccionPuntos 
ADD COLUMN puntosGastados int NOT NULL DEFAULT 0 
COMMENT 'Cantidad de puntos que se gastaron en esta transacción';

-- 2. Agregar campos configurables a la tabla configuracion
ALTER TABLE configuracion 
ADD COLUMN meses_vigencia_puntos int NOT NULL DEFAULT 6 
COMMENT 'Tiempo de vida de los puntos en meses (ej: 6 = 6 meses)';

ALTER TABLE configuracion 
ADD COLUMN minutos_vigencia_carrito int NOT NULL DEFAULT 30 
COMMENT 'Tiempo de vida del carrito en minutos (ej: 30 = 30 minutos)';

-- 3. Inicializar valores por defecto si la configuración ya existe
UPDATE configuracion 
SET meses_vigencia_puntos = 6, 
    minutos_vigencia_carrito = 30 
WHERE id = 1;

-- 4. Backfill: Calcular puntos gastados para transacciones existentes
-- Solo si existen transacciones con puntos sin el campo inicializado
-- Deshabilitar temporalmente el modo seguro para este UPDATE
SET SQL_SAFE_UPDATES = 0;

UPDATE TransaccionPuntos TP
JOIN Transaccion T ON TP.idTransaccion = T.id
JOIN (
    SELECT 
        idTransaccion, 
        CEILING(SUM(precio) / (SELECT puntos_por_sol FROM configuracion WHERE id = 1)) AS puntosCalculados
    FROM LineaTransaccion
    GROUP BY idTransaccion
) LT ON T.id = LT.idTransaccion
SET TP.puntosGastados = LT.puntosCalculados
WHERE TP.puntosGastados = 0;

-- Rehabilitar el modo seguro
SET SQL_SAFE_UPDATES = 1;
