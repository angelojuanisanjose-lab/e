require('dotenv').config();
const mysql = require('mysql2/promise');
const { app } = require('./server');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456789aAa',
    database: process.env.DB_NAME || 'sermark_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('MySQL connected successfully!');
        connection.release();
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
    }
})();

module.exports = db;// ======================================
// UNKNOWN API ROUTE
// ======================================
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

