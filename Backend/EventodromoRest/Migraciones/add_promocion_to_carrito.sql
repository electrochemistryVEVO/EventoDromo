-- Migración: Agregar soporte de promociones a la tabla Carrito
-- Fecha: 2025-11-30
-- Descripción: Permite asociar una promoción activa a cada carrito y guardar el monto de descuento calculado

-- Agregar columnas para el descuento
ALTER TABLE Carrito 
ADD COLUMN idPromocionAplicada INT NULL COMMENT 'ID de la promoción actualmente aplicada al carrito',
ADD COLUMN montoDescuento DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Monto del descuento calculado en soles';

-- Agregar foreign key
ALTER TABLE Carrito
ADD CONSTRAINT fk_carrito_promocion 
FOREIGN KEY (idPromocionAplicada) REFERENCES Promocion(id) ON DELETE SET NULL;

-- Crear índice para mejorar performance de consultas
CREATE INDEX idx_carrito_promocion ON Carrito(idPromocionAplicada);
