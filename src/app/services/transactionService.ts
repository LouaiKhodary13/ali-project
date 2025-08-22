import { Transaction } from "@/app/types";
import { transactions } from "@/app/database/services";

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      return transactions.getAll();
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw new Error("Failed to fetch transactions");
    }
  },

  async getById(id: string): Promise<Transaction | undefined> {
    try {
      const transaction = transactions.getById(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      throw new Error("Failed to fetch transaction");
    }
  },

  async create(transaction: Transaction): Promise<void> {
    console.log("Creating transaction:", transaction);

    try {
      transactions.create(transaction);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw new Error("Failed to create transaction");
    }
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<void> {
    try {
      transactions.update(id, transaction);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw new Error("Failed to update transaction");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      transactions.delete(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw new Error("Failed to delete transaction");
    }
  },
};
