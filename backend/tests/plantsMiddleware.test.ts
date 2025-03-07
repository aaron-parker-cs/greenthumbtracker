import { expect, jest, test, describe, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { validatePlant } from '../src/middleware/plants';
// import { PlantRepository } from '../src/db/repositories/plant.repository';
// import { UserRepository } from '../src/db/repositories/user.repository';
// import { User } from '../src/db/entities/user';
// import { Plant } from '../src/db/entities/plant';
// import { AppDataSource } from '../src/db/db';
var mysql = require('mysql');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
var connection: any;

// const plantRepo = new PlantRepository();
// const userRepository = new UserRepository();

var userId = 1000000; // 1 million
var plantId = "1000000"; // 1 million

const data = {
    name: 'validName',
    species: 'validSpecies',
};

let tempUserData = {
    id: userId,
    username: 'validUsername',
    email: 'valid@email.com',
    password: 'validPassword',
};

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
    // await AppDataSource.initialize();

    // creating and saving a new user
    // const userRepo = AppDataSource.getRepository(User);
    // const newUser = new User();
    // newUser.id = tempUserData.id; // 1,000,000
    // newUser.username = tempUserData.username; // 'validUsername'
    // newUser.email = tempUserData.email; // 'valid@email.com'
    // newUser.password = tempUserData.password; // 'validPassword'
    // await userRepo.save(newUser);

    connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    connection.connect();

});

afterAll(async () => {
    // const userRepo = AppDataSource.getRepository(User);
    // const plantRepo = AppDataSource.getRepository(Plant);

    // Clean up created entities
    // const user = await userRepo.findOne({ where: { id: userId } });
    // if (user) {
    //     await userRepo.remove(user);
    // }

    // const plant = await plantRepo.findOne({ where: { id: parseInt(plantId) } });
    // if (plant) {
    //     await plantRepo.remove(plant);
    // }

    // await AppDataSource.destroy();

    connection.end();
});

describe('Ensure plants.ts middleware works as expected', () => {

    function initializeValidData() {
        userId = 1000000; // 1 million
        data.name = 'validName';
        data.species = 'validSpecies';
        plantId = "1000000"; // 1 million
    };

    beforeEach(() => {
        initializeValidData();
    });
    
    test('missing or invalid user_id', async () => {
        const invalidData = { ...data, name: '', species: '' };
        const response = await request(app).post('/').send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'User ID is missing, token validation failed.'});
    });

    test('missing or invalid name', async () => {
        const invalidData = { ...data, name: '' };
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'There was an error processing your request, please ensure you fill out all fields.'});
    });

    test('missing or invalid species', async () => {
        const invalidData = { ...data, species: '' };
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'There was an error processing your request, please ensure you fill out all fields.'});
    });
    
    test('plant id is not a number', async () => {
        const invalidData = { ...data };
        const response = await request(app).post('/notANumber/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Plant ID must be a number.'});
    });

    test('plant id is negative', async () => {
        const invalidData = { ...data };
        const response = await request(app).post('/-1/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Plant ID must be a positive number.'});
    });

    test('plant does not exist', async () => {
        // jest.spyOn(plantRepo, 'findPlantById').mockResolvedValue(null);
        
        const response = await request(app).post('/' + plantId + '/' + userId).send(data);
        console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'Plant not found.'});

    });

    // creating and saving a new plant
    // const plantRepo = AppDataSource.getRepository(Plant);
    // const newPlant = new Plant();
    // newPlant.id = parseInt(plantId);
    // newPlant.user = { id: userId + 1 } as User;
    // newPlant.name = data.name;
    // newPlant.species = data.species;
    
    test('plant does not belong to user', async () => {
        // await userRepo.save(newUser);
        // await plantRepo.save(newPlant);
        const response = await request(app).post('/' + plantId + '/' + userId).send(data);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({message: 'You do not have permission to update this plant.'});
        // await plantRepo.remove(newPlant);
        // await userRepo.remove(newUser);
    });
    
    // newPlant.user = { id: userId } as User; // update to have correct user id
    

    test('user does not exist', async () => {
        // await plantRepo.save(newPlant);
        // jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);
        const response = await request(app).post('/' + plantId + '/' + userId).send(data);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'User not found.'});
    });

    test('name is too short', async () => {
        // await userRepo.save(newUser); // user in db, should pass previous tests
        const invalidData = { ...data,  name: 'a'};
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Name must be at least 3 characters.'});
    });

    test('name is too long', async () => {
        const invalidData = { ...data,  name: 'a'.repeat(101) };
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Name is too long, limit of 100 characters.'});
    });

    test('species is too short', async () => {
        const invalidData = { ...data, species: 'a'};
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Species must be at least 3 characters.'});
    });

    test('species is too long', async () => {
        const invalidData = { ...data, species: 'a'.repeat(101) };
        const response = await request(app).post('/' + plantId + '/' + userId).send(invalidData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Species is too long, limit of 100 characters.'});
    });

    test('middleware should complete successfully', async () => {
        const response = await request(app).post('/' + plantId + '/' + userId).send(data);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({message: 'middleware successfully completed'});
    });
});