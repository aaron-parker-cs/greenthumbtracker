const { Request, Response, NextFunction } = require("express");

const validateWatering = (req, res, next) => {
    const { plant_id, water_amount } = req.body;

    if (!plant_id || !water_amount) {
        return res.status(400).json({ message: "Plant ID and water amount are required." });
    }

    if (isNaN(plant_id) || plant_id <= 0) {
        return res.status(400).json({ message: "Plant ID must be a valid number." });
    }

    if (isNaN(water_amount) || water_amount <= 0) {
        return res.status(400).json({ message: "Water amount must be a positive number." });
    }

    next();
};

module.exports = validateWatering;
