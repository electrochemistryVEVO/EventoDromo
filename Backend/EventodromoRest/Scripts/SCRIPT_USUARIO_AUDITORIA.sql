DROP TABLE IF EXISTS USUARIO;
DROP TABLE IF EXISTS AUDITORIA_UPDATE;
DROP TABLE IF EXISTS AUDITORIA_INSERT;
DROP TABLE IF EXISTS AUDITORIA_DELETE;

CREATE TABLE USUARIO (
    ID INT AUTO_INCREMENT PRIMARY KEY,                      -- Identificador único del usuario
    CORREO VARCHAR(255) UNIQUE NOT NULL,                     -- Correo electrónico del usuario (único)
    CONTRASENA VARCHAR(255) NOT NULL,                         -- Contraseña del usuario (encriptada o con hash)
    ROL INT NOT NULL,                                     -- Rol del usuairo
    NOMBRES VARCHAR(255) NOT NULL,                            -- Nombres del usuario
    APELLIDOS VARCHAR(255) NOT NULL,                          -- Apellidos del usuario
	DNI VARCHAR(20) UNIQUE NOT NULL,                          -- DNI del usuario (debe ser único)
    TELEFONO VARCHAR(15),                                     -- Teléfono del usuario (opcional)
    ESTADO TINYINT(1) DEFAULT 1,                             -- Estado del usuario (0 = inactivo, 1 = activo)
    FECHA_ULT_MODIF TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Fecha de la última modificación
    USUARIO_ULT_MODIF VARCHAR(255) NOT NULL,                  -- Usuario que realizó la última modificación
);

CREATE TABLE AUDITORIA_UPDATE (
    ID INT AUTO_INCREMENT PRIMARY KEY,                         -- Identificador único
    TABLA VARCHAR(255) NOT NULL,                                -- Nombre de la tabla donde ocurrió la modificación
    ID_ENTIDAD INT NOT NULL,                                    -- Identificador de la entidad afectada (por ejemplo, el ID del usuario)
    CAMPO VARCHAR(255) NOT NULL,                                -- Nombre del campo modificado
    VALOR_NUEVO TEXT NOT NULL,                                  -- Nuevo valor del campo
    VALOR_ANTERIOR TEXT NOT NULL,                               -- Valor anterior del campo
    USUARIO_AUDITORIA_NUEVO VARCHAR(255) NOT NULL,              -- Usuario que hizo la modificación
    USUARIO_AUDITORIA_ANTERIOR VARCHAR(255) NOT NULL,           -- Usuario que tenía los datos antes de la modificación
    FECHA_AUDITORIA_NUEVO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de la modificación
    FECHA_AUDITORIA_ANTERIOR TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha anterior a la modificación
);


CREATE TABLE AUDITORIA_INSERT (
    ID INT AUTO_INCREMENT PRIMARY KEY,                         -- Identificador único
    TABLA VARCHAR(255) NOT NULL,                                -- Nombre de la tabla donde ocurrió la inserción
    ID_ENTIDAD INT NOT NULL,                                    -- Identificador de la entidad insertada (por ejemplo, el ID del usuario)
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                  -- Fecha de la inserción
    USUARIO VARCHAR(255) NOT NULL                               -- Usuario que realizó la inserción
);


CREATE TABLE AUDITORIA_DELETE (
    ID INT AUTO_INCREMENT PRIMARY KEY,                         -- Identificador único
    TABLA VARCHAR(255) NOT NULL,                                -- Nombre de la tabla donde ocurrió la eliminación
    ID_ENTIDAD INT NOT NULL,                                    -- Identificador de la entidad eliminada
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                  -- Fecha de la eliminación
    USUARIO VARCHAR(255) NOT NULL                               -- Usuario que realizó la eliminación
);
