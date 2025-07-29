// import mysql from 'mysql2/promise';
var mysql = require('mysql2/promise');
// import dotenv from 'dotenv';
var dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'portfolioManager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool;  