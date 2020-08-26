import { Pool } from 'pg';

export const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "nascar38",
  port: 5432,
  database: "inventory-me"
});


