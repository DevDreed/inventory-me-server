const { Pool } = require("pg");
var config = {
  user: "postgres",
  database: "inventory-me",
  password: "nascar38",
  host: "localhost",
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};
export const db = new Pool(config);
