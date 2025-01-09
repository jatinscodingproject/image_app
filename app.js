const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');
const model = require('./model/index');
require('dotenv').config();
const fs = require('fs')

const routes = require('./routes/index');
const exp = require('constants');
const { json } = require('sequelize');

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname , 'public')))

app.use("/api", routes)
// app.use('/imageapp', express.static(path.resolve('F:/imageapp')));

// app.use('/imageapp', (req, res, next) => {
//     const fullPath = path.join('F:/imageapp/', req.path);
//     console.log(`Requested File Path: ${fullPath}`);
//     if (fs.existsSync(fullPath)) {
//         res.sendFile(fullPath);
//     } else {
//         console.log('File not found');
//         res.status(404).send('File not found');
//     }
// });

// app.use('/imageapp', express.static(path.resolve('/home/sftpuser11/test/imageapp')));

// // Custom file serving route
// app.use('/imageapp', (req, res, next) => {
//     const fullPath = path.join('/home/sftpuser11/test/imageapp', req.path);
//     console.log(`Requested File Path: ${fullPath}`);
//     console.log(fs.existsSync(fullPath))
//     if (fs.existsSync(fullPath)) {
//         res.sendFile(fullPath);
//     } else {
//         console.log('File not found');
//         res.status(404).send('File not found');
//     }
// });

const port = process.env.PORT || 4000

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

