const expect = require('chai').expect;
const mongoose = require('mongoose');
const mongoUnit = require('mongo-unit');
const testData = require('./testData.json');

let service;

//start local mongodb with db 'test'
mongoUnit.start({ dbName: 'test'}).then(() => {
    process.env.MONGOURL = mongoUnit.getUrl() + 'test';
    //execute mocha tests
    run();
}).then(() => {
    //load db handler
    service = require('../service');
});

//stop test mongodb on tests finished
after(async () => {
    await mongoUnit.stop();
});

describe('Unit', () => {
    //create database out of testData collection before each test
    beforeEach(() => mongoUnit.initDb(testData));
    //delete database after each test
    afterEach(() => mongoUnit.dropDb());

    describe('getUsers', () => {

        it('return all users', () => {
            return service.getUsers()
                .then(users => {
                    expect(users.length).to.be.above(0);
                    expect(Object.keys(users[0].toJSON())).contains('id');
                    expect(Object.keys(users[0].toJSON())).contains('firstName');
                    expect(Object.keys(users[0].toJSON())).contains('lastName');
                });
        });

    });

    describe('getUser (from id)', () => {
        it('return single user', () => {
            id = 0;
            return service.getUser(id)
                .then(user => {
                    expect(user).is.not.null;
                    expect(Object.keys(user.toJSON())).contains('id');
                    expect(Object.keys(user.toJSON())).contains('firstName');
                    expect(Object.keys(user.toJSON())).contains('lastName');
                });
        });
    });

    describe('addUser', () => {

        it('adds user to database', () => {
            const params = { 'firstName': 'James', 'lastName': 'Atkinson'};
            return service.addUser(params.firstName, params.lastName);
        });

        it('returns new user _id, firstName and lastName', () => {
            const params = { 'firstName': 'James', 'lastName': 'Atkinson'};
            return service.addUser(params.firstName, params.lastName).then(res => {
                expect(Object.keys(res.toJSON())).contains('id');
                expect(Object.keys(res.toJSON())).contains('firstName');
                expect(Object.keys(res.toJSON())).contains('lastName');
            });
        });

    });

});