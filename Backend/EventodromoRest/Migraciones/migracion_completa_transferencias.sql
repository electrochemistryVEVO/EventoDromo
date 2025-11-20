-- ============================================
-- SCRIPT DE MIGRACIÓN COMPLETO
-- Sistema de Transferencia de Entradas
-- ============================================

-- PASO 1: Crear tabla TransferenciaPendiente
CREATE TABLE IF NOT EXISTS `TransferenciaPendiente` (
    `id` INT AUTO_INCREMENT NOT NULL UNIQUE,
    `token` VARCHAR(500) NOT NULL UNIQUE,
    `numeroTransaccion` VARCHAR(255) NOT NULL,
    `emailRemitente` VARCHAR(255) NOT NULL,
    `emailDestino` VARCHAR(255) NOT NULL,
    `cantidadEntradas` INT NOT NULL,
    `detalleEntradas` TEXT NOT NULL, -- JSON con los IDs de las entradas transferidas
    `estado` ENUM('pendiente', 'aceptada', 'rechazada', 'expirada') NOT NULL DEFAULT 'pendiente',
    `fechaCreacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fechaExpiracion` DATETIME NOT NULL,
    `fechaRespuesta` DATETIME NULL,
    PRIMARY KEY (`id`),
    INDEX idx_token (`token`),
    INDEX idx_email_destino (`emailDestino`),
    INDEX idx_estado (`estado`)
);

-- PASO 2: Agregar columnas a tabla Entrada (si no existen)

-- Agregar estadoTransferencia
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'Entrada' 
    AND COLUMN_NAME = 'estadoTransferencia');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE Entrada ADD COLUMN `estadoTransferencia` ENUM(''disponible'', ''transferida'', ''pendiente'') NULL DEFAULT ''disponible'';',
    'SELECT ''Column estadoTransferencia already exists'' AS Info;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar vecesTransferida
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'Entrada' 
    AND COLUMN_NAME = 'vecesTransferida');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE Entrada ADD COLUMN `vecesTransferida` INT NOT NULL DEFAULT 0;',
    'SELECT ''Column vecesTransferida already exists'' AS Info;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar idClienteActual (NUEVO - permite ver entradas transferidas)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'Entrada' 
    AND COLUMN_NAME = 'idClienteActual');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE Entrada ADD COLUMN `idClienteActual` INT NULL;',
    'SELECT ''Column idClienteActual already exists'' AS Info;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- PASO 3: Crear índices (si no existen)
CREATE INDEX IF NOT EXISTS idx_veces_transferida ON Entrada(vecesTransferida);
CREATE INDEX IF NOT EXISTS idx_cliente_actual ON Entrada(idClienteActual);
CREATE INDEX IF NOT EXISTS idx_estado_transferencia ON Entrada(estadoTransferencia);

-- PASO 4: Agregar foreign key para idClienteActual (si no existe)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'Entrada' 
    AND CONSTRAINT_NAME = 'fk_entrada_cliente_actual');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE Entrada ADD CONSTRAINT fk_entrada_cliente_actual FOREIGN KEY (idClienteActual) REFERENCES Cliente(id) ON DELETE SET NULL;',
    'SELECT ''Foreign key fk_entrada_cliente_actual already exists'' AS Info;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- PASO 5: Inicializar idClienteActual con el cliente de la transacción original
-- (Solo para entradas que aún no tienen dueño)
UPDATE Entrada E
INNER JOIN LineaTransaccion LT ON E.id = LT.idEntrada
INNER JOIN Transaccion T ON LT.idTransaccion = T.id
SET E.idClienteActual = T.idCliente
WHERE E.idClienteActual IS NULL;

-- PASO 6: Verificación final
SELECT 
    'Migración completada' AS Status,
    (SELECT COUNT(*) FROM TransferenciaPendiente) AS TransferenciasPendientes,
    (SELECT COUNT(*) FROM Entrada WHERE estadoTransferencia IS NOT NULL) AS EntradasConEstado,
    (SELECT COUNT(*) FROM Entrada WHERE idClienteActual IS NOT NULL) AS EntradasConDueño,
    (SELECT COUNT(*) FROM Entrada WHERE idClienteActual IS NULL) AS EntradasSinDueño;

-- Si ves EntradasSinDueño > 0, significa que hay entradas huérfanas (sin LineaTransaccion)
-- Esto puede pasar con datos de prueba corruptos. No es problema para el sistema.
