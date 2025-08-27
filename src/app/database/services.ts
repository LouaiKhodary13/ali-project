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

// Helper function to migrate old bills to new structure
async function migrateBillIfNeeded(bill: unknown): Promise<Bill> {
  const billData = bill as Bill & { prod_ids?: string[] };

  // If bill has old structure (prod_ids), convert to new structure
  if (billData.prod_ids && !billData.prod_items) {
    const products = await getAllItems<Product>("products");
    const prodItems = billData.prod_ids.map((prodId: string) => {
      const product = products.find((p) => p.prod_id === prodId);
      return {
        prod_id: prodId,
        quantity: 1, // Default quantity
        unit_price: product?.prod_price || 0,
      };
    });

    // Create a new bill object without the old prod_ids field
    const { ...billWithoutProdIds } = billData;
    return {
      ...billWithoutProdIds,
      prod_items: prodItems,
    };
  }

  return billData;
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

  // Add method to check low stock
  getLowStockProducts: async (threshold: number = 10): Promise<Product[]> => {
    await ensureDB();
    const allProducts = await getAllItems<Product>("products");
    return allProducts.filter((product) => product.prod_quant <= threshold);
  },
};

// Bills
export const bills = {
  create: async (data: Bill) => {
    await ensureDB();

    const billData = {
      ...data,
      paid_sum: data.paid_sum ?? 0,
      left_sum: data.left_sum ?? data.bill_sum,
    };

    // Create the bill (inventory management will be handled in the UI layer)
    const result = await addItem("bills", billData);
    return result;
  },

  getAll: async (): Promise<Bill[]> => {
    await ensureDB();
    const allBills = await getAllItems<unknown>("bills");
    // Migrate old bills if needed
    const migratedBills = await Promise.all(
      allBills.map((bill) => migrateBillIfNeeded(bill))
    );
    return migratedBills;
  },

  getById: async (id: string): Promise<Bill | undefined> => {
    await ensureDB();
    const bill = await getItem<unknown>("bills", id);
    return bill ? migrateBillIfNeeded(bill) : undefined;
  },

  update: async (id: string, data: Partial<Bill>) => {
    await ensureDB();
    const existingBill = await getItem<unknown>("bills", id);
    if (!existingBill) throw new Error("Bill not found");

    const migratedBill = await migrateBillIfNeeded(existingBill);
    const updatedBill = { ...migratedBill, ...data };

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
    const existingBill = await getItem<unknown>("bills", id);
    if (!existingBill) throw new Error("Bill not found");

    const migratedBill = await migrateBillIfNeeded(existingBill);
    const updatedBill = {
      ...migratedBill,
      paid_sum: paidAmount,
      left_sum: migratedBill.bill_sum - paidAmount,
    };

    return updateItem("bills", updatedBill);
  },

  // Get bills with outstanding balance
  getUnpaidBills: async (): Promise<Bill[]> => {
    await ensureDB();
    const allBills = await getAllItems<unknown>("bills");
    const migratedBills = await Promise.all(
      allBills.map((bill) => migrateBillIfNeeded(bill))
    );
    return migratedBills.filter((bill: Bill) => bill.left_sum > 0);
  },

  // Get bills by customer
  getByCustomer: async (custId: string): Promise<Bill[]> => {
    await ensureDB();
    const allBills = await getAllItems<unknown>("bills");
    const migratedBills = await Promise.all(
      allBills.map((bill) => migrateBillIfNeeded(bill))
    );
    return migratedBills.filter((bill: Bill) => bill.cust_id === custId);
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
