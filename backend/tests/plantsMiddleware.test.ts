import { expect, jest, test, describe, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { Request, Response } from 'express';
import { validatePlant } from '../src/middleware/plants';
import { PlantRepository } from '../src/db/repositories/plant.repository';
import { UserRepository } from '../src/db/repositories/user.repository';
import { User } from '../src/db/entities/user';
import { Plant } from '../src/db/entities/plant';
import { AppDataSource } from '../src/db/db';
import { spec } from 'node:test/reporters';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

const plantRepo = new PlantRepository();
const userRepository = new UserRepository();

app.post('/', validatePlant, (req: Request, res: Response) => {
    res.status(201).json({ message: 'middleware successfully completed' });
});

describe('Ensure plants.ts middleware works as expected', () => {
    const userId = 1000000; // 1 million
    const plantId = "1000000";

    const data = {
        user_id: userId,
        name: 'validName',
        species: 'validSpecies',
        plant_id: plantId,
    };

    function initializeValidData() {
        data.user_id = userId;
        data.name = 'validName';
        data.species = 'validSpecies';
        data.plant_id = plantId;
    };

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    beforeEach(() => {
        initializeValidData();
    });

    test('missing or invalid user_id', async () => {
        const invalidData = { ...data, user_id: NaN, name: '', species: '' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'User ID is missing, token validation failed.'});
    });

    test('missing or invalid name', async () => {
        const invalidData = { ...data, name: '' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'There was an error processing your request, please ensure you fill out all fields.'});
    });

    test('missing or invalid species', async () => {
        const invalidData = { ...data, species: '' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'There was an error processing your request, please ensure you fill out all fields.'});
    });
    
    test('plant id is not a number', async () => {
        const invalidData = { ...data, plant_id: 'notANumber' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Plant ID must be a number.'});
    });

    test('plant id is negative', async () => {
        const invalidData = { ...data,  plant_id: '-1' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Plant ID must be a positive number.'});
    });

    test('plant does not exist', async () => {
        // jest.spyOn(plantRepo, 'findPlantById').mockResolvedValue(null);
        const response = await request(app).post('/').send(data);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'Plant not found.'});
    });

    let tempUserData = {
        id: userId,
        username: 'validUsername',
        email: 'valid@email.com',
        password: 'validPassword',
    };
    

    // creating and saving a new plant
    const plantRepo = AppDataSource.getRepository(Plant);
    const newPlant = new Plant();
    newPlant.id = parseInt(data.plant_id);
    newPlant.user = { id: userId + 1 } as User;
    newPlant.name = data.name;
    newPlant.species = data.species;
    
    test('plant does not belong to user', async () => {
        await plantRepo.save(newPlant);
        const response = await request(app).post('/').send(data);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({message: 'You do not have permission to update this plant.'});
        await plantRepo.remove(newPlant);
    });
    
    newPlant.user = { id: userId } as User; // update to have correct user id
    

    test('user does not exist', async () => {
        await plantRepo.save(newPlant);
        // jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);
        const response = await request(app).post('/').send(data);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'User not found.'});
    });

    // creating and saving a new user
    const newUser = new User();
    newUser.id = tempUserData.id; // 1,000,000
    newUser.username = tempUserData.username; // 'validUsername'
    newUser.email = tempUserData.email; // 'valid@email.com'
    newUser.password = tempUserData.password; // 'validPassword'
    const userRepo = AppDataSource.getRepository(User);
    

    test('name is too short', async () => {
        await userRepo.save(newUser); // user in db, should pass previous tests
        const invalidData = { ...data,  name: 'a'};
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Name must be at least 3 characters.'});
    });

    test('name is too long', async () => {
        const invalidData = { ...data,  name: 'a'.repeat(101) };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Name is too long, limit of 100 characters.'});
    });

    test('species is too short', async () => {
        const invalidData = { ...data, species: 'a'};
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Species must be at least 3 characters.'});
    });

    test('species is too long', async () => {
        const invalidData = { ...data, species: 'a'.repeat(101) };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Species is too long, limit of 100 characters.'});
    });

    test('middleware should complete successfully', async () => {
        const response = await request(app).post('/').send(data);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({message: 'middleware successfully completed'});
    });

    afterAll(async () => {
        await userRepo.remove(newUser);
        await plantRepo.remove(newPlant);
        await AppDataSource.destroy();
    });
});