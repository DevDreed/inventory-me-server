const { Pool } = require("pg");
var config = {
  user: "postgres",
  database: "inventory-me",
  password: "postgres",
  host: "localhost",
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};
export const pool = new Pool(config);
pool.on("error", function (err: any, client: any) {
  console.error("idle client error", err.message, err.stack);
});
pool.query("SELECT $1::int AS number", ["2"], function (err: any, res: any) {
  if (err) {
    return console.error("error running query", err);
  }
  console.log("number:", res.rows[0].number);
});
