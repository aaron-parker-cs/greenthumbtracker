import express from "express";
import {
  getWeather,
  setLocation,
  setLocationByCity,
} from "../controllers/weather";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /weather:
 *   get:
 *     summary: Get weather data for the logged-in user
 *     tags:
 *       - Weather
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (e.g., missing user ID or location)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getWeather);

/**
 * @openapi
 * /weather/location:
 *   post:
 *     summary: Set the user's location using latitude and longitude
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *             required:
 *               - latitude
 *               - longitude
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Bad request (e.g., missing user ID or coordinates)
 *       500:
 *         description: Internal server error
 */
router.post("/location", verifyToken, setLocation);

/**
 * @openapi
 * /weather/location/city:
 *   post:
 *     summary: Set the user's location using a city name
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *             required:
 *               - city
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Bad request (e.g., missing user ID or city name)
 *       500:
 *         description: Internal server error
 */
router.post("/location/city", verifyToken, setLocationByCity);

export default router;
