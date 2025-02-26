import { beforeEach, describe } from "node:test";
import { api } from "../src/redux/api";
import { expect, jest, test } from '@jest/globals';

// EXAMPLE TEST
// const sum = (a: any, b: any) => a + b;

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

// WHEN WRITING TESTS, ADD THE TEST BLOCK WITHIN ITS RESPECTIVE DESCRIBE BLOCK

// login
describe('login tests', () => {

});

// register
describe('register tests', () => {
    const inputs = {
        username: '',
        email: '',
        password: '',
    };
    beforeEach(() => {
        inputs.username = '';
        inputs.email = '';
        inputs.password = '';
    });
});

// logout
describe('logout tests', () => {

});

// getPlants
describe('getPlants tests', () => {

});

// getPlantById
describe('getPlantById tests', () => {

});

// addPlant
describe('addPlant tests', () => {
    
});

// updatePlant
describe('updatePlant tests', () => {

});

// deletePlant
describe('deletePlant tests', () => {

});