// import { Client } from 'pg';
import pkg from "pg";
const { Pool } = pkg;

const client = new Pool({
  host: "localhost",
  port: 5432,
  database: "freakydmuse",
  user: "freakydmuse",
  password: "Owdanny400",
});

export default client;
