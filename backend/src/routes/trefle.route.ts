import express from "express";
import { getTrefleClientToken } from "../controllers/trefle"; // 📌 trefle.controller.ts

const router = express.Router();

/**
 * @openapi
 * /trefle-client-token:
 *   post:
 *     summary: Requests a client-side Trefle API token for use by the iOS app
 *     tags:
 *       - Trefle
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Returns a client-side token (JWT) from Trefle API
 */
router.post("/trefle-client-token", async (req, res) => {
  await getTrefleClientToken(req, res);
});

export default router;
