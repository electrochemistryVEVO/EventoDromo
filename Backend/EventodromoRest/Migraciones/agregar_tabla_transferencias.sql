-- Crear tabla para trackear transferencias pendientes
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

-- Agregar columna para trackear si una entrada ya fue transferida antes
ALTER TABLE Entrada 
ADD COLUMN `vecesTransferida` INT NOT NULL DEFAULT 0;

-- Crear índice para mejorar performance
CREATE INDEX idx_veces_transferida ON Entrada(vecesTransferida);
