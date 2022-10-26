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

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(bodyParser.json());

app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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
    //console.log(`responded to request for ${ req.originalUrl }`);
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

app.post('/users', (req, res) => {
    if(!req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            message: "Missing required fields"
        })
    } else {
        service.addUser(req.body).then(data => res.json(data));
    }
    
});

app.listen(port, () => {
    console.log(`listening on port ${ port }`);
    app.emit('app_started');
});

module.exports = app;