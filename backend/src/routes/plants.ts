import express from "express";
import { createPlant, deletePlant, getPlants, updatePlant } from "../controllers/plants";
import { validatePlant } from "../middleware/plants";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /plants:
 *   get:
 *     summary: Retrieves a list of all plants
 *     tags:
 *       - Plants
 *     responses:
 *       200:
 *         description: Returns an array of plant objects
 */
router.get("/", verifyToken, getPlants);

/**
 * @openapi
 * /plants:
 *   post:
 *     summary: Create a new plant
 *     tags:
 *       - Plants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created a new plant
 */
router.post("/", verifyToken, validatePlant, createPlant);

/**
 * @openapi
 * /plants/{id}:
 *   put:
 *     summary: Update a plant
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Plant ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succesfully the plant
 */
router.put("/:id", verifyToken, validatePlant, updatePlant);

/**
 * @openapi
 * /plants/{id}:
 *   delete:
 *     summary: Delete a plant
 *     tags:
 *       - Plants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Plant successfully deleted
 */
router.delete("/:id", verifyToken, deletePlant);

export default router;
