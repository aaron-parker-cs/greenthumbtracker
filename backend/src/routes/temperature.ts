import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  fetchTemperatureRecords,
  logTemperatureRecord,
  modifyTemperatureRecord,
  removeTemperatureRecord,
} from "../controllers/temperature";
import { validateTemperature } from "../middleware/temperature";

const router = express.Router();

/**
 * @openapi
 * /temperature/{plantId}:
 *   get:
 *     summary: Retrieves a list of all temperature records for a plant
 *     tags:
 *       - Temperature Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of temperature record objects for a plant
 */
router.get("/:plantId", verifyToken,async (req, res) => {
  await fetchTemperatureRecords(req, res);
});

/**
 * @openapi
 * /temperature/{plantId}:
 *   post:
 *     summary: Create a new temperature record
 *     tags:
 *       - Temperature Records
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
 *               temperature:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created a new temperature record
 */
router.post("/:plantId", verifyToken, validateTemperature, async (req, res) => {
  await logTemperatureRecord(req, res);
});

/**
 * @openapi
 * /temperature/{plantId}/{id}:
 *   put:
 *     summary: Update a temperature record
 *     tags:
 *       - Temperature Records
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
 *               temperature:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated the temperature record
 */
router.put("/:plantId/:id", verifyToken, validateTemperature, async (req, res) => {
  await modifyTemperatureRecord(req, res);
});

/**
 * @openapi
 * /temperature/{plantId}/{id}:
 *   delete:
 *     summary: Delete a temperature record
 *     tags:
 *       - Temperature Records
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
 *         description: Deleted the temperature record
 */
router.delete("/:plantId/:id", verifyToken, async (req, res) => {
  await removeTemperatureRecord(req, res);
});

export default router;
