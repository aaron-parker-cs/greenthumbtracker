import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { Request, Response } from 'express';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// app POST, GET, PUT, DELETE routes

describe('Ensure water.ts middleware works as expected', () => {
    describe('validateWater', () => {
        test('all fields NOT filled in', async () => {
            // add test
        });

        test('water amount NOT a number', async () => {
            // add test
        });

        test('plant NOT found', async () => {
            // add test
        });

        test('water date in the future', async () => {
            // add test
        });

        test('water date more than 1 year in the past', async () => {
            // add test
        });

        test('water date null', async () => {
            // add test
        });

        test('all validations pass', async () => {
            // add test
        });
    });
});