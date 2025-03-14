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
});

afterAll(async () => {
    await AppDataSource.destroy();
    await connection.destroy();
});

describe('Ensure plant controller functions work as expected', () => {
    describe('get plants', async () => {
        test('no user id provided', async () => {
            // add test
        });

        test('successful get plants', async () => {
            // add test
        });
    });

    describe('create plant', async () => {
        test('no user id provided', async () => {
            // add test
        });

        test('no name provided', async () => {
            // add test
        });

        test('no species provided', async () => {
            // add test
        });

        test('successful create plant', async () => {
            // add test
        });
    });

    describe('update plant', async () => {
        test('no plant id provided', async () => {
            // add test
        });

        test('no user id provided', async () => {
            // add test
        });

        test('no name provided', async () => {
            // add test
        });

        test('no species provided', async () => {
            // add test
        });

        test('successful update plant', async () => {
            // add test
        });
    });

    describe('delete plant', async () => {
        test('no plant id provided', async () => {
            // add test
        });

        test('successful delete plant', async () => {
            // add test
        });
    });
});