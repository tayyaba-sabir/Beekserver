const express = require('express')
const app = express();
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const { Sequelize }  =  require('sequelize');
const config = require('./config/config.json');
const cors = require('cors');
require('dotenv').config();


const sequelize = new Sequelize(config.development);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(cors());
app.use(express.json());
app.use('/', users);
app.use('/', jobs);



const server = () => {
    app.listen(5000, () => {
        console.log('server is listening on 5000');
    });
}

server();
