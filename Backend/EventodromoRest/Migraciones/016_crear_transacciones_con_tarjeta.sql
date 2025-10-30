-- =================================================================
-- TRANSACCIÓN 1 (Carrito ID: 8) - Cliente: Marce Los (id=1)
-- Compra: 2 entradas 'Campo' para Imagine Dragons.
-- =================================================================
-- 1.1: Crear la Transacción
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(3, 8, '2025-10-28 11:05:00', 'TXN0003', 'Marce Los', 'wu ah', 'marce@example.com', '932919067', 2, 1200.00);
-- 1.2: Crear las Líneas de Transacción (una por cada entrada)
INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(4, 3, 22, 600.00, 60),
(5, 3, 23, 600.00, 60);
-- 1.3: Vincular la Tarjeta
INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(2, 3, 2);

-- =================================================================
-- TRANSACCIÓN 2 (Carrito ID: 9) - Cliente: Divano Pepe (id=2)
-- Compra: 2 Platea y 1 Palco para la Ópera Carmen.
-- =================================================================
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(4, 9, '2025-10-29 09:20:00', 'TXN0004', 'Divano Pepe', 'Wai sas', 'divaniini@example.com', '70849050', 3, 420.00);

INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(6, 4, 24, 120.00, 12),
(7, 4, 25, 120.00, 12),
(8, 4, 26, 180.00, 18);

INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(3, 4, 3);

-- =================================================================
-- TRANSACCIÓN 3 (Carrito ID: 10) - Cliente: Juan Pérez (id=3)
-- Compra: 1 entrada VIP para el Concierto de Rock.
-- =================================================================
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(5, 10, '2025-10-29 15:35:00', 'TXN0005', 'Juan', 'Pérez', 'juan.perez@example.com', '12345678', 1, 130.00);

INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(9, 5, 27, 130.00, 130);

INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(4, 5, 4);

-- =================================================================
-- TRANSACCIÓN 4 (Carrito ID: 11) - Cliente: Maria López (id=4)
-- Compra: 3 entradas 'General' para Daniela Darcourt.
-- =================================================================
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(6, 11, '2025-10-30 18:00:00', 'TXN0006', 'Maria', 'López', 'maria.lopez@example.com', 'P9012345', 2, 750.00);

INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(10, 6, 28, 250.00, 25),
(11, 6, 29, 250.00, 25),
(12, 6, 30, 250.00, 25);

INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(5, 6, 5);

-- =================================================================
-- TRANSACCIÓN 5 (Carrito ID: 12) - Cliente: Luis Fonsi (id=5)
-- Compra: 2 inscripciones con Kit para la Carrera 10K.
-- =================================================================
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(7, 12, '2025-10-31 11:55:00', 'TXN0007', 'Luis Fonsi', 'Wai D', 'luisf@example.com', '70849050', 1, 180.00);

INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(13, 7, 31, 90.00, 9),
(14, 7, 32, 90.00, 9);

INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(6, 7, 6);

-- =================================================================
-- TRANSACCIÓN 6 (Carrito ID: 13) - Cliente: Juan Pérez (id=3)
-- Compra: 2 para Carrera 10K y 2 para Noches de Folklore.
-- =================================================================
INSERT INTO `Transaccion` (`id`, `idCarrito`, `fechaHoraCompra`, `numeroTransaccion`, `nombresCliente`, `apellidosCliente`, `emailCliente`, `numeroDocumentoCliente`, `idTipoDocumento`, `montoTotal`) VALUES
(8, 13, '2025-11-02 11:25:00', 'TXN0008', 'Juan', 'Pérez', 'juan.perez@example.com', '12345678', 1, 281.00);

INSERT INTO `LineaTransaccion` (`id`, `idTransaccion`, `idEntrada`, `precio`, `puntosGanados`) VALUES
(15, 8, 33, 60.00, 6),
(16, 8, 34, 60.00, 6),
(17, 8, 35, 80.50, 8),
(18, 8, 36, 80.50, 8);

INSERT INTO `TransaccionTarjeta` (`id`, `idTransaccion`, `idTarjeta`) VALUES
(7, 8, 7);