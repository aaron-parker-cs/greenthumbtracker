import { expect, jest, test, describe, beforeEach, afterAll } from '@jest/globals';
import { Request, Response } from 'express';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

describe('Ensure growth.ts middleware works as expected', () => {
    describe('validateGrowth', () => {
        test('all fields NOT filled in', async () => {
            // add test
        });

        test('growth amount NOT a number', async () => {
            // add test
        });

        test('growth date in the future', async () => {
            // add test
        });

        test('growth date more than 1 year in the past', async () => {
            // add test
        });

        test('growth date null', async () => {
            // add test
        });

        test('plant NOT in database', async () => {
            // add test
        });

        test('plant does NOT belong to user', async () => {
            // add test
        });
    });

    describe('validateDeleteGrowth', () => {
        test('all fields NOT filled in', async () => {
            // add test
        });

        test('plant ID NOT a number', async () => {
            // add test
        });

        test('growth ID NOT a number', async () => {
            // add test
        });

        test('plant NOT in database', async () => {
            // add test
        });

        test('plant does NOT belong to user', async () => {
            // add test
        });

    });
});