import { Customer, Product, Bill, Transaction } from "@/app/types/index";
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
    return getAllItems<Customer>("customers");
  },

  getById: async (id: string): Promise<Customer | undefined> => {
    await ensureDB();
    return getItem<Customer>("customers", id);
  },

  update: async (id: string, data: Partial<Customer>) => {
    await ensureDB();
    const existingCustomer = await getItem<Customer>("customers", id);
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
    return getAllItems<Product>("products");
  },

  getById: async (id: string): Promise<Product | undefined> => {
    await ensureDB();
    return getItem<Product>("products", id);
  },

  update: async (id: string, data: Partial<Product>) => {
    await ensureDB();
    const existingProduct = await getItem<Product>("products", id);
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
    // Ensure paid_sum and left_sum are calculated if not provided
    const billData = {
      ...data,
      paid_sum: data.paid_sum ?? 0,
      left_sum: data.left_sum ?? data.bill_sum,
    };
    return addItem("bills", billData);
  },

  getAll: async (): Promise<Bill[]> => {
    await ensureDB();
    return getAllItems<Bill>("bills");
  },

  getById: async (id: string): Promise<Bill | undefined> => {
    await ensureDB();
    return getItem<Bill>("bills", id);
  },

  update: async (id: string, data: Partial<Bill>) => {
    await ensureDB();
    const existingBill = await getItem<Bill>("bills", id);
    if (!existingBill) throw new Error("Bill not found");

    const updatedBill = { ...existingBill, ...data };

    // Recalculate left_sum if bill_sum or paid_sum changed
    if (data.bill_sum !== undefined || data.paid_sum !== undefined) {
      updatedBill.left_sum = updatedBill.bill_sum - updatedBill.paid_sum;
    }

    return updateItem("bills", updatedBill);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("bills", id);
  },

  // Additional method to update payment
  updatePayment: async (id: string, paidAmount: number) => {
    await ensureDB();
    const existingBill = await getItem<Bill>("bills", id);
    if (!existingBill) throw new Error("Bill not found");

    const updatedBill = {
      ...existingBill,
      paid_sum: paidAmount,
      left_sum: existingBill.bill_sum - paidAmount,
    };

    return updateItem("bills", updatedBill);
  },

  // Get bills with outstanding balance
  getUnpaidBills: async (): Promise<Bill[]> => {
    await ensureDB();
    const allBills = await getAllItems<Bill>("bills");
    return allBills.filter((bill: Bill) => bill.left_sum > 0);
  },

  // Get bills by customer
  getByCustomer: async (custId: string): Promise<Bill[]> => {
    await ensureDB();
    const allBills = await getAllItems<Bill>("bills");
    return allBills.filter((bill: Bill) => bill.cust_id === custId);
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
    return getAllItems<Transaction>("transactions");
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    await ensureDB();
    return getItem<Transaction>("transactions", id);
  },

  update: async (id: string, data: Partial<Transaction>) => {
    await ensureDB();
    const existingTransaction = await getItem<Transaction>("transactions", id);
    if (!existingTransaction) throw new Error("Transaction not found");
    const updatedTransaction = { ...existingTransaction, ...data };
    return updateItem("transactions", updatedTransaction);
  },

  delete: async (id: string) => {
    await ensureDB();
    return deleteItem("transactions", id);
  },
};
