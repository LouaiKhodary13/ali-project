import { Customer } from "@/app/types";
import { customers } from "@/app/database/services";

export const customerService = {
  async getAll(): Promise<Customer[]> {
    try {
      return customers.getAll();
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      throw new Error("Failed to fetch customers");
    }
  },

  async getById(id: string): Promise<Customer | undefined> {
    try {
      const customer = customers.getById(id);
      if (!customer) {
        throw new Error("Customer not found");
      }
      return customer;
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      throw new Error("Failed to fetch customer");
    }
  },

  async create(customer: Customer): Promise<void> {
    console.log("Creating customer:", customer);

    try {
      customers.create(customer);
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw new Error("Failed to create customer");
    }
  },

  async update(id: string, customer: Partial<Customer>): Promise<void> {
    try {
      customers.update(id, customer);
    } catch (error) {
      console.error("Failed to update customer:", error);
      throw new Error("Failed to update customer");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      customers.delete(id);
    } catch (error) {
      console.error("Failed to delete customer:", error);
      throw new Error("Failed to delete customer");
    }
  },
};
