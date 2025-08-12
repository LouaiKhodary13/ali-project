import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database.sqlite");
export const db = new Database(dbPath);

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    cust_id TEXT PRIMARY KEY,
    cust_name TEXT NOT NULL,
    cust_adr TEXT,
    cust_phone TEXT,
    cust_note TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    prod_id TEXT PRIMARY KEY,
    prod_name TEXT NOT NULL,
    prod_quant INTEGER NOT NULL,
    prod_price REAL NOT NULL,
    prod_note TEXT
  );

  CREATE TABLE IF NOT EXISTS bills (
    bill_id TEXT PRIMARY KEY,
    cust_id TEXT NOT NULL,
    prod_ids TEXT NOT NULL,
    bill_sum REAL NOT NULL,
    bill_date TEXT NOT NULL,
    bill_note TEXT,
    FOREIGN KEY (cust_id) REFERENCES customers (cust_id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    tran_id TEXT PRIMARY KEY,
    prod_ids TEXT NOT NULL,
    tran_source TEXT NOT NULL,
    tran_cost REAL NOT NULL,
    tran_date TEXT NOT NULL,
    tran_note TEXT
  );
`);
