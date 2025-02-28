import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  createWaterRecord,
  deleteWaterRecord,
  getWaterRecords,
  updateWaterRecord,
} from "../controllers/water";
import { validateWater } from "../middleware/water";

const router = express.Router();

/**
 * @openapi
 * /water/{plantId}:
 *   get:
 *     summary: Retrieves a list of all water records for a plant
 *     tags:
 *       - Water Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of water record objects for a plant
 */
router.get("/:plantId", verifyToken, getWaterRecords);

/**
 * @openapi
 * /water/{plantId}:
 *   post:
 *     summary: Create a new water record
 *     tags:
 *       - Water Records
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
 *               waterAmount:
 *                 type: number
 *               waterDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Created a new plant
 */
router.post("/:plantId", verifyToken, validateWater, createWaterRecord);

/**
 * @openapi
 * /water/{plantId}/{id}:
 *   put:
 *     summary: Update a water record
 *     tags:
 *       - Water Records
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
 *               waterAmount:
 *                 type: number
 *               waterDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Updated the plant
 */
router.put("/:plantId/:id", verifyToken, validateWater, updateWaterRecord);

/**
 * @openapi
 * /water/{plantId}/{id}:
 *   delete:
 *     summary: Delete a water record
 *     tags:
 *       - Water Records
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
 *         description: Deleted the water record
 */
router.delete("/:plantId/:id", verifyToken, deleteWaterRecord);

export default router;
