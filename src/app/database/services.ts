import { Customer, Product, Bill, Transaction } from "@/app/types";
import {
  openDB,
  addItem,
  getItem,
  getAllItems,
  updateItem,
  deleteItem,
} from "./connection";

// Helper function to ensure database is ready
async function ensureDB() {
  await openDB();
}

// Customers
export const customers = {
  create: async (data: Customer) => {
    await ensureDB();
    return addItem("customers", data);
  },

  getAll: async (): Promise<Customer[]> => {
    await ensureDB();
    return getAllItems("customers");
  },

  getById: async (id: string): Promise<Customer | undefined> => {
    await ensureDB();
    return getItem("customers", id);
  },

  update: async (id: string, data: Partial<Customer>) => {
    await ensureDB();
    const existingCustomer = await getItem("customers", id);
    if (!existingCustomer) throw new Error("Customer not found");
    const updatedCustomer = { ...existingCustomer, ...data };
    return updateItem("customers", updatedCustomer);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("customers", id);
  },
};

// Products
export const products = {
  create: async (data: Product) => {
    await ensureDB();
    return addItem("products", data);
  },

  getAll: async (): Promise<Product[]> => {
    await ensureDB();
    return getAllItems("products");
  },

  getById: async (id: string): Promise<Product | undefined> => {
    await ensureDB();
    return getItem("products", id);
  },

  update: async (id: string, data: Partial<Product>) => {
    await ensureDB();
    const existingProduct = await getItem("products", id);
    if (!existingProduct) throw new Error("Product not found");
    const updatedProduct = { ...existingProduct, ...data };
    return updateItem("products", updatedProduct);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("products", id);
  },
};

// Bills
export const bills = {
  create: async (data: Bill) => {
    await ensureDB();
    return addItem("bills", data);
  },

  getAll: async (): Promise<Bill[]> => {
    await ensureDB();
    return getAllItems("bills");
  },

  getById: async (id: string): Promise<Bill | undefined> => {
    await ensureDB();
    return getItem("bills", id);
  },

  update: async (id: string, data: Partial<Bill>) => {
    await ensureDB();
    const existingBill = await getItem("bills", id);
    if (!existingBill) throw new Error("Bill not found");
    const updatedBill = { ...existingBill, ...data };
    return updateItem("bills", updatedBill);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("bills", id);
  },
};

// Transactions
export const transactions = {
  create: async (data: Transaction) => {
    await ensureDB();
    return addItem("transactions", data);
  },

  getAll: async (): Promise<Transaction[]> => {
    await ensureDB();
    return getAllItems("transactions");
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    await ensureDB();
    return getItem("transactions", id);
  },

  update: async (id: string, data: Partial<Transaction>) => {
    await ensureDB();
    const existingTransaction = await getItem("transactions", id);
    if (!existingTransaction) throw new Error("Transaction not found");
    const updatedTransaction = { ...existingTransaction, ...data };
    return updateItem("transactions", updatedTransaction);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("transactions", id);
  },
};
