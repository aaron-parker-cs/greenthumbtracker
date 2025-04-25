import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  getSoilMoistureRecords,
  createSoilMoistureRecord,
  updateSoilMoistureRecord,
  deleteSoilMoistureRecord,
} from "../controllers/soil_moisture";
import { validateSoilMoisture } from "../middleware/soil_moisture";

const router = express.Router();

/**
 * @openapi
 * /soil-moisture/{plantId}:
 *   get:
 *     summary: Retrieves a list of all soil moisture records for a plant
 *     tags:
 *       - Soil Moisture Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of soil moisture record objects for a plant
 */
router.get("/:plantId", verifyToken, getSoilMoistureRecords);

/**
 * @openapi
 * /soil-moisture/{plantId}:
 *   post:
 *     summary: Create a new soil moisture record
 *     tags:
 *       - Soil Moisture Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soilMoisture:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created a new soil moisture record
 */
router.post("/:plantId", verifyToken, validateSoilMoisture, createSoilMoistureRecord);

/**
 * @openapi
 * /soil-moisture/{plantId}/{id}:
 *   put:
 *     summary: Update a soil moisture record
 *     tags:
 *       - Soil Moisture Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soilMoisture:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated the soil moisture record
 */
router.put("/:plantId/:id", verifyToken, validateSoilMoisture, updateSoilMoistureRecord);

/**
 * @openapi
 * /soil-moisture/{plantId}/{id}:
 *   delete:
 *     summary: Delete a soil moisture record
 *     tags:
 *       - Soil Moisture Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Deleted the soil moisture record
 */
router.delete("/:plantId/:id", verifyToken, deleteSoilMoistureRecord);

export default router;
