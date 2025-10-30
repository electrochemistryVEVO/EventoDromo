INSERT INTO `Auditoria` (`id`, `idCliente`, `idTipoAuditoria`, `descripcion`, `fechaHora`, `monto`) VALUES

-- =================================================================
-- 1. AUDITORÍAS DE COMPRA (Basadas en las transacciones)
-- =================================================================
-- Transacción de Marce Los (id=1)
(1, 1, 1, 'Compra de 2 entradas para "Imagine Dragons"', '2025-10-28 11:05:00', 1200.00),
-- Transacción de Divano Pepe (id=2)
(2, 2, 1, 'Compra de 3 entradas para "Carmen Ópera de Georges Bizet"', '2025-10-29 09:20:00', 420.00),
-- Primera transacción de Juan Pérez (id=3)
(3, 3, 1, 'Compra de 1 entrada para "Concierto Banda Rock"', '2025-10-29 15:35:00', 130.00),
-- Transacción de Maria López (id=4)
(4, 4, 1, 'Compra de 3 entradas para "Daniela Darcourt"', '2025-10-30 18:00:00', 750.00),
-- Transacción de Luis Fonsi (id=5)
(5, 5, 1, 'Compra de 2 entradas para "Carrera 10 Kilómetros"', '2025-10-31 11:55:00', 180.00),
-- Segunda transacción de Juan Pérez (id=3)
(6, 3, 1, 'Compra de 4 entradas en transacción TXN0008', '2025-11-02 11:25:00', 281.00),
-- Compra del primer cliente (ya existente en tu BD)
(7, 3, 1, 'Compra de 2 entradas para "Concierto Banda Rock"', '2025-09-29 11:45:00', 100.00),

-- =================================================================
-- 2. AUDITORÍAS DE ACTUALIZACIÓN DE PERFIL
-- =================================================================
(8, 3, 3, 'Actualización de número de teléfono', '2025-10-08 10:15:00', NULL),
(9, 4, 3, 'Actualización de correo electrónico', '2025-10-15 20:00:00', NULL),
(10, 10, 3, 'Actualización de contraseña', '2025-10-27 18:30:00', NULL),

-- =================================================================
-- 3. AUDITORÍAS DE INICIO DE SESIÓN (3-4 por cada cliente)
-- =================================================================
-- Cliente 1
(11, 1, 5, 'Inicio de sesión exitoso', '2025-10-28 10:58:00', NULL),
(12, 1, 5, 'Inicio de sesión exitoso', '2025-10-29 13:00:00', NULL),
(13, 1, 5, 'Inicio de sesión exitoso', '2025-11-01 09:15:00', NULL),
-- Cliente 2
(14, 2, 5, 'Inicio de sesión exitoso', '2025-10-29 09:12:00', NULL),
(15, 2, 5, 'Inicio de sesión exitoso', '2025-10-30 11:00:00', NULL),
(16, 2, 5, 'Inicio de sesión exitoso', '2025-11-02 14:20:00', NULL),
-- Cliente 3
(17, 3, 5, 'Inicio de sesión exitoso', '2025-10-29 15:28:00', NULL),
(18, 3, 5, 'Inicio de sesión exitoso', '2025-11-01 17:00:00', NULL),
(19, 3, 5, 'Inicio de sesión exitoso', '2025-11-02 11:23:00', NULL),
(20, 3, 5, 'Inicio de sesión exitoso', '2025-11-03 08:00:00', NULL),
-- Cliente 4
(21, 4, 5, 'Inicio de sesión exitoso', '2025-10-30 17:53:00', NULL),
(22, 4, 5, 'Inicio de sesión exitoso', '2025-10-31 19:00:00', NULL),
(23, 4, 5, 'Inicio de sesión exitoso', '2025-11-01 21:00:00', NULL),
-- Cliente 5
(24, 5, 5, 'Inicio de sesión exitoso', '2025-10-31 11:48:00', NULL),
(25, 5, 5, 'Inicio de sesión exitoso', '2025-11-01 10:00:00', NULL),
(26, 5, 5, 'Inicio de sesión exitoso', '2025-11-03 12:30:00', NULL),
-- Cliente 6
(27, 6, 5, 'Inicio de sesión exitoso', '2025-10-26 10:00:00', NULL),
(28, 6, 5, 'Inicio de sesión exitoso', '2025-10-27 11:00:00', NULL),
(29, 6, 5, 'Inicio de sesión exitoso', '2025-10-28 12:00:00', NULL),
-- Cliente 7
(30, 7, 5, 'Inicio de sesión exitoso', '2025-10-29 13:00:00', NULL),
(31, 7, 5, 'Inicio de sesión exitoso', '2025-10-30 14:00:00', NULL),
(32, 7, 5, 'Inicio de sesión exitoso', '2025-10-31 15:00:00', NULL),
-- Cliente 8
(33, 8, 5, 'Inicio de sesión exitoso', '2025-11-01 16:00:00', NULL),
(34, 8, 5, 'Inicio de sesión exitoso', '2025-11-02 17:00:00', NULL),
(35, 8, 5, 'Inicio de sesión exitoso', '2025-11-03 18:00:00', NULL),
-- Cliente 9
(36, 9, 5, 'Inicio de sesión exitoso', '2025-10-27 09:30:00', NULL),
(37, 9, 5, 'Inicio de sesión exitoso', '2025-10-29 11:45:00', NULL),
(38, 9, 5, 'Inicio de sesión exitoso', '2025-11-01 14:00:00', NULL),
-- Cliente 10
(39, 10, 5, 'Inicio de sesión exitoso', '2025-10-27 18:25:00', NULL),
(40, 10, 5, 'Inicio de sesión exitoso', '2025-10-28 20:00:00', NULL),
(41, 10, 5, 'Inicio de sesión exitoso', '2025-11-02 22:00:00', NULL),
-- Cliente 11
(42, 11, 5, 'Inicio de sesión exitoso', '2025-10-28 08:00:00', NULL),
(43, 11, 5, 'Inicio de sesión exitoso', '2025-10-30 08:30:00', NULL),
(44, 11, 5, 'Inicio de sesión exitoso', '2025-11-03 09:00:00', NULL),
-- Cliente 12
(45, 12, 5, 'Inicio de sesión exitoso', '2025-10-29 10:10:00', NULL),
(46, 12, 5, 'Inicio de sesión exitoso', '2025-11-01 11:15:00', NULL),
(47, 12, 5, 'Inicio de sesión exitoso', '2025-11-02 12:20:00', NULL),
-- Cliente 13
(48, 13, 5, 'Inicio de sesión exitoso', '2025-11-01 19:00:00', NULL),
(49, 13, 5, 'Inicio de sesión exitoso', '2025-11-02 20:00:00', NULL),
(50, 13, 5, 'Inicio de sesión exitoso', '2025-11-03 21:00:00', NULL),
-- Cliente 14
(51, 14, 5, 'Inicio de sesión exitoso', '2025-11-02 07:00:00', NULL),
(52, 14, 5, 'Inicio de sesión exitoso', '2025-11-03 07:30:00', NULL),
(53, 14, 5, 'Inicio de sesión exitoso', '2025-11-04 08:00:00', NULL),
-- Cliente 15
(54, 15, 5, 'Inicio de sesión exitoso', '2025-11-05 15:00:00', NULL),
(55, 15, 5, 'Inicio de sesión exitoso', '2025-11-06 16:00:00', NULL),
(56, 15, 5, 'Inicio de sesión exitoso', '2025-11-07 17:00:00', NULL);