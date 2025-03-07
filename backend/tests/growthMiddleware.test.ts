import { expect, jest, test, describe, beforeEach, afterAll } from '@jest/globals';
import { Request, Response } from 'express';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

describe('Ensure growth.ts middleware works as expected', () => {
    test('dummy test', () => {
        expect(1).toBe(1);
    });
});