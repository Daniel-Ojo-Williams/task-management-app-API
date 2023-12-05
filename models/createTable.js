import pool from "../db/connectdb.js";

const createTable = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS "users" CASCADE');
    const users =
      'CREATE TABLE IF NOT EXISTS "users"(userId SERIAL PRIMARY KEY, fullname TEXT, email TEXT UNIQUE, passwordHash TEXT)';

    await pool.query(users);

    await pool.query('DROP TABLE IF EXISTS "tasks"');
    const tasks =
      'CREATE TABLE IF NOT EXISTS "tasks"(taskId SERIAL PRIMARY KEY, title TEXT, description TEXT, status TEXT, dueDate DATE NOT NULL, userId SERIAL REFERENCES "users" (userId) )';

    await pool.query(tasks);
  } catch (error) {
    console.error(error.message);
  }
};

export default createTable;
