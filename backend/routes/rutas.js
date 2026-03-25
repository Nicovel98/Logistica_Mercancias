const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Rutas ORDER BY id_ruta');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { origen, destino, distancia_km } = req.body;
        const [result] = await db.query('INSERT INTO Rutas (origen,destino,distancia_km) VALUES (?,?,?)', [origen, destino, distancia_km]);
        const [ruta] = await db.query('SELECT * FROM Rutas WHERE id_ruta = ?', [result.insertId]);
        res.status(201).json(ruta[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { origen, destino, distancia_km } = req.body;
        await db.query('UPDATE Rutas SET origen=?, destino=?, distancia_km=? WHERE id_ruta=?', [origen, destino, distancia_km, id]);
        const [ruta] = await db.query('SELECT * FROM Rutas WHERE id_ruta = ?', [id]);
        res.json(ruta[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Rutas WHERE id_ruta = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
