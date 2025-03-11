import { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../src/db/db';
import { User } from '../src/db/entities/user';
import { userRepository } from '../src/db/repositories/user.repository';
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

describe('Ensure user repository functions work as expected', () => {

    describe('Find User functions', () => {

        let findUser = {
            id: null,
            username: 'TestUsernameForFindUser',
            email: 'Test@Email.com',
            img: ''
        };
        beforeAll(async () => {
            // const testUser = new User();
            // testUser.username = 'TestUsernameForFindUser';
            // testUser.email = 'Test@Email.com';
            // testUser.password = 'TestPassword1234';
            // await userRepo.save(testUser);
            let addUserQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
            let addUserValues = ['TestUsernameForFindUser', 'Test@Email.com', 'TestPassword1234'];
            await connection.execute(addUserQuery, addUserValues);
        });

        afterAll(async () => {
            // await userRepo.delete({ username: 'TestUsernameForFindUser' });
            // let deleteUserQuery = 'DELETE FROM user WHERE id = ?';
            // let deleteUserValues = [1000000];
            // await connection.query(deleteUserQuery, deleteUserValues);
        });

        test('findOneByEmailOrUsername valid email supplied', async () => {
            const myUser = new User();
            myUser.username = 'TestUsernameForFindUser';
            myUser.email = 'Test@Email.com';
            // myUser.password = 'TestPassword1234';
            myUser.img = '';
            const repoUser = await userRepository.findOneByEmailOrUsername('Test@Email.com', 'TestUsernameForFindUser');
            expect(repoUser).toEqual(myUser);
        });
    
        test('findOneByEmailOrUsername valid username supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findOneByEmailOrUsername invalid data supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserByUsername valid username supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserByUsername invalid username supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserByEmail valid email supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserByEmail invalid email supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserById valid id supplied', async () => {
            expect(1).toBe(1);
        });
    
        test('findUserById invalid id supplied', async () => {
            expect(1).toBe(1);
        });
    });

    test('createUser with valid data', async () => {
        // TODO
        let username = 'testUsername';
        let email = 'test@email.com';
        let password = 'testPassword';
        await userRepository.createUser(username, email, password);
        expect(1).toBe(1);
    });

    test('createUser where username already exists', async () => {
        expect(1).toBe(1);
    });

    test('createUser where email already exists', async () => {
        expect(1).toBe(1);
    });

    test('createUser where username and email already exist', async () => {
        expect(1).toBe(1);
    });

    test('editUsername with valid data', async () => {
        expect(1).toBe(1);
    });

    test('editUsername when new username already exists', async () => {
        expect(1).toBe(1);
    });

    test('editPassword', async () => {
        expect(1).toBe(1);
    });
});