const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const { id_envio } = req.query;
        const sql = id_envio ? 'SELECT * FROM Estados_Envio WHERE id_envio = ? ORDER BY fecha_actualizacion, id_estado' : 'SELECT * FROM Estados_Envio ORDER BY fecha_actualizacion, id_estado';
        const params = id_envio ? [id_envio] : [];
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id_envio, nombre_estado, ubicacion_actual, comentario } = req.body;
        const [result] = await db.query(
            'INSERT INTO Estados_Envio (id_envio,nombre_estado,ubicacion_actual,comentario) VALUES (?,?,?,?)',
            [id_envio, nombre_estado, ubicacion_actual, comentario]
        );
        const [estado] = await db.query('SELECT * FROM Estados_Envio WHERE id_estado = ?', [result.insertId]);

        const io = req.app.get('io');
        if (io) {
            const [envio] = await db.query(
                `SELECT e.*, p.id_cliente, c.nombre AS cliente_nombre, c.email AS cliente_email,
                        c.telefono AS cliente_telefono, t.nombre_empresa AS transportista_nombre,
                        t.tipo_vehiculo AS transportista_tipo_vehiculo, t.placa_vehiculo AS transportista_placa,
                        t.telefono_contacto AS transportista_telefono
                 FROM Envios e
                 LEFT JOIN Pedidos p ON e.id_pedido = p.id_pedido
                 LEFT JOIN Clientes c ON p.id_cliente = c.id_cliente
                 LEFT JOIN Transportistas t ON e.id_transportista = t.id_transportista
                 WHERE e.id_envio = ?`,
                [id_envio]
            );
            const [estados] = await db.query('SELECT * FROM Estados_Envio WHERE id_envio = ? ORDER BY fecha_actualizacion, id_estado', [id_envio]);
            io.emit('rastreo_actualizado', { envio: envio[0], estados });
        }

        res.status(201).json(estado[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Estados_Envio WHERE id_estado = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
