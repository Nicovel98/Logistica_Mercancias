const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Transportistas ORDER BY id_transportista');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre_empresa, tipo_vehiculo, placa_vehiculo, telefono_contacto } = req.body;
        const [result] = await db.query(
            'INSERT INTO Transportistas (nombre_empresa,tipo_vehiculo,placa_vehiculo,telefono_contacto) VALUES (?,?,?,?)',
            [nombre_empresa, tipo_vehiculo, placa_vehiculo, telefono_contacto]
        );
        const [trans] = await db.query('SELECT * FROM Transportistas WHERE id_transportista = ?', [result.insertId]);
        res.status(201).json(trans[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nombre_empresa, tipo_vehiculo, placa_vehiculo, telefono_contacto } = req.body;
        await db.query('UPDATE Transportistas SET nombre_empresa=?, tipo_vehiculo=?, placa_vehiculo=?, telefono_contacto=? WHERE id_transportista=?',
            [nombre_empresa, tipo_vehiculo, placa_vehiculo, telefono_contacto, id]
        );
        const [trans] = await db.query('SELECT * FROM Transportistas WHERE id_transportista = ?', [id]);
        res.json(trans[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db.query('DELETE FROM Transportistas WHERE id_transportista = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
