require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./swagger');
const service = require('./service');
const log4js = require('log4js');

//create log directory if not exists
try {
    require('fs').mkdirSync('./log');
} catch (err) {
    if(err.code != 'EEXIST') {
        throw err;
    }
}

//logging
log4js.configure('./config/log4js.json');
log = log4js.getLogger('app');

//express init
const app = express();

const port = process.env.PORT || 80;

//swagger stuff
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json());

/**
 * @swagger
 * /helloWorld:
 *      get:
 *          description: Say hello to the world
 *          responses: 
 *              200:
 *                  description: Success
 */
app.get('/helloWorld', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /users:
 *      get:
 *          description: Return all users from db
 *          responses: 
 *              200:
 *                  description: Success
 */
app.get('/users', (req, res) => {
    service.getUsers().then(users => res.json(users));
});

/**
 * @swagger
 * /users/:id:
 *      get:
 *          description: Return specific user by id
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                description: id of the user to get.
 */
app.get('/users/:id', (req, res) => {
    try {
        service.getUser(req.params.id).then(user => res.json(user));
    } catch(err) {
        res.status(404).send({
            message: "User not found"
        })
    }
});

/**
 * @swagger
 * /users:
 *      post:
 *          description: Create new user
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            description: The user to create.
 *            schema:
 *              type: object
 *              required:
 *                  - firstName
 *                  - lastName
 *              properties:
 *                  firstName: 
 *                      type: string
 *                  lastName:
 *                      type: string
 *      reponses: 
 *          201:
 *              description: Created
 * 
 */
app.post('/users', (req, res) => {
    if(!req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            message: "Missing required fields"
        })
    } else {
        res.status(201);
        service.addUser(req.body.firstName, req.body.lastName).then(data => res.json(data));
    }
});

//only run if called directly, don't run if called through require()
if(require.main === module) {
    app.listen(port, () => {
        console.log(`listening on port ${ port }`);
    });
}

module.exports = app;