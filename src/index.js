require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./swagger');
const service = require('./service');

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

app.get('/users/:id', (req, res) => {
    try {
        service.getUser(req.params.id).then(user => res.json(user));
    } catch(err) {
        res.status(404).send({
            message: "User not found"
        })
    }
});

app.post('/users', (req, res) => {
    if(!req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            message: "Missing required fields"
        })
    } else {
        res.status(201);
        service.addUser(req.body).then(data => res.json(data));
    }
    
});

//only run if called directly, don't run if called through require()
if(require.main === module) {
    app.listen(port, () => {
        console.log(`listening on port ${ port }`);
    });
}

module.exports = app;