-- =================================================================
-- Migración: Agregar campos de descuento y cliente a tabla Transaccion
-- Descripción: Permite almacenar información del descuento directamente 
-- en la transacción para mantener el historial incluso después de 
-- limpiar/expirar el carrito.
-- =================================================================

-- Agregar columna idCliente (MySQL no soporta IF NOT EXISTS en ALTER TABLE)
-- Si la columna ya existe, este comando fallará pero no afectará la BD
ALTER TABLE `Transaccion` 
ADD COLUMN `idCliente` INT NULL DEFAULT NULL;

-- Agregar columna subtotal (monto antes de descuento)
ALTER TABLE `Transaccion` 
ADD COLUMN `subtotal` DECIMAL(10,2) NULL DEFAULT 0.00;

-- Agregar columna montoDescuento (cantidad descontada)
ALTER TABLE `Transaccion` 
ADD COLUMN `montoDescuento` DECIMAL(10,2) NULL DEFAULT 0.00;

-- Agregar columna idPromocionAplicada (referencia a la promoción usada)
ALTER TABLE `Transaccion` 
ADD COLUMN `idPromocionAplicada` INT NULL DEFAULT NULL;

-- Crear índice para mejorar búsquedas por promoción
CREATE INDEX `idx_transaccion_promocion` ON `Transaccion`(`idPromocionAplicada`);

-- Agregar foreign key para idCliente
ALTER TABLE `Transaccion`
ADD CONSTRAINT `fk_transaccion_cliente`
FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`)
ON DELETE SET NULL;

-- Agregar foreign key para idPromocionAplicada
ALTER TABLE `Transaccion`
ADD CONSTRAINT `fk_transaccion_promocion`
FOREIGN KEY (`idPromocionAplicada`) REFERENCES `Promocion`(`id`)
ON DELETE SET NULL;
