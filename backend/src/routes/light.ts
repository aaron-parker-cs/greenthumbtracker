import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  getLightRecords,
  createLightRecord,
  updateLightRecord,
  deleteLightRecord,
} from "../controllers/light";
import { validateLight } from "../middleware/light";

const router = express.Router();

/**
 * @openapi
 * /light/{plantId}:
 *   get:
 *     summary: Retrieves a list of all light records for a plant
 *     tags:
 *       - Light Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of light record objects for a plant
 */
router.get("/:plantId", verifyToken, getLightRecords);

/**
 * @openapi
 * /light/{plantId}:
 *   post:
 *     summary: Create a new light record
 *     tags:
 *       - Light Records
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
 *               light:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created a new light record
 */
router.post("/:plantId", verifyToken, validateLight, createLightRecord);

/**
 * @openapi
 * /light/{plantId}/{id}:
 *   put:
 *     summary: Update a light record
 *     tags:
 *       - Light Records
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
 *               light:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated the light record
 */
router.put("/:plantId/:id", verifyToken, validateLight, updateLightRecord);

/**
 * @openapi
 * /light/{plantId}/{id}:
 *   delete:
 *     summary: Delete a light record
 *     tags:
 *       - Light Records
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
 *         description: Deleted the light record
 */
router.delete("/:plantId/:id", verifyToken, deleteLightRecord);

export default router;
