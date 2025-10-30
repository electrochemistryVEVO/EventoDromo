INSERT INTO `Cliente` (`id`, `nombres`, `apellidos`, `email`, `passwordHash`, `fechaNacimiento`, `idSexo`, `idTipoDocumento`, `numeroDocumento`, `telefono`, `idCiudad`, `politicaDePrivacidad`, `envioDePublicidad`, `fechaCreacion`, `fechaUltimaEdicion`, `fechaUltimaSesion`) VALUES
-- Clientes que proporcionaste
(1, 'Marce Los', 'wu ah', 'marce@example.com', '123', '2025-10-23', 2, 2, '932919067', '970849050', 3, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(2, 'Divano Pepe', 'Wai sas', 'divaniini@example.com', '12345', '2025-10-02', 3, 3, '70849050', '932919067', 3, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(3, 'Juan', 'Pérez', 'juan.perez@example.com', 'Cliente1@', '1990-05-15', 1, 1, '12345678', '993378212', 2, b'1', b'1', '2025-09-01', '2025-10-25', '2025-09-25'),
(4, 'Maria', 'López', 'maria.lopez@example.com', 'hashed_cliente2', '1995-10-20', 2, 2, 'P9012345', '999888777', 3, b'1', b'0', '2025-09-10', NULL, '2025-09-28'),
(5, 'Luis Fonsi', 'Wai D', 'luisf@example.com', '12345', '2025-10-14', 1, 1, '70849050', '932919067', 1, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(6, 'Prueba', 'Probando', 'prueba.prueba@test.com', '123', '1990-05-15', 1, 1, '12345678', '5551234567', 1, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(7, 'Elena', 'Gomez', 'nuevo.user@test.com', 'MiClave123', '1995-10-25', 1, 1, '987654321', '3001234567', 1, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(8, 'PruebaTres', 'Probando', 'prueba.prueba3@test.com', '123', '1990-05-15', 1, 1, '12345678', '5551234567', 1, b'1', b'0', '2025-10-26', '2025-10-26', NULL),
(9, 'Prueba', 'Probando', 'prueba.prueba2@test.com', '123', '1990-05-15', 1, 1, '12345678', '5551234567', 1, b'1', b'0', '2025-10-26', '2025-10-26', NULL),

-- Clientes nuevos para completar hasta 15
(10, 'Roberto', 'Diaz', 'roberto.diaz@email.com', 'hashed_roberto', '1988-07-12', 1, 1, '45678901', '911223344', 5, b'1', b'1', '2025-10-27', NULL, NULL),
(11, 'Sofia', 'Vargas', 'sofia.vargas@email.com', 'hashed_sofia', '1999-01-30', 2, 1, '56789012', '922334455', 4, b'1', b'0', '2025-10-28', NULL, NULL),
(12, 'Andres', 'Castro', 'andres.castro@email.com', 'hashed_andres', '1993-06-18', 1, 2, 'A1234567', '933445566', 10, b'1', b'1', '2025-10-29', NULL, NULL),
(13, 'Camila', 'Reyes', 'camila.reyes@email.com', 'hashed_camila', '2001-09-05', 2, 1, '67890123', '944556677', 1, b'1', b'0', '2025-11-01', NULL, NULL),
(14, 'Jorge', 'Molina', 'jorge.molina@email.com', 'hashed_jorge', '1980-12-25', 1, 1, '78901234', '955667788', 2, b'1', b'1', '2025-11-02', NULL, NULL),
(15, 'Valeria', 'Ortega', 'valeria.ortega@email.com', 'hashed_valeria', '1997-04-14', 2, 3, 'C8901234', '966778899', 3, b'1', b'0', '2025-11-05', NULL, NULL);