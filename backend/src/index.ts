// Purpose: Entry point for the backend server. This file will start the server and connect to the database.
// It is very important that the dotenv loading lines are at the top of the file.
import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './db/db';

AppDataSource.initialize().then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Error connecting to the database: ', err);
    process.exit(1);
});

import express from 'express';
import authRoutes from './routes/auth';
import plantRoutes from './routes/plants';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import cors from 'cors';

const app = express();

// Cors to allow requests from the frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
)

// Middleware to parse Cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);

// Swagger -- API Documentation and routes testing
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
