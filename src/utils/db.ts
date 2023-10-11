import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const dbPool = new Pool({
  user: process.env.DB_USER,
  host: "127.0.0.1",
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// create database if it doesn't exist
const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await dbPool.query(usersTable).catch((error) => {
    console.log("error creating users table", error);
  });
};

export { dbPool, createTables };
