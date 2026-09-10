const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Neon PostgreSQL connected successfully!");
    } catch (error) {
        console.warn("Neon database connection warning:", error.message);
        console.warn("Backend will continue running. Verify DATABASE_URL in server/.env when database operations are required.");
    }
};

module.exports = { pool, connectDB };