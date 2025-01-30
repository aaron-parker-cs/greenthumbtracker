// Purpose: Entry point for the backend server. This file will start the server and connect to the database.
// It is very important that the dotenv loading lines are at the top of the file.
import dotenv from 'dotenv';
dotenv.config();

const db = require('./db/db');

import express from 'express';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';


const app = express();

// Middleware to parse Cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
