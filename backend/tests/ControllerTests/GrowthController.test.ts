import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../../src/db/db';
import { User } from '../../src/db/entities/user';
import { Plant } from '../../src/db/entities/plant';
import { GrowthRecord } from '../../src/db/entities/growth_record';
import { userRepository } from '../../src/db/repositories/user.repository';
import { plantRepository } from '../../src/db/repositories/plant.repository';
import { growthRepository } from '../../src/db/repositories/growth.repository';
import mysql, { ConnectionOptions } from 'mysql2/promise';
import { Repository } from 'typeorm';

var connection: mysql.Connection; // used to manually check database
var userRepo: Repository<User>; // need to add Users to database to add Plants
var plantRepo: Repository<Plant>;
var growthRepo: Repository<GrowthRecord>;

beforeAll(async () => {
    await AppDataSource.initialize();
    userRepo = AppDataSource.getRepository(User);
    plantRepo = AppDataSource.getRepository(Plant);
    growthRepo = AppDataSource.getRepository(GrowthRecord);
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

describe('Ensure growth controller functions work as expected', () => {
    describe('Get Growth Records', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful get growth records', async () => {
            // add test
        });
    });

    describe('Create Growth Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful create growth record', async () => {
            // add test
        });
    });

    describe('Update Growth Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful update growth record', async () => {
            // add test
        });
    });

    describe('Delete Growth Record', () => {
        test('no user ID provided', async () => {
            // add test
        });

        test('successful delete growth record', async () => {
            // add test
        });
    });
});