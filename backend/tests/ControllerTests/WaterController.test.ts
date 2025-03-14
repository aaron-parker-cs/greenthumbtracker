import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../../src/db/db';
import { User } from '../../src/db/entities/user';
import { Plant } from '../../src/db/entities/plant';
import { WaterRecord } from '../../src/db/entities/water_record';
import { userRepository } from '../../src/db/repositories/user.repository';
import { plantRepository } from '../../src/db/repositories/plant.repository';
import { waterRepository } from '../../src/db/repositories/water.repository';
import mysql, { ConnectionOptions } from 'mysql2/promise';
import { Repository } from 'typeorm';

var connection: mysql.Connection; // used to manually check database
var userRepo: Repository<User>; // need to add Users to database to add Plants
var plantRepo: Repository<Plant>;
var waterRepo: Repository<WaterRecord>;

beforeAll(async () => {
    await AppDataSource.initialize();
    userRepo = AppDataSource.getRepository(User);
    plantRepo = AppDataSource.getRepository(Plant);
    waterRepo = AppDataSource.getRepository(WaterRecord);
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

describe('Ensure water controller functions work as expected', () => {
    describe('Get Water Records', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful get water records', async () => {
            // add test
        });
    });

    describe('Create Water Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful create water record', async () => {
            // add test
        });
    });

    describe('Update Water Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful update water record', async () => {
            // add test
        });
    });

    describe('Delete Water Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful delete water record', async () => {
            // add test
        });
    });
});