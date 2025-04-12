import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  getHumidityRecords,
  createHumidityRecord,
  updateHumidityRecord,
  deleteHumidityRecord,
} from "../controllers/humidity";
import { validateHumidity } from "../middleware/humidity";

const router = express.Router();

/**
 * @openapi
 * /humidity/{plantId}:
 *   get:
 *     summary: Retrieves a list of all humidity records for a plant
 *     tags:
 *       - Humidity Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of humidity record objects for a plant
 */
router.get("/:plantId", verifyToken, getHumidityRecords);

/**
 * @openapi
 * /humidity/{plantId}:
 *   post:
 *     summary: Create a new humidity record
 *     tags:
 *       - Humidity Records
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
 *               humidity:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created a new humidity record
 */
router.post("/:plantId", verifyToken, validateHumidity, createHumidityRecord);

/**
 * @openapi
 * /humidity/{plantId}/{id}:
 *   put:
 *     summary: Update a humidity record
 *     tags:
 *       - Humidity Records
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
 *               humidity:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated the humidity record
 */
router.put("/:plantId/:id", verifyToken, validateHumidity, updateHumidityRecord);

/**
 * @openapi
 * /humidity/{plantId}/{id}:
 *   delete:
 *     summary: Delete a humidity record
 *     tags:
 *       - Humidity Records
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
 *         description: Deleted the humidity record
 */
router.delete("/:plantId/:id", verifyToken, deleteHumidityRecord);

export default router;
