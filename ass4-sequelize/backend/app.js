const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const logRequest = (req, res, next) => {
    console.log(`Received ${req.method} request for URL: ${req.url}`);
    next();
};
app.use(logRequest);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});