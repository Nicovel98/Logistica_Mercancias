const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, p.id_cliente, c.nombre AS cliente_nombre, t.nombre_empresa AS transportista, r.origen, r.destino
      FROM Envios e
      LEFT JOIN Pedidos p ON e.id_pedido = p.id_pedido
            LEFT JOIN Clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN Transportistas t ON e.id_transportista = t.id_transportista
      LEFT JOIN Rutas r ON e.id_ruta = r.id_ruta
      ORDER BY e.id_envio;
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT * FROM Envios WHERE id_envio = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Envío no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/rastreo', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [envioRows] = await db.query(
            `SELECT e.*, p.id_cliente, c.nombre AS cliente_nombre, c.email AS cliente_email,
                    c.telefono AS cliente_telefono, t.nombre_empresa AS transportista_nombre,
                    t.tipo_vehiculo AS transportista_tipo_vehiculo, t.placa_vehiculo AS transportista_placa,
                    t.telefono_contacto AS transportista_telefono
             FROM Envios e
             LEFT JOIN Pedidos p ON e.id_pedido = p.id_pedido
             LEFT JOIN Clientes c ON p.id_cliente = c.id_cliente
             LEFT JOIN Transportistas t ON e.id_transportista = t.id_transportista
             WHERE e.id_envio = ?`,
            [id]
        );
        if (!envioRows.length) return res.status(404).json({ message: 'Envío no encontrado' });

        const [estados] = await db.query(
            'SELECT * FROM Estados_Envio WHERE id_envio = ? ORDER BY fecha_actualizacion, id_estado',
            [id]
        );

        res.json({ envio: envioRows[0], estados });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id_pedido, id_transportista, id_ruta, codigo_rastreo, fecha_despacho, fecha_entrega_estimada, estado_envio } = req.body;
        const estadoInicial = estado_envio || 'Pendiente';
        const [result] = await db.query(
            'INSERT INTO Envios (id_pedido,id_transportista,id_ruta,codigo_rastreo,fecha_despacho,fecha_entrega_estimada,estado_envio) VALUES (?,?,?,?,?,?,?)',
            [id_pedido, id_transportista, id_ruta, codigo_rastreo, fecha_despacho, fecha_entrega_estimada, estadoInicial]
        );
        await db.query(
            'INSERT INTO Estados_Envio (id_envio,nombre_estado,ubicacion_actual,comentario) VALUES (?,?,?,?)',
            [result.insertId, estadoInicial, null, 'Envío creado en el sistema']
        );
        const [envio] = await db.query('SELECT * FROM Envios WHERE id_envio = ?', [result.insertId]);
        res.status(201).json(envio[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { id_pedido, id_transportista, id_ruta, codigo_rastreo, fecha_despacho, fecha_entrega_estimada, estado_envio, fecha_entrega_real } = req.body;

        const [envioActualRows] = await db.query('SELECT * FROM Envios WHERE id_envio = ?', [id]);
        if (!envioActualRows.length) return res.status(404).json({ message: 'Envío no encontrado' });
        const envioActual = envioActualRows[0];

        await db.query(
            'UPDATE Envios SET id_pedido=?, id_transportista=?, id_ruta=?, codigo_rastreo=?, fecha_despacho=?, fecha_entrega_estimada=?, estado_envio=?, fecha_entrega_real=? WHERE id_envio=?',
            [id_pedido, id_transportista, id_ruta, codigo_rastreo, fecha_despacho, fecha_entrega_estimada, estado_envio, fecha_entrega_real || null, id]
        );

        const estadoAntes = envioActual.estado_envio || 'Sin estado';
        const estadoDespues = estado_envio || 'Sin estado';
        const huboCambio =
            envioActual.id_pedido !== id_pedido ||
            envioActual.id_transportista !== id_transportista ||
            envioActual.id_ruta !== id_ruta ||
            envioActual.codigo_rastreo !== codigo_rastreo ||
            estadoAntes !== estadoDespues ||
            String(envioActual.fecha_despacho || '') !== String(fecha_despacho || '') ||
            String(envioActual.fecha_entrega_estimada || '') !== String(fecha_entrega_estimada || '') ||
            String(envioActual.fecha_entrega_real || '') !== String(fecha_entrega_real || '');

        if (huboCambio) {
            const comentarioEstado = estadoAntes !== estadoDespues
                ? `Estado actualizado de "${estadoAntes}" a "${estadoDespues}"`
                : 'Datos del envío actualizados';

            await db.query(
                'INSERT INTO Estados_Envio (id_envio,nombre_estado,ubicacion_actual,comentario) VALUES (?,?,?,?)',
                [id, estadoDespues, null, comentarioEstado]
            );
        }

        const [envio] = await db.query('SELECT * FROM Envios WHERE id_envio = ?', [id]);
        res.json(envio[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Envios WHERE id_envio = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
