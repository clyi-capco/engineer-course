require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});