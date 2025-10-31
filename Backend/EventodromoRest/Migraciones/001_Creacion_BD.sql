CREATE TABLE IF NOT EXISTS `Cliente` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombres` varchar(255) NOT NULL,
	`apellidos` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL UNIQUE,
	`passwordHash` varchar(255) NOT NULL,
	`fechaNacimiento` date NOT NULL,
	`idSexo` int,
	`idTipoDocumento` int NOT NULL,
	`numeroDocumento` varchar(255) NOT NULL,
	`telefono` varchar(255),
	`idCiudad` int,
	`politicaDePrivacidad` bit(1) NOT NULL,
	`envioDePublicidad` bit(1),
	`fechaCreacion` date NOT NULL,
	`fechaUltimaEdicion` date,
	`fechaUltimaSesion` date,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Sexo` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TipoDocumento` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Ciudad` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	`idPais` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Pais` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Auditoria` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idCliente` int NOT NULL,
	`idTipoAuditoria` int NOT NULL,
	`descripcion` varchar(255) NOT NULL,
	`fechaHora` datetime NOT NULL,
	`monto` decimal(10,2),
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TipoAuditoria` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	`iconoURL` varchar(255) NOT NULL,
	`color` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Administrador` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombres` varchar(255) NOT NULL,
	`apellidos` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL UNIQUE,
	`passwordHash` varchar(255) NOT NULL,
	`fechaCreacion` date NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Local` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	`idCiudad` int NOT NULL,
	`direccion` varchar(255) NOT NULL UNIQUE,
	`capacidad` int NOT NULL,
	`isDeleted` bit(1) NOT NULL,
	`creadoPor` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Evento` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	`descripcion` varchar(255) NOT NULL,
	`idTipoEvento` int NOT NULL,
	`idLocal` int NOT NULL,
	`creadoPor` int NOT NULL,
	`fechaPublicacion` datetime NOT NULL,
	`fechaCompra` datetime NOT NULL,
	`isDeleted` bit(1) NOT NULL,
	`imagenURL` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `FechaEvento` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`fechaHora` datetime NOT NULL,
	`idEvento` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TipoEvento` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `EliminarEvento` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idEvento` int NOT NULL UNIQUE,
	`fechaEliminacion` datetime NOT NULL,
	`fechaEliminacionReal` datetime NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TipoEntrada` (
	`precio` decimal(10,2) NOT NULL,
	`limiteCompra` int NOT NULL,
	`puntos` int NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`cantidadEntradas` int NOT NULL,
	`cantidadVentida` int NOT NULL,
	`idFechaEvento` int NOT NULL,
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Carrito` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idCliente` int NOT NULL,
	`fechaExpiracion` datetime NOT NULL,
	`fechaCreacion` datetime NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Entrada` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idCarrito` int NOT NULL,
	`idTipoEntrada` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Transaccion` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idCarrito` int NOT NULL,
	`fechaHoraCompra` datetime NOT NULL,
	`numeroTransaccion` varchar(255) NOT NULL,
	`nombresCliente` varchar(255) NOT NULL,
	`apellidosCliente` varchar(255) NOT NULL,
	`emailCliente` varchar(255) NOT NULL,
	`numeroDocumentoCliente` varchar(255) NOT NULL,
	`idTipoDocumento` int NOT NULL,
	`montoTotal` decimal(10,2) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `LineaTransaccion` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idTransaccion` int NOT NULL,
	`idEntrada` int NOT NULL,
	`precio` decimal(10,2) NOT NULL,
	`puntosGanados` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Punto` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`cantidad` int NOT NULL,
	`fechaHoraRegistro` datetime NOT NULL,
	`idCliente` int NOT NULL,
	`fechaExpiracion` datetime NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TransaccionTarjeta` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idTransaccion` int NOT NULL,
	`idTarjeta` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TransaccionPuntos` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`idTransaccion` int NOT NULL,
	`idCliente` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Tarjeta` (
	`numero` varchar(255) NOT NULL,
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_fk6` FOREIGN KEY (`idSexo`) REFERENCES `Sexo`(`id`);

ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_fk7` FOREIGN KEY (`idTipoDocumento`) REFERENCES `TipoDocumento`(`id`);

ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_fk10` FOREIGN KEY (`idCiudad`) REFERENCES `Ciudad`(`id`);


