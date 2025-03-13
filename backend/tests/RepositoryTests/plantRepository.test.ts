import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../../src/db/db';
import { User } from '../../src/db/entities/user';
import { Plant } from '../../src/db/entities/plant';
import { userRepository } from '../../src/db/repositories/user.repository';
import { plantRepository } from '../../src/db/repositories/plant.repository';
import mysql, { ConnectionOptions } from 'mysql2/promise';
import { Repository } from 'typeorm';

var connection: mysql.Connection; // used to manually check database
var userRepo: Repository<User>; // need to add Users to database to add Plants
var plantRepo: Repository<Plant>;

let userForPlants = {
    id: null,
    username: 'TestUsernameForPlantRepoTesting',
    email: 'testEmailForPlantRepoTesting@email.com',
    password: 'testPasswordForPlantRepoTesting1234',
    img: ''
};

beforeAll(async () => {
    await AppDataSource.initialize();
    userRepo = AppDataSource.getRepository(User);
    plantRepo = AppDataSource.getRepository(Plant);
    connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    // Add a user to the database
    let addUserQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
    let addUserValues = [userForPlants.username, userForPlants.email, userForPlants.password];
    let [result] = await connection.execute(addUserQuery, addUserValues);
    userForPlants.id = (result as any).insertId;
});

afterAll(async () => {
    let deleteUserQuery = 'DELETE FROM user WHERE id = ?';
    let deleteUserValues = [userForPlants.id];
    await connection.execute(deleteUserQuery, deleteUserValues);
    // reset AUTO_INCREMENT value
    await connection.execute('ALTER TABLE user AUTO_INCREMENT = ' + userForPlants.id);

    await AppDataSource.destroy();
    await connection.destroy();
});

describe('Ensure plant repository functions work as expected', () => {

    describe('Find Plant functions', () => {

        beforeAll(async () => {
            
        });

        afterAll(async () => {
            
        });

        beforeEach(() => {
           
        });

        test('Find Plant by ID with valid ID', async () => {
            
        });

        test('Find Plant by ID with invalid ID', async () => {
            
        });

        test('Find Plants by User ID with valid ID', async () => {
            
        });

        test('Find Plants by User ID with invalid ID', async () => {
            
        });
    });

    // Create Plant
    test('Create Plant with valid data', async () => {
        let newPlant = {
            name: 'TestPlantName2',
            species: 'TestPlantSpecies2'
        };
        let createdPlant = await plantRepository.createPlant(
            (userForPlants.id as unknown as number), 
            newPlant.name, 
            newPlant.species
        );
        let q = 'SELECT * FROM plant WHERE id = ?';
        let [result] = await connection.execute(q, [createdPlant.id]);
        let dbPlant = (result as any)[0];
        expect(createdPlant.name).toEqual(dbPlant.name);
        expect(createdPlant.species).toEqual(dbPlant.species);
        q = 'DELETE FROM plant WHERE id=' + createdPlant.id;
        await connection.execute(q);
    });

    // Update Plant
    test('Update Plant with valid data', async () => {

    });

    // Delete Plant
    test('Delete Plant with valid ID', async () => {

    });

});