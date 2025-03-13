import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../../src/db/db';
import { User } from '../../src/db/entities/user';
import { userRepository } from '../../src/db/repositories/user.repository';
import mysql, { ConnectionOptions } from 'mysql2/promise';
import { Repository } from 'typeorm';

var connection: mysql.Connection; // used to manually check database
var userRepo: Repository<User>;

beforeAll(async () => {
    await AppDataSource.initialize();
    userRepo = AppDataSource.getRepository(User);
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

describe('Ensure Auth Controller functions work as expected', () => {
    describe('Register User', () => {
        test('Missing fields', async () => {
            // add test
        });

        test('user already exists', async () => {
            // add test
        });

        test('successful registration', async () => {
            // add test
        });
    });

    describe('Login User', () => {
        test('Username missing', async () => {
            // add test
        });

        test('Password missing', async () => {
            // add test
        });

        test('User not found', async () => {
            // add test
        });

        test('Incorrect password', async () => {
            // add test
        });

        test('Successful login', async () => {
            // add test
        });
    });

    describe('Logout User', () => {
        test('successful logout', async () => {
            // add test
        });
    });
});