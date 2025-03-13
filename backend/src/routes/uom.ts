import express from "express";
import { authorizeAdmin, verifyToken } from "../middleware/auth";
import {
  createDefaultUom,
  createUom,
  deleteUom,
  getAllUoms,
  updateUom,
} from "../controllers/uom";
import { validateUnitOfMeasure } from "../middleware/uom";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     UnitOfMeasure:
 *       type: "object"
 *       properties:
 *         name:
 *           type: "string"
 *           description: "The name of the unit of measure"
 *         symbol:
 *           type: "string"
 *           description: "The symbol of the unit of measure"
 *       required:
 *         - name
 *         - symbol
 * /uom:
 *   get:
 *     summary: Get all units of measure for a user and the defaults
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of units of measure
 *     tags:
 *       - Unit of Measure
 *   post:
 *     summary: Create a new unit of measure
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *     responses:
 *       201:
 *         description: The created unit of measure
 *     tags:
 *       - Unit of Measure
 * /uom/{id}:
 *   put:
 *     summary: Update a unit of measure
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *     responses:
 *       200:
 *         description: The updated unit of measure
 *     tags:
 *       - Unit of Measure
 *   delete:
 *     summary: Delete a unit of measure
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The unit of measure was deleted
 *     tags:
 *       - Unit of Measure
 * /uom/default:
 *   post:
 *     summary: Create a default unit of measure (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *     responses:
 *       201:
 *         description: The created default unit of measure
 *     tags:
 *       - Unit of Measure
 */

router.get("/", verifyToken, getAllUoms);
router.post("/", verifyToken, validateUnitOfMeasure, createUom);
router.put("/:id", verifyToken, validateUnitOfMeasure, updateUom);
router.delete("/:id", verifyToken, deleteUom);
router.post("/default", verifyToken, authorizeAdmin, createDefaultUom);

export default router;
