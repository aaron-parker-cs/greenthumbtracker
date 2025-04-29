// Purpose: Entry point for the backend server. This file will start the server and connect to the database.
// It is very important that the dotenv loading lines are at the top of the file.
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./db/db";

import express, { application } from "express";
import authRoutes from "./routes/auth";
import plantRoutes from "./routes/plants";
import waterRoutes from "./routes/water";
import growthRoutes from "./routes/growth";
import humidityRoutes from "./routes/humidity";
import lightRoutes from "./routes/light";
import soilRoutes from "./routes/soil_moisture";
import tempRoutes from "./routes/temperature";
import uomRoutes from "./routes/uom";
import weatherRoutes from "./routes/weather";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import cors from "cors";
import trefleRoutes from "./routes/trefle.route";

const app = express();

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Cors to allow requests from the frontend
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL ?? "http://localhost:5173",
      "frontend",
      "backend",
    ],
    credentials: true,
  })
);

// Middleware to parse Cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/humidity", humidityRoutes);
app.use("/api/light", lightRoutes);
app.use("/api/soil-moisture", soilRoutes);
app.use("/api/temperature", tempRoutes);
app.use("/api/uom", uomRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api", trefleRoutes);

// Swagger -- API Documentation and routes testing
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

// Register cron jobs
import { FrostCheckJob } from "./jobs/FrostCheckJob";
import cron from "node-cron";

// wait for the database to be ready before starting the cron job
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected.");

    // Run the FrostCheckJob once at startup
    // This is useful for testing and to ensure that the job runs at least once a day
    FrostCheckJob.run();
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
    process.exit(1);
  });

// Schedule the FrostCheckJob to run every day at noon
cron.schedule("0 12 * * *", () => {
  FrostCheckJob.run();
});

const PORT = Number(process.env.PORT) || 8800;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

//for any invalid routes, catch all handler
app.use((req, res) => {
  res.status(404).json({message: `Route not found: ${req.originalUrl}`});
});
