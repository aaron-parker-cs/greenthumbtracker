const express = require('express');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Watering
 *   description: API for managing plant watering activities
 */

//  ** Add Watering Record**
/**
 * @swagger
 * /api/water:
 *   post:
 *     summary: Log a watering record
 *     tags: [Watering]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant_id:
 *                 type: integer
 *                 description: ID of the plant
 *               water_amount:
 *                 type: number
 *                 description: Amount of water (for example, in ml)
 *     responses:
 *       201:
 *         description: Water record added successfully
 *       400:
 *         description: Invalid request
 */
router.post('/', verifyToken, (req, res) => {
    const { plant_id, water_amount } = req.body;
    const userId = req.user?.userId;

    if (!plant_id || !water_amount) {
        return res.status(400).json({ message: 'Plant ID and water amount are required' });
    }

    const query = 'INSERT INTO water_records (plant_id, user_id, water_amount) VALUES (?, ?, ?)';
    db.query(query, [plant_id, userId, water_amount], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        res.status(201).json({ message: 'Watering record added successfully' });
    });
});

//  ** Retrieve Watering Records for a Plant**
router.get('/:plant_id', verifyToken, (req, res) => {
    const { plant_id } = req.params;

    db.query('SELECT * FROM water_records WHERE plant_id = ?', [plant_id], (err, results) => {
        if (err) return res.status(400).json({ message: err.message });
        res.json(results);
    });
});

//  ** Update Watering Record**
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { water_amount } = req.body;

    if (!water_amount) {
        return res.status(400).json({ message: 'Water amount is required' });
    }

    db.query('UPDATE water_records SET water_amount = ? WHERE id = ?', [water_amount, id], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        res.json({ message: 'Watering record updated successfully' });
    });
});

//  **DELETE: Remove a Watering Record**
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM water_records WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        res.json({ message: 'Watering record deleted successfully' });
    });
});

module.exports = router;
