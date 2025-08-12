import { db } from "./connection";
import { Customer, Product, Bill, Transaction } from "@/app/types";

// Customers
export const customers = {
  create: (data: Customer) => {
    const stmt = db.prepare(`
      INSERT INTO customers (cust_id, cust_name, cust_adr, cust_phone, cust_note)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.cust_id,
      data.cust_name,
      data.cust_adr,
      data.cust_phone,
      data.cust_note
    );
  },

  getAll: (): Customer[] => {
    return db.prepare("SELECT * FROM customers").all() as Customer[];
  },

  getById: (id: string): Customer | undefined => {
    return db
      .prepare("SELECT * FROM customers WHERE cust_id = ?")
      .get(id) as Customer;
  },

  update: (id: string, data: Partial<Customer>) => {
    const fields = Object.keys(data).filter((key) => key !== "cust_id");
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => data[field as keyof Customer]);

    const stmt = db.prepare(
      `UPDATE customers SET ${setClause} WHERE cust_id = ?`
    );
    return stmt.run(...values, id);
  },

  delete: (id: string) => {
    return db.prepare("DELETE FROM customers WHERE cust_id = ?").run(id);
  },
};

// Products
export const products = {
  create: (data: Product) => {
    const stmt = db.prepare(`
      INSERT INTO products (prod_id, prod_name, prod_quant, prod_price, prod_note)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.prod_id,
      data.prod_name,
      data.prod_quant,
      data.prod_price,
      data.prod_note
    );
  },

  getAll: (): Product[] => {
    return db.prepare("SELECT * FROM products").all() as Product[];
  },

  getById: (id: string): Product | undefined => {
    return db
      .prepare("SELECT * FROM products WHERE prod_id = ?")
      .get(id) as Product;
  },

  update: (id: string, data: Partial<Product>) => {
    const fields = Object.keys(data).filter((key) => key !== "prod_id");
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => data[field as keyof Product]);

    const stmt = db.prepare(
      `UPDATE products SET ${setClause} WHERE prod_id = ?`
    );
    return stmt.run(...values, id);
  },

  delete: (id: string) => {
    return db.prepare("DELETE FROM products WHERE prod_id = ?").run(id);
  },
};

// Bills
export const bills = {
  create: (data: Bill) => {
    const stmt = db.prepare(`
      INSERT INTO bills (bill_id, cust_id, prod_ids, bill_sum, bill_date, bill_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.bill_id,
      data.cust_id,
      JSON.stringify(data.prod_ids),
      data.bill_sum,
      data.bill_date,
      data.bill_note
    );
  },

  getAll: (): Bill[] => {
    const rows = db.prepare("SELECT * FROM bills").all();
    return rows.map((row: any) => ({
      ...row,
      prod_ids: JSON.parse(row.prod_ids),
    })) as Bill[];
  },

  getById: (id: string): Bill | undefined => {
    const row = db
      .prepare("SELECT * FROM bills WHERE bill_id = ?")
      .get(id) as any;
    if (!row) return undefined;
    return {
      ...row,
      prod_ids: JSON.parse(row.prod_ids),
    } as Bill;
  },

  update: (id: string, data: Partial<Bill>) => {
    const updateData = { ...data };
    if (updateData.prod_ids) {
      updateData.prod_ids = JSON.stringify(updateData.prod_ids) as any;
    }

    const fields = Object.keys(updateData).filter((key) => key !== "bill_id");
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updateData[field as keyof Bill]);

    const stmt = db.prepare(`UPDATE bills SET ${setClause} WHERE bill_id = ?`);
    return stmt.run(...values, id);
  },

  delete: (id: string) => {
    return db.prepare("DELETE FROM bills WHERE bill_id = ?").run(id);
  },
};

// Transactions
export const transactions = {
  create: (data: Transaction) => {
    const stmt = db.prepare(`
      INSERT INTO transactions (tran_id, prod_ids, tran_source, tran_cost, tran_date, tran_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.tran_id,
      JSON.stringify(data.prod_ids),
      data.tran_source,
      data.tran_cost,
      data.tran_date,
      data.tran_note
    );
  },

  getAll: (): Transaction[] => {
    const rows = db.prepare("SELECT * FROM transactions").all();
    return rows.map((row: any) => ({
      ...row,
      prod_ids: JSON.parse(row.prod_ids),
    })) as Transaction[];
  },

  getById: (id: string): Transaction | undefined => {
    const row = db
      .prepare("SELECT * FROM transactions WHERE tran_id = ?")
      .get(id) as any;
    if (!row) return undefined;
    return {
      ...row,
      prod_ids: JSON.parse(row.prod_ids),
    } as Transaction;
  },

  update: (id: string, data: Partial<Transaction>) => {
    const updateData = { ...data };
    if (updateData.prod_ids) {
      updateData.prod_ids = JSON.stringify(updateData.prod_ids) as any;
    }

    const fields = Object.keys(updateData).filter((key) => key !== "tran_id");
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map(
      (field) => updateData[field as keyof Transaction]
    );

    const stmt = db.prepare(
      `UPDATE transactions SET ${setClause} WHERE tran_id = ?`
    );
    return stmt.run(...values, id);
  },

  delete: (id: string) => {
    return db.prepare("DELETE FROM transactions WHERE tran_id = ?").run(id);
  },
};
