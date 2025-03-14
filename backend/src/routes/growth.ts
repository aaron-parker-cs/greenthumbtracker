import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  createGrowthRecord,
  deleteGrowthRecord,
  getGrowthRecords,
  updateGrowthRecord,
} from "../controllers/growth";
import { validateGrowth, validateDeleteGrowth } from "../middleware/growth";

const router = express.Router();

/**
 * @openapi
 * /growth/{plantId}:
 *   get:
 *     summary: Retrieves a list of all growth records for a plant
 *     tags:
 *       - Growth Records
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns an array of growth record objects for a plant
 */
router.get("/:plantId", verifyToken, getGrowthRecords);

/**
 * @openapi
 * /growth/{plantId}:
 *   post:
 *     summary: Create a new growth record
 *     tags:
 *       - Growth Records
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
 *               height:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *
 *     responses:
 *       201:
 *         description: Created a new growth record
 */
router.post("/:plantId", verifyToken, validateGrowth, createGrowthRecord);

/**
 * @openapi
 * /growth/{plantId}/{id}:
 *   put:
 *     summary: Update a growth record
 *     tags:
 *       - Growth Records
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
 *               height:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               uomId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated the growth record
 */
router.put("/:plantId/:id", verifyToken, validateGrowth, updateGrowthRecord);

/**
 * @openapi
 * /growth/{plantId}/{id}:
 *   delete:
 *     summary: Delete a growth record
 *     tags:
 *       - Growth Records
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
 *         description: Deleted the growth record
 */
router.delete(
  "/:plantId/:id",
  verifyToken,
  validateDeleteGrowth,
  deleteGrowthRecord
);

export default router;
