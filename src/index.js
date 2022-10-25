require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./swagger')

const app = express();

const port = process.env.PORT || 80;
const mongoUrl = process.env.MONGOURL;

const swaggerDocs = swaggerJsdoc(swaggerOptions);

mongoose.connect( mongoUrl ).then(() => {
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

    app.listen(port, () => {
        console.log(`listening on port ${ port }`);
        app.emit('app_started');
    });

}).catch(err => console.log(err));

module.exports = app;