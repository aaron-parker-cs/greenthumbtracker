import { expect, jest, test, describe, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { validatePlant } from '../src/middleware/plants';
import mysql, { ConnectionOptions, Connection } from 'mysql2';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
var connection: Connection;

const userId = 1000000; // 1 million
const plantId = "2000000"; // 1 million

const data = {
    name: 'validName',
    species: 'validSpecies',
};

const tempUserData = {
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

    function addUser(user_id: number, username: string, email: string, password: string) {
        let addUser = 'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)';
        let userValues = [user_id, username, email, password];
        connection.execute(addUser, userValues, (err: any) => {
            if(err) throw err;
        });
    }

    function addPlant(plant_id: string, user_id: number, name: string, species: string) {
        let addPlant = 'INSERT INTO plants (id, user_id, name, species) VALUES (?, ?, ?, ?)';
        let plantValues = [plant_id, user_id, name, species];
        connection.execute(addPlant, plantValues, (err: any) => {
            if(err) throw err;
        });
    }

    function removeUser(user_id: number){
        let removeUser = 'DELETE FROM users WHERE id=?';
        connection.execute(removeUser, [user_id], (err: any) => {
            if(err) throw err;
        });
    }

    function removePlant(plant_id: string){
        let removePlant = 'DELETE FROM plants WHERE id=?';
        connection.execute(removePlant, [plant_id], (err: any) => {
            if(err) throw err;
        });
    }

    beforeEach((done) => {
        // enter valid data into database
        addUser(tempUserData.id, tempUserData.username, tempUserData.email, tempUserData.password);
        addPlant(plantId, userId, data.name, data.species);
        done();
    });

    afterEach((done) => {
        // remove valid data from database
        removePlant(plantId);
        removeUser(userId);
        done();
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
        // console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'Plant not found.'});

    });
    
    test('plant does not belong to user', async () => {
        
        const response = await request(app).post('/' + plantId + '/' + (userId + 1)).send(data);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({message: 'You do not have permission to update this plant.'});
    });

    test('user does not exist', async () => {
        // remove user from database leaving plant without a user
        let removeUser = 'DELETE FROM users WHERE id=?';
        connection.execute(removeUser, [userId], (err: any) => {
            if(err) throw err;
        });

        const response = await request(app).post('/' + plantId + '/' + userId).send(data);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'User not found.'});
        
        // re-add user to database so removing during afterEach() doesn't fail
        addUser(tempUserData.id, tempUserData.username, tempUserData.email, tempUserData.password);
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