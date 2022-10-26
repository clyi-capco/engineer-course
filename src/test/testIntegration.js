const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoUnit = require('mongo-unit');
const testData = require('./testData.json');

let api;

const port = process.env.PORT;

mongoUnit.start({ dbName: 'test'}).then(() => {
    //set global MONGOURL to test db url
    process.env.MONGOURL = mongoUnit.getUrl() + 'test';
    run();
}).then(() => {
    //run api
    api = require('../index');
});

//stop test mongodb when tests finished
after(async () => {
    await mongoUnit.stop();
});

chai.use(chaiHttp);

describe('Integration', () => {
    //begin listening for api calls
    before((done) => {
        server = api.listen(port, () => {
            done();
        });
    });
    
    //create database out of testData collection before each test
    beforeEach(() => mongoUnit.initDb(testData));
    //delete database after each test
    afterEach(() => mongoUnit.dropDb());

    describe('GET /helloWorld', () => {
        const route = '/helloWorld';

        it('return status 200', (done) => {
            chai.request(api)
                .get(route)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });   
        });

        it('return "Hello World!"', (done) => {
            chai.request(api)
                .get(route)
                .end((err, res) => {
                    expect(res.text).to.equal('Hello World!');
                    done();
                });   
        });
    });

    describe('/users', () => {

        describe('GET /users', () => {
            const route = '/users';

            it('return status 200', (done) => {
                chai.request(api)
                    .get(route)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });   
            });

            it('return array', (done) => {
                chai.request(api)
                    .get(route)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.above(0);
                        done();
                    });   
            });

            it('return array elements as users', (done) => {
                chai.request(api)
                    .get(route)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.above(0);
                        expect(Object.keys(res.body[0])[1]).to.equal('firstName');
                        expect(Object.keys(res.body[0])[2]).to.equal('lastName');
                        done();
                    });   
            });
        }); 
        
        describe('GET /users/:id', () => {
            const _id = '6357ece3d07584a6f52d704e';
            const route = '/users/' + _id;

            it('return correct user based off id', (done) => {
                chai.request(api)
                    .get(route)
                    .end((err, res) => {
                        console.log(res.body);
                        expect(res.statusCode).to.equal(200);
                        expect(Object.keys(res.body)[1]).to.equal('firstName');
                        expect(Object.keys(res.body)[2]).to.equal('lastName');
                        done();
                    });   
            });
        });

        describe('POST /users', () => {
            const route = '/users';

            it('return status 201', (done) => {
                chai.request(api)
                    .post(route)
                    .set('content-type', 'application/json')
                    .send({
                        'firstName': 'Michael',
                        'lastName': 'Owens'
                    })
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(201);
                        done();
                    });   
            });

            it('return _id of new user', (done) => {
                chai.request(api)
                    .post(route)
                    .set('content-type', 'application/json')
                    .send({
                        'firstName': 'Michael',
                        'lastName': 'Owens'
                    })
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(201);
                        expect(Object.keys(res.body)[2]).to.equal('_id');
                        done();
                    });   
            });
        }); 

    });

});