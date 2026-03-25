sql
-- Creación de la base de datos (MySQL/PostgreSQL)
DROP DATABASE IF EXISTS Logistica_Mercancias;
CREATE DATABASE Logistica_Mercancias;
USE Logistica_Mercancias;

-- 1. Tabla de Clientes
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion_principal TEXT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    peso_kg DECIMAL(10, 2) NOT NULL,
    dimensiones VARCHAR(50)
);

-- 3. Tabla de Transportistas
CREATE TABLE Transportistas (
    id_transportista INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    tipo_vehiculo VARCHAR(50) NOT NULL,
    placa_vehiculo VARCHAR(20) UNIQUE NOT NULL,
    telefono_contacto VARCHAR(20)
);

-- 4. Tabla de Rutas (Puntos frecuentes)
CREATE TABLE Rutas (
    id_ruta INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY uk_rutas_origen_destino (origen, destino)
);

-- 5. Tabla de Pedidos (Cabecera)
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estado_pedido VARCHAR(30) NOT NULL DEFAULT 'Creado',
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE CASCADE
);

-- 6. Detalle del Pedido (Muchos productos por pedido)
CREATE TABLE Detalle_Pedidos (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(14, 2) AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    UNIQUE (id_pedido, id_producto)
);

-- 7. Tabla de Envíos (Rastreo y logística)
CREATE TABLE Envios (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT UNIQUE NOT NULL,
    id_transportista INT,
    id_ruta INT,
    codigo_rastreo VARCHAR(50) UNIQUE NOT NULL,
    fecha_despacho TIMESTAMP,
    fecha_entrega_estimada TIMESTAMP,
    fecha_entrega_real TIMESTAMP,
    estado_envio VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_transportista) REFERENCES Transportistas(id_transportista),
    FOREIGN KEY (id_ruta) REFERENCES Rutas(id_ruta)
);

-- 8. Historial de Estados (Para el rastreo en tiempo real)
CREATE TABLE Estados_Envio (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    nombre_estado VARCHAR(50) NOT NULL,
    ubicacion_actual VARCHAR(255),
    comentario TEXT,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_envio) REFERENCES Envios(id_envio) ON DELETE CASCADE
);

-- Índices de optimización
CREATE INDEX idx_clientes_email ON Clientes(email);
CREATE INDEX idx_pedidos_cliente ON Pedidos(id_cliente);
CREATE INDEX idx_envios_transportista ON Envios(id_transportista);
CREATE INDEX idx_estados_envio_envio ON Estados_Envio(id_envio);

-- Vista para monto total de pedido calculado desde Detalle_Pedidos (puede usarse en SELECT)
CREATE OR REPLACE VIEW Vista_Pedido_Montos AS
SELECT
    p.id_pedido,
    p.id_cliente,
    SUM(d.subtotal) AS monto_calculado,
    p.monto_total,
    p.fecha_creacion,
    p.estado_pedido
FROM Pedidos p
LEFT JOIN Detalle_Pedidos d ON p.id_pedido = d.id_pedido
GROUP BY p.id_pedido, p.id_cliente, p.monto_total, p.fecha_creacion, p.estado_pedido;

-- Trigger para mantener monto_total sincronizado (MySQL syntax)
DELIMITER $$
CREATE TRIGGER trg_detalle_pedido_insert
AFTER INSERT ON Detalle_Pedidos
FOR EACH ROW
BEGIN
  UPDATE Pedidos
  SET monto_total = (SELECT COALESCE(SUM(subtotal),0) FROM Detalle_Pedidos WHERE id_pedido = NEW.id_pedido)
  WHERE id_pedido = NEW.id_pedido;
END$$

CREATE TRIGGER trg_detalle_pedido_update
AFTER UPDATE ON Detalle_Pedidos
FOR EACH ROW
BEGIN
  UPDATE Pedidos
  SET monto_total = (SELECT COALESCE(SUM(subtotal),0) FROM Detalle_Pedidos WHERE id_pedido = NEW.id_pedido)
  WHERE id_pedido = NEW.id_pedido;
END$$

CREATE TRIGGER trg_detalle_pedido_delete
AFTER DELETE ON Detalle_Pedidos
FOR EACH ROW
BEGIN
  UPDATE Pedidos
  SET monto_total = (SELECT COALESCE(SUM(subtotal),0) FROM Detalle_Pedidos WHERE id_pedido = OLD.id_pedido)
  WHERE id_pedido = OLD.id_pedido;
END$$
DELIMITER ;

-- Datos de ejemplo de carga rápida
INSERT INTO Clientes (nombre,email,telefono,direccion_principal) VALUES
('Ana Pérez','ana@ej.com','123456789','Calle A 123');

INSERT INTO Productos (nombre,descripcion,peso_kg,dimensiones) VALUES
('Cinta aislante','Cinta de 19mm x 20m',0.20,'19x19x3 cm'),
('Caja de cartón','Caja resistente 40x30x20cm',1.50,'40x30x20 cm');

INSERT INTO Transportistas (nombre_empresa,tipo_vehiculo,placa_vehiculo,telefono_contacto) VALUES
('CargoExpress','Camión','ABC123','987654321');

INSERT INTO Rutas (origen,destino,distancia_km) VALUES
('Madrid','Barcelona',620.50);

INSERT INTO Pedidos (id_cliente,estado_pedido) VALUES (1,'Creado');

INSERT INTO Detalle_Pedidos (id_pedido,id_producto,cantidad,precio_unitario) VALUES
(1,1,5,2.50),
(1,2,2,8.00);

INSERT INTO Envios (id_pedido,id_transportista,id_ruta,codigo_rastreo,fecha_despacho,fecha_entrega_estimada,estado_envio) VALUES
(1,1,1,'TRACK-001',NOW(),DATE_ADD(NOW(), INTERVAL 2 DAY),'En Almacén');

INSERT INTO Estados_Envio (id_envio,nombre_estado,ubicacion_actual,comentario) VALUES
(1,'Creado','Madrid','Pedido registrado');
