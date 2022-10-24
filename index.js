require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('team course RESTful API');
});

app.get('/helloWorld', (req, res) => {
    res.send('Hello World!');
    console.log(`responded to request for ${ req.originalUrl }`)
});

app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});