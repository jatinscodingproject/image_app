const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes/index');
require('dotenv').config();
const fs = require('fs');

const app = express();
const server = http.createServer(app);



app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", routes);

// app.use('/imageapp', express.static(path.resolve('D:/imageapp')));

// app.use('/imageapp', (req, res, next) => {
//     const fullPath = path.join('D:/imageapp/', req.path);
//     console.log(`Requested File Path: ${fullPath}`);
//     if (fs.existsSync(fullPath)) {
//         res.sendFile(fullPath);
//     } else {
//         console.log('File not found');
//         res.status(404).send('File not found');
//     }
// });

const imageAppPath = path.resolve('/home/sftpuser11/test/imageapp');
app.use('/imageapp', express.static(imageAppPath));

// app.use('/home/sftpuser11/test/imageapp', (req, res) => {
//     const fullPath = path.join(imageAppPath, req.path);
//     console.log(`Requested File Path: ${fullPath}`);
//     if (fs.existsSync(fullPath)) {
//         res.sendFile(fullPath);
//     } else {
//         console.error('File not found:', fullPath);
//         res.status(404).send('File not found');
//     }
// });

const port = process.env.PORT || 3000;

sequelize.sync() 
    .then(() => {
        console.log('Database tables created successfully.');
        server.listen(port, '0.0.0.0', () => {
            console.log(`Server running on http://47.91.121.123:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

// Error Handling for Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason);
});
