const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');
const model = require('./model/index');
require('dotenv').config();

const routes = require('./routes/index');
const exp = require('constants');
const { json } = require('sequelize');

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname , 'public')))

app.use("/api", routes)

const port = process.env.PORT || 3000

sequelize.sync()
    .then(() => {
        console.log('Tables created successfully');
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

