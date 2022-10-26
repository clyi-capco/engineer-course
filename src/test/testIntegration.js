const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoUnit = require('mongo-unit');
const testData = require('./testData.json');

let api;

const port = process.env.PORT;

mongoUnit.start({ dbName: 'test'}).then(() => {
    process.env.MONGOURL = mongoUnit.getUrl() + 'test';
    run();
}).then(() => {
    api = require('../index');
});

after(async () => {
    await mongoUnit.stop();
});

chai.use(chaiHttp);

describe('Integration', () => {
    before((done) => {
        server = api.listen(port, () => {
            done();
        });
    });
    
    beforeEach(() => mongoUnit.initDb(testData));
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
        
        describe('POST /users', () => {
            const route = '/users';

            it('return status 201', (done) => {
                chai.request(api)
                    .get(route)
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(201);
                        done();
                    });   
            });
        }); 

    });

});