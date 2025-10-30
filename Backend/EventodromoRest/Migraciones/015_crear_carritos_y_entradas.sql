-- =================================================================
-- PASO 1: Creación de Carritos "Perdidos" o "Expirados"
-- Estos solo existen en la tabla Carrito para rellenar IDs.
-- =================================================================
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(1, 10, '2025-10-25 10:10:00', '2025-10-25 10:00:00'),
(2, 11, '2025-10-26 14:30:00', '2025-10-26 14:20:00');


-- =================================================================
-- PASO 2: Creación de 5 Compras Completadas (Carrito + Entradas + Update Stock)
-- =================================================================

-- COMPRA 1: Cliente 'Marce Los' (id=1)
-- Compra: 2 entradas 'Campo' para Imagine Dragons.
-- Evento: Imagine Dragons (idEvento=8) -> FechaEvento ID: 14 -> TipoEntrada 'Campo' ID: 29
-- -----------------------------------------------------------------
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(8, 1, '2025-10-28 11:10:00', '2025-10-28 11:00:00');

INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
(22, 8, 29),
(23, 8, 29);

UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 2 WHERE `id` = 29;


-- COMPRA 2: Cliente 'Divano Pepe' (id=2)
-- Compra: 3 entradas para la Ópera Carmen (2 Platea, 1 Palco) para la misma función.
-- Evento: Carmen Ópera (idEvento=4) -> FechaEvento ID: 6 -> TipoEntrada 'Platea' ID: 12, 'Palco' ID: 13
-- -----------------------------------------------------------------
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(9, 2, '2025-10-29 09:25:00', '2025-10-29 09:15:00');

INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
(24, 8, 12),
(25, 8, 12),
(26, 8, 13);

UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 2 WHERE `id` = 12;
UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 1 WHERE `id` = 13;


-- COMPRA 3: Cliente 'Juan Pérez' (id=3)
-- Compra: 1 entrada 'VIP' para el Concierto de Rock genérico.
-- Evento: Concierto Banda Rock (idEvento=1) -> FechaEvento ID: 2 -> TipoEntrada 'VIP' ID: 4
-- -----------------------------------------------------------------
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(10, 3, '2025-10-29 15:40:00', '2025-10-29 15:30:00');

INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
(27, 9, 4);

UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 1 WHERE `id` = 4;


-- COMPRA 4: Cliente 'Maria López' (id=4)
-- Compra: 3 entradas 'General' para Daniela Darcourt.
-- Evento: Daniela Darcourt (idEvento=6) -> FechaEvento ID: 12 -> TipoEntrada 'General' ID: 22
-- -----------------------------------------------------------------
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(11, 4, '2025-10-30 18:05:00', '2025-10-30 17:55:00');

INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
(28, 10, 22),
(29, 10, 22),
(30, 10, 22);

UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 3 WHERE `id` = 22;


-- COMPRA 5: Cliente 'Luis Fonsi' (id=5)
-- Compra: 2 inscripciones con Kit para la Carrera 10K.
-- Evento: Carrera 10K (idEvento=9) -> FechaEvento ID: 15 -> TipoEntrada 'Inscripción con Kit' ID: 32
-- -----------------------------------------------------------------
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(12, 5, '2025-10-31 12:00:00', '2025-10-31 11:50:00');

INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
(31, 11, 32),
(32, 11, 32);

UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 2 WHERE `id` = 32;

-- =================================================================
-- COMPRA 6: Cliente 'Juan Pérez' (id=3) - Compra MULTI-EVENTO
-- Compra:
--   - Evento 1: 2 entradas "Inscripción General" para la Carrera 10K.
--   - Evento 2: 2 entradas "General" para Noches de Folklore.
-- =================================================================

-- 6.1: Creamos un nuevo carrito para esta transacción (continuando la numeración)
INSERT INTO `Carrito` (`id`, `idCliente`, `fechaExpiracion`, `fechaCreacion`) VALUES
(13, 3, '2025-11-02 11:30:00', '2025-11-02 11:20:00');

-- 6.2: Añadimos las entradas de AMBOS eventos al MISMO carrito (continuando la numeración)
INSERT INTO `Entrada` (`id`, `idCarrito`, `idTipoEntrada`) VALUES
-- Entradas para la Carrera 10K (TipoEntrada ID: 31)
(33, 13, 31),
(34, 13, 31),
-- Entradas para Noches de Folklore (TipoEntrada ID: 8)
(35, 13, 8),
(36, 13, 8);

-- 6.3: Actualizamos el stock para los tipos de entrada de ambos eventos
UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 2 WHERE `id` = 31;
UPDATE `TipoEntrada` SET `cantidadVendida` = `cantidadVendida` + 2 WHERE `id` = 8;