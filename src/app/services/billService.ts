import { Bill } from "@/app/types";
import { bills } from "@/app/database/services";

export const billService = {
  async getAll(): Promise<Bill[]> {
    try {
      return bills.getAll();
    } catch (error) {
      console.error("Failed to fetch bills:", error);
      throw new Error("Failed to fetch bills");
    }
  },

  async getById(id: string): Promise<Bill | undefined> {
    try {
      const bill = bills.getById(id);
      if (!bill) {
        throw new Error("Bill not found");
      }
      return bill;
    } catch (error) {
      console.error("Failed to fetch bill:", error);
      throw new Error("Failed to fetch bill");
    }
  },

  async create(bill: Bill): Promise<void> {
    console.log("Creating bill:", bill);

    try {
      bills.create(bill);
    } catch (error) {
      console.error("Failed to create bill:", error);
      throw new Error("Failed to create bill");
    }
  },

  async update(id: string, bill: Partial<Bill>): Promise<void> {
    try {
      bills.update(id, bill);
    } catch (error) {
      console.error("Failed to update bill:", error);
      throw new Error("Failed to update bill");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      bills.delete(id);
    } catch (error) {
      console.error("Failed to delete bill:", error);
      throw new Error("Failed to delete bill");
    }
  },
};
