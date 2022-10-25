const expect = require('chai').expect;
const request = require('request');
const api = require('../index');

const port = process.env.PORT || 80;
const mongoUrl = process.env.MONGOURL;

before(done => {
    api.on('app_started', () => {
        done();
    });
});

describe('API', () => {
    //TODO: const testData = require('test-data.json');

    let baseUrl = `http://localhost:${ port }`;

    describe('Hello World Endpoint', () => {
        let url = baseUrl + '/helloWorld';

        it("returns status 200", (done) => {
            request(url, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it("returns 'Hello World!' in body", (done) => {
            request(url, (err, res, body) => {
                expect(body).to.equal('Hello World!');
                done();
            });
        });
    });

});