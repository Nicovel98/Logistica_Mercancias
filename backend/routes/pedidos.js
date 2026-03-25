const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT p.*, c.nombre AS cliente_nombre
      FROM Pedidos p
      LEFT JOIN Clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.id_pedido;
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT * FROM Pedidos WHERE id_pedido = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id_cliente, estado_pedido } = req.body;
        const [result] = await db.query('INSERT INTO Pedidos (id_cliente, estado_pedido) VALUES (?,?)', [id_cliente, estado_pedido || 'Creado']);
        const [pedido] = await db.query('SELECT * FROM Pedidos WHERE id_pedido = ?', [result.insertId]);
        res.status(201).json(pedido[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { id_cliente, estado_pedido } = req.body;

        const [pedidoActualRows] = await db.query('SELECT * FROM Pedidos WHERE id_pedido = ?', [id]);
        if (!pedidoActualRows.length) return res.status(404).json({ message: 'Pedido no encontrado' });
        const pedidoActual = pedidoActualRows[0];

        await db.query('UPDATE Pedidos SET id_cliente=?, estado_pedido=? WHERE id_pedido=?', [id_cliente, estado_pedido, id]);

        const [envioRows] = await db.query('SELECT id_envio FROM Envios WHERE id_pedido = ?', [id]);
        const huboCambio = pedidoActual.id_cliente !== id_cliente || pedidoActual.estado_pedido !== estado_pedido;

        if (envioRows.length && huboCambio) {
            const estadoAnterior = pedidoActual.estado_pedido || 'Sin estado';
            const estadoNuevo = estado_pedido || 'Sin estado';
            const comentario = estadoAnterior !== estadoNuevo
                ? `Estado de pedido actualizado de "${estadoAnterior}" a "${estadoNuevo}"`
                : 'Datos del pedido actualizados';

            await db.query(
                'INSERT INTO Estados_Envio (id_envio,nombre_estado,ubicacion_actual,comentario) VALUES (?,?,?,?)',
                [envioRows[0].id_envio, estadoNuevo, null, comentario]
            );
        }

        const [pedido] = await db.query('SELECT * FROM Pedidos WHERE id_pedido = ?', [id]);
        res.json(pedido[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Pedidos WHERE id_pedido = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
