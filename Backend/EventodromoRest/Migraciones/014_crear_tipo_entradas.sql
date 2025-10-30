INSERT INTO `TipoEntrada` (`precio`, `limiteCompra`, `puntos`, `nombre`, `cantidadEntradas`, `cantidadVendida`, `idFechaEvento`, `id`) VALUES
(50.00, 5, 50, 'General 15 Nov', 1000, 0, 1, 1),
(120.00, 2, 120, 'VIP 15 Nov', 200, 0, 1, 2),
(55.00, 5, 55, 'General 16 Nov', 1000, 0, 2, 3),
(130.00, 2, 130, 'VIP 16 Nov', 200, 0, 2, 4),

-- ================== Evento: Festival Overpass Lima (idEvento=2) ==================
-- Local: Estadio Nacional (Capacidad: 50000) | Fecha Evento ID: 3
(150.00, 8, 15, 'General - 29 Nov', 5000, 0, 3, 5),
(280.00, 5, 28, 'VIP - 29 Nov', 1500, 0, 3, 6),
(450.00, 5, 45, 'Platinum - 29 Nov', 500, 0, 3, 7),

-- ================== Evento: Noches de Folklore (idEvento=3) ==================
-- Local: Centro de Convenciones de Cusco (Capacidad: 1000) | Fecha Evento IDs: 4, 5
-- Fecha 1
(80.50, 10, 8, 'General - 28 Nov', 250, 0, 4, 8),
(120.00, 8, 12, 'Preferencial - 28 Nov', 100, 0, 4, 9),
-- Fecha 2
(80.50, 10, 8, 'General - 29 Nov', 250, 0, 5, 10),
(120.00, 8, 12, 'Preferencial - 29 Nov', 100, 0, 5, 11),

-- ================== Evento: Carmen Ópera (idEvento=4) ==================
-- Local: Gran Teatro Nacional (Capacidad: 1500) | Fecha Evento IDs: 6, 7, 8, 9
-- Fecha 1 (04 Dic)
(120.00, 10, 12, 'Platea - 04 Dic', 400, 0, 6, 12),
(180.00, 8, 18, 'Palco - 04 Dic', 150, 0, 6, 13),
-- Fecha 2 (05 Dic)
(120.00, 10, 12, 'Platea - 05 Dic', 400, 0, 7, 14),
(180.00, 8, 18, 'Palco - 05 Dic', 150, 0, 7, 15),
-- Fecha 3 (06 Dic)
(120.00, 10, 12, 'Platea - 06 Dic', 400, 0, 8, 16),
(180.00, 8, 18, 'Palco - 06 Dic', 150, 0, 8, 17),
-- Fecha 4 (07 Dic)
(120.00, 10, 12, 'Platea - 07 Dic', 400, 0, 9, 18),
(180.00, 8, 18, 'Palco - 07 Dic', 150, 0, 9, 19),

-- ================== Evento: Tour + Museo Monumental (idEvento=5) ==================
-- Local: Estadio Nacional (Capacidad: 50000) | Fecha Evento IDs: 10, 11
-- Fecha 1
(50.00, 10, 5, 'Entrada General - 27 Nov', 300, 0, 10, 20),
-- Fecha 2
(50.00, 10, 5, 'Entrada General - 28 Nov', 300, 0, 11, 21),

-- ================== Evento: Daniela Darcourt (idEvento=6) ==================
-- Local: Anfiteatro del Parque de la Exposición (Capacidad: 4800) | Fecha Evento ID: 12
(250.00, 8, 25, 'General - 13 Dic', 1000, 0, 12, 22),
(400.00, 5, 40, 'VIP - 13 Dic', 400, 0, 12, 23),
(600.00, 5, 60, 'Golden - 13 Dic', 200, 0, 12, 24),

-- ================== Evento: Linkin Park (idEvento=7) ==================
-- Local: Estadio Nacional (Capacidad: 50000) | Fecha Evento ID: 13
(350.00, 8, 35, 'Campo B - 19 Dic', 8000, 0, 13, 25),
(550.00, 5, 55, 'Campo A - 19 Dic', 4000, 0, 13, 26),
(750.00, 5, 75, 'Golden Circle - 19 Dic', 1500, 0, 13, 27),

-- ================== Evento: Imagine Dragons (idEvento=8) ==================
-- Local: Estadio Nacional (Capacidad: 50000) | Fecha Evento ID: 14
(400.00, 8, 40, 'Tribuna - 21 Dic', 10000, 0, 14, 28),
(600.00, 5, 60, 'Campo - 21 Dic', 5000, 0, 14, 29),
(850.00, 5, 85, 'Zona Platinum - 21 Dic', 2000, 0, 14, 30),

-- ================== Evento: Carrera 10 Kilómetros (idEvento=9) ==================
-- Local: Arena 1 Costa Verde (Capacidad: 16000) | Fecha Evento ID: 15
(60.00, 10, 6, 'Inscripción General - 30 Nov', 1000, 0, 15, 31),
(90.00, 10, 9, 'Inscripción con Kit - 30 Nov', 500, 0, 15, 32),

-- ================== Evento: Rimac Sports Festival (idEvento=10) ==================
-- Local: Arena 1 Costa Verde (Capacidad: 16000) | Fecha Evento ID: 16
(90.00, 10, 9, 'Entrada General - 07 Dic', 2000, 0, 16, 33),

-- ================== Evento: Marinera y Show Peruano (idEvento=11) ==================
-- Local: Gran Teatro Nacional (Capacidad: 1500) | Fecha Evento IDs: 17, 18
-- Fecha 1 (19:00)
(100.00, 10, 10, 'General - 12 Dic 7pm', 300, 0, 17, 34),
(150.00, 8, 15, 'VIP - 12 Dic 7pm', 100, 0, 17, 35),
-- Fecha 2 (21:00)
(100.00, 10, 10, 'General - 12 Dic 9pm', 300, 0, 18, 36),
(150.00, 8, 15, 'VIP - 12 Dic 9pm', 100, 0, 18, 37);