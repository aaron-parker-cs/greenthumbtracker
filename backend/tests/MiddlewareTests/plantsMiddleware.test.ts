import { expect, jest, test, describe, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { validatePlant } from '../../src/middleware/plants';
import mysql, { ConnectionOptions, Connection } from 'mysql2';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
var connection: Connection;

const setReqUserId = (req: Request, userId: number, next: NextFunction) => {
    req.userId = parseInt(req.params.customUserId);
    next();
};

app.post('/(:id?)', validatePlant, (req: Request, res: Response) => {
    res.status(201).json({ message: 'middleware successfully completed' });
});

app.post('/:id/:customUserId', setReqUserId, validatePlant, (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ message: 'middleware successfully completed' });
});

beforeAll(async () => {
    connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

});

afterAll(async () => {
    connection.end((err) => {
        if (err) throw err;
    });
});

describe('Ensure plants.ts middleware works as expected', () => {
    
    test('missing or invalid user_id', async () => {
        
    });

    test('missing or invalid name', async () => {
        
    });

    test('missing or invalid species', async () => {
        
    });
    
    test('plant id is not a number', async () => {
        
    });

    test('plant id is negative', async () => {

    });

    test('plant does not exist', async () => {

    });
    
    test('plant does not belong to user', async () => {
        
    });

    test('user does not exist', async () => {
        
    });

    test('name is too short', async () => {
        
    });

    test('name is too long', async () => {
        
    });

    test('species is too short', async () => {
        
    });

    test('species is too long', async () => {
        
    });

    test('middleware should complete successfully', async () => {
        
    });
});