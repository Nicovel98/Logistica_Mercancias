const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Productos ORDER BY id_producto');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, peso_kg, dimensiones } = req.body;
        const [result] = await db.query(
            'INSERT INTO Productos (nombre,descripcion,peso_kg,dimensiones) VALUES (?,?,?,?)',
            [nombre, descripcion, peso_kg, dimensiones]
        );
        const [producto] = await db.query('SELECT * FROM Productos WHERE id_producto = ?', [result.insertId]);
        res.status(201).json(producto[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nombre, descripcion, peso_kg, dimensiones } = req.body;
        await db.query('UPDATE Productos SET nombre=?, descripcion=?, peso_kg=?, dimensiones=? WHERE id_producto=?', [nombre, descripcion, peso_kg, dimensiones, id]);
        const [producto] = await db.query('SELECT * FROM Productos WHERE id_producto = ?', [id]);
        res.json(producto[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Productos WHERE id_producto = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
