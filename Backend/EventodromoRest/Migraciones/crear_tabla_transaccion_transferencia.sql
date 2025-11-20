-- =====================================================
-- MIGRACIÓN: Sistema de Transacciones por Transferencia
-- Propósito: Crear transacciones nuevas para entradas transferidas
--            para que el destinatario vea solo SUS entradas, no todas
-- =====================================================

-- 1. Crear tabla TransaccionTransferencia
CREATE TABLE IF NOT EXISTS TransaccionTransferencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idTransaccion INT NOT NULL,
    idTransferenciaPendiente INT NOT NULL,
    
    CONSTRAINT fk_transaccion_transferencia_transaccion 
        FOREIGN KEY (idTransaccion) REFERENCES Transaccion(id),
    CONSTRAINT fk_transaccion_transferencia_pendiente 
        FOREIGN KEY (idTransferenciaPendiente) REFERENCES TransferenciaPendiente(id),
    
    INDEX idx_transaccion (idTransaccion),
    INDEX idx_transferencia (idTransferenciaPendiente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Verificación
SELECT 
    'TransaccionTransferencia' AS tabla,
    COUNT(*) AS registros_existentes
FROM TransaccionTransferencia;

-- Nota: El backend creará automáticamente una nueva Transaccion cuando se acepte
-- una transferencia, y luego vinculará esa transacción con la transferencia
-- mediante esta tabla TransaccionTransferencia.
