const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? {
            rejectUnauthorized: false
          }
        : false
});

// Handle idle client errors so process doesn't exit unexpectedly
pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

const connectDB = async () => {
    if (!process.env.DATABASE_URL) {
        console.warn("Neon database notice: DATABASE_URL not configured in server/.env. Database operations will be inactive.");
        console.warn("Verify DATABASE_URL in server/.env when database operations are required.");
        return;
    }

    try {
        await pool.query("SELECT 1");
        console.log("Neon PostgreSQL connected successfully!");
    } catch (error) {
        console.warn("Neon database connection warning:", error.message || error);
        console.warn("Backend will continue running. Verify DATABASE_URL in server/.env when database operations are required.");
    }
};

module.exports = { pool, connectDB };