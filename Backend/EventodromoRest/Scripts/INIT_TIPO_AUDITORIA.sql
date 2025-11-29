-- ============================================================
-- Script: Inicialización de Tipos de Auditoría
-- Descripción: Inserta los tipos de auditoría necesarios para
--              el sistema de auditoría de sesiones (BUG #4)
-- ============================================================

-- Insertar tipos de auditoría básicos si no existen
INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(1, 'Compra de entradas', 'shopping_cart', '#4CAF50')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(2, 'Inicio de sesión', 'login', '#2196F3')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(3, 'Cierre de sesión', 'logout', '#FF9800')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(4, 'Uso de puntos', 'stars', '#9C27B0')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(5, 'Transferencia enviada', 'send', '#FF5722')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

INSERT INTO TipoAuditoria (id, nombre, iconoURL, color) VALUES 
(6, 'Transferencia recibida', 'inbox', '#03A9F4')
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    iconoURL = VALUES(iconoURL),
    color = VALUES(color);

-- Verificar que se insertaron correctamente
SELECT * FROM TipoAuditoria ORDER BY id;