ALTER TABLE `Ciudad` ADD CONSTRAINT `Ciudad_fk2` FOREIGN KEY (`idPais`) REFERENCES `Pais`(`id`);

ALTER TABLE `Auditoria` ADD CONSTRAINT `Auditoria_fk1` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`);

ALTER TABLE `Auditoria` ADD CONSTRAINT `Auditoria_fk2` FOREIGN KEY (`idTipoAuditoria`) REFERENCES `TipoAuditoria`(`id`);


ALTER TABLE `Local` ADD CONSTRAINT `Local_fk2` FOREIGN KEY (`idCiudad`) REFERENCES `Ciudad`(`id`);

ALTER TABLE `Local` ADD CONSTRAINT `Local_fk6` FOREIGN KEY (`creadoPor`) REFERENCES `Administrador`(`id`);
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_fk3` FOREIGN KEY (`idTipoEvento`) REFERENCES `TipoEvento`(`id`);

ALTER TABLE `Evento` ADD CONSTRAINT `Evento_fk4` FOREIGN KEY (`idLocal`) REFERENCES `Local`(`id`);

ALTER TABLE `Evento` ADD CONSTRAINT `Evento_fk5` FOREIGN KEY (`creadoPor`) REFERENCES `Administrador`(`id`);
ALTER TABLE `FechaEvento` ADD CONSTRAINT `FechaEvento_fk2` FOREIGN KEY (`idEvento`) REFERENCES `Evento`(`id`);

ALTER TABLE `EliminarEvento` ADD CONSTRAINT `EliminarEvento_fk1` FOREIGN KEY (`idEvento`) REFERENCES `Evento`(`id`);
ALTER TABLE `TipoEntrada` ADD CONSTRAINT `TipoEntrada_fk6` FOREIGN KEY (`idFechaEvento`) REFERENCES `FechaEvento`(`id`);
ALTER TABLE `Carrito` ADD CONSTRAINT `Carrito_fk1` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`);
ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_fk1` FOREIGN KEY (`idCarrito`) REFERENCES `Carrito`(`id`);

ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_fk2` FOREIGN KEY (`idTipoEntrada`) REFERENCES `TipoEntrada`(`id`);
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_fk1` FOREIGN KEY (`idCarrito`) REFERENCES `Carrito`(`id`);

ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_fk9` FOREIGN KEY (`idTipoDocumento`) REFERENCES `TipoDocumento`(`id`);
ALTER TABLE `LineaTransaccion` ADD CONSTRAINT `LineaTransaccion_fk1` FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`);

ALTER TABLE `LineaTransaccion` ADD CONSTRAINT `LineaTransaccion_fk2` FOREIGN KEY (`idEntrada`) REFERENCES `Entrada`(`id`);
ALTER TABLE `Punto` ADD CONSTRAINT `Punto_fk3` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`);
ALTER TABLE `TransaccionTarjeta` ADD CONSTRAINT `TransaccionTarjeta_fk1` FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`);

ALTER TABLE `TransaccionTarjeta` ADD CONSTRAINT `TransaccionTarjeta_fk2` FOREIGN KEY (`idTarjeta`) REFERENCES `Tarjeta`(`id`);
ALTER TABLE `TransaccionPuntos` ADD CONSTRAINT `TransaccionPuntos_fk1` FOREIGN KEY (`idTransaccion`) REFERENCES `Transaccion`(`id`);

ALTER TABLE `TransaccionPuntos` ADD CONSTRAINT `TransaccionPuntos_fk2` FOREIGN KEY (`idCliente`) REFERENCES `Cliente`(`id`);
