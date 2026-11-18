require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// SESSION CONFIGURATION
// ==================================
// MIDDLEWARE
// ==================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==================================
// MYSQL DATABASE CONNECTION
// ==================================

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456789aAa",
    database: process.env.DB_NAME || "sermark_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL database connected successfully!");
    connection.release();
});

// Make database available to backend routes
app.locals.db = db;

// ==================================
// BACKEND API ROUTES
// ==================================

const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
app.use("/api/products", require("./routes/products"));
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

// ==================================
// API TEST
// ==================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working!"
    });
});

// Optional GET checks for your POST endpoints
app.get("/api/register", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Registration endpoint exists. Submit registration using POST."
    });
});

app.get("/api/login", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login endpoint exists. Submit login using POST."
    });
});

// ==================================
// API NOT FOUND
// ==================================

app.use("/api", (req, res) => {
    console.log("Unknown API request:", req.method, req.originalUrl);

    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
        method: req.method,
        url: req.originalUrl
    });
});

// ==================================
// FRONTEND STATIC FILES
// ==================================

app.use(express.static(path.join(__dirname, "public")));

// ==================================
// PAGE NOT FOUND
// ==================================

app.use((req, res) => {
    res.status(404).send("Page not found.");
});

// ==================================
// GLOBAL ERROR HANDLER
// ==================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

// ==================================
// START SERVER
// ==================================

app.listen(PORT, () => {
    console.log("================================");
    console.log("SERMARK Server Started");
    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Register: http://localhost:${PORT}/register.html`);
    console.log(`Login: http://localhost:${PORT}/`);
    console.log(`Register API: http://localhost:${PORT}/api/register`);
    console.log(`Login API: http://localhost:${PORT}/api/login`);
    console.log(`Test API: http://localhost:${PORT}/api/test`);
    console.log("================================");
});
