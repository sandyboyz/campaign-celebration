/* eslint-disable @typescript-eslint/no-var-requires */

const { Client } = require('pg');

require('dotenv').config();

const dbName = process.env.dbName;
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async function () {
  try {
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await client.query(`CREATE DATABASE ${dbName}`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw error;
  }
})();
