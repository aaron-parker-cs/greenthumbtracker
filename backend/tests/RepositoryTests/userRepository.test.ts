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

describe('Ensure user repository functions work as expected', () => {

    describe('Find User functions', () => {

        let findUser = {
            id: null,
            username: 'TestUsernameForFindUser',
            email: 'TestForFinding@Email.com',
            password: 'findTestPassword1234',
            img: ''
        };
        let compareUser = new User();
        beforeAll(async () => {
            let addUserQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
            let addUserValues = [findUser.username, findUser.email, findUser.password];
            let [result] = await connection.execute(addUserQuery, addUserValues);
            findUser.id = (result as any).insertId;
        });

        afterAll(async () => {
            let deleteUserQuery = 'DELETE FROM user WHERE id = ?';
            let deleteUserValues = [findUser.id];
            await connection.execute(deleteUserQuery, deleteUserValues);
            // reset AUTO_INCREMENT value
            await connection.execute('ALTER TABLE user AUTO_INCREMENT = ' + findUser.id);
        });

        beforeEach(() => {
            compareUser.id = findUser.id || 0;
            compareUser.username = findUser.username;
            compareUser.email = findUser.email;
            compareUser.img = findUser.img;
        });

        test('findOneByEmailOrUsername valid email supplied', async () => {
            const repoUser = await userRepository.findOneByEmailOrUsername(findUser.email, 'InvalidUsername');
            expect(repoUser).toEqual(compareUser);
        });
    
        test('findOneByEmailOrUsername valid username supplied', async () => {
            const repoUser = await userRepository.findOneByEmailOrUsername('InvalidEmail@email.com', findUser.username);
            expect(repoUser).toEqual(compareUser);
        });
    
        test('findOneByEmailOrUsername invalid data supplied', async () => {
            const repoUser = await userRepository.findOneByEmailOrUsername('InvalidEmail@email.com', 'InvalidUsername');
            expect(repoUser).toBeNull();
        });
    
        test('findUserByUsername valid username supplied', async () => {
            const repoUser = await userRepository.findUserByUsername(findUser.username);
            expect(repoUser).toEqual(compareUser);
        });
    
        test('findUserByUsername invalid username supplied', async () => {
            const repoUser = await userRepository.findUserByUsername('InvalidUsername');
            expect(repoUser).toBeNull();
        });
    
        test('findUserByEmail valid email supplied', async () => {
            const repoUser = await userRepository.findUserByEmail(findUser.email);
            expect(repoUser).toEqual(compareUser);
        });
    
        test('findUserByEmail invalid email supplied', async () => {
            const repoUser = await userRepository.findUserByEmail('InvalidEmail@email.com');
            expect(repoUser).toBeNull();
        });
    
        test('findUserById valid id supplied', async () => {
            const repoUser = await userRepository.findUserById((findUser.id as unknown as number));
            expect(repoUser).toEqual(compareUser);
        });
    
        test('findUserById invalid id supplied', async () => {
            const repoUser = await userRepository.findUserById(0);
            expect(repoUser).toBeNull();
        });
    });

    test('createUser with valid data', async () => {
        let createdUser = await userRepository.createUser('createUserTestname', 'createUser@email.com', 'createUserPassword1234');
        let q = 'SELECT * FROM user WHERE username=\'createUserTestname\'';
        let [result] = await connection.execute(q);
        let dbUser = (result as any)[0];
        expect(createdUser.username).toBe(dbUser.username);
        q = 'DELETE FROM user WHERE id=' + dbUser.id;
        await connection.execute(q);
    });

    // next test features not implemented yet

    // test('editUsername with valid data', async () => {
    //     expect(1).toBe(1);
    // });

    // test('editUsername when new username already exists', async () => {
    //     expect(1).toBe(1);
    // });

    // test('editPassword', async () => {
    //     expect(1).toBe(1);
    // });
});