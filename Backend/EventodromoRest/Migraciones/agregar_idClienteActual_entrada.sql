-- Agregar columna para trackear el dueño actual de la entrada (permite transferencias)
ALTER TABLE Entrada 
ADD COLUMN `idClienteActual` INT NULL,
ADD CONSTRAINT fk_entrada_cliente_actual 
    FOREIGN KEY (idClienteActual) REFERENCES Cliente(id) 
    ON DELETE SET NULL;

-- Crear índice para mejorar performance en búsquedas por cliente actual
CREATE INDEX idx_cliente_actual ON Entrada(idClienteActual);

-- Inicializar idClienteActual con el cliente de la transacción original
UPDATE Entrada E
INNER JOIN LineaTransaccion LT ON E.id = LT.idEntrada
INNER JOIN Transaccion T ON LT.idTransaccion = T.id
SET E.idClienteActual = T.idCliente
WHERE E.idClienteActual IS NULL;

-- Verificar que todas las entradas tengan un dueño
-- SELECT COUNT(*) FROM Entrada WHERE idClienteActual IS NULL;
