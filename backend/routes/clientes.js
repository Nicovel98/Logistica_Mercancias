const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Clientes ORDER BY id_cliente');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, email, telefono, direccion_principal } = req.body;
        const [result] = await db.query(
            'INSERT INTO Clientes (nombre,email,telefono,direccion_principal) VALUES (?,?,?,?)',
            [nombre, email, telefono, direccion_principal]
        );
        const [cliente] = await db.query('SELECT * FROM Clientes WHERE id_cliente = ?', [result.insertId]);
        res.status(201).json(cliente[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nombre, email, telefono, direccion_principal } = req.body;
        await db.query(
            'UPDATE Clientes SET nombre = ?, email = ?, telefono = ?, direccion_principal = ? WHERE id_cliente = ?',
            [nombre, email, telefono, direccion_principal, id]
        );
        const [cliente] = await db.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
        res.json(cliente[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Clientes WHERE id_cliente = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
