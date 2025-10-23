import { Bill, BillProduct } from "@/app/types";
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
      // Separate custom products from regular products
      const regularProducts = bill.prod_items.filter(
        (item) => !item.prod_id.startsWith("custom_")
      );
      const customProducts = bill.prod_items.filter((item) =>
        item.prod_id.startsWith("custom_")
      );

      console.log("Regular products:", regularProducts.length);
      console.log("Custom products:", customProducts.length);

      // Update stock only for regular products
      if (regularProducts.length > 0) {
        await this.updateProductQuantities(regularProducts, false);
      }

      // Create the bill with all products (including custom ones)
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

  // Helper method to update product quantities (skip custom products)
  async updateProductQuantities(
    prodItems: BillProduct[],
    isReverting: boolean = false
  ): Promise<void> {
    const { products } = await import("@/app/database/services");

    for (const item of prodItems) {
      // Skip custom products
      if (item.prod_id.startsWith("custom_")) {
        console.log(`Skipping custom product: ${item.custom_name}`);
        continue;
      }

      const product = await products.getById(item.prod_id);

      if (!product) {
        throw new Error(`Product not found: ${item.prod_id}`);
      }

      const newQuantity = isReverting
        ? product.prod_quant + item.quantity
        : product.prod_quant - item.quantity;

      // Remove the stock validation check - allow negative quantities
      // This allows creating bills even when stock is insufficient
      console.log(
        `Updating product ${product.prod_name}: ${product.prod_quant} -> ${newQuantity}`
      );

      // Warn if quantity goes negative but don't throw error
      if (newQuantity < 0) {
        console.warn(
          `⚠️ Warning: Product ${product.prod_name} quantity is now negative: ${newQuantity}`
        );
      }

      products.update(item.prod_id, { prod_quant: newQuantity });
    }
  },

  // Updated method to add payment to customer bills
  async addPaymentToCustomer(
    customerId: string,
    amount: number,
    currentBills: Bill[],
    note?: string
  ): Promise<void> {
    try {
      console.log("=== Starting addPaymentToCustomer ===");
      console.log("Customer ID:", customerId);
      console.log("Payment amount:", amount);
      console.log("Current bills count:", currentBills.length);

      // Filter and sort unpaid bills
      const unpaidBills = currentBills
        .filter(
          (bill) => bill.cust_id === customerId && (bill.left_sum || 0) > 0
        )
        .sort(
          (a, b) =>
            new Date(a.bill_date).getTime() - new Date(b.bill_date).getTime()
        );

      console.log("Unpaid bills found:", unpaidBills.length);

      if (unpaidBills.length === 0) {
        throw new Error("No unpaid bills found for this customer");
      }

      let remainingAmount = amount;

      // Calculate all updates first
      const billUpdates: Array<{
        bill: Bill;
        paid_sum: number;
        left_sum: number;
      }> = [];

      for (const bill of unpaidBills) {
        if (remainingAmount <= 0) break;

        const billRemaining = bill.left_sum || 0;
        const paymentForThisBill = Math.min(remainingAmount, billRemaining);

        const updatedPaidSum = (bill.paid_sum || 0) + paymentForThisBill;
        const updatedLeftSum = (bill.left_sum || 0) - paymentForThisBill;

        billUpdates.push({
          bill: bill,
          paid_sum: updatedPaidSum,
          left_sum: updatedLeftSum,
        });

        console.log(
          `Bill ${bill.bill_id}: paying ${paymentForThisBill}, new paid: ${updatedPaidSum}, new left: ${updatedLeftSum}`
        );

        remainingAmount -= paymentForThisBill;
      }

      // ✅ Update each bill sequentially with proper error handling
      console.log("Updating bills in database...");
      for (const update of billUpdates) {
        try {
          console.log(`Updating bill ${update.bill.bill_id}...`);

          await this.update(update.bill.bill_id, {
            paid_sum: update.paid_sum,
            left_sum: update.left_sum,
          });

          console.log(`✅ Successfully updated bill ${update.bill.bill_id}`);
        } catch (error) {
          console.error(
            `❌ Failed to update bill ${update.bill.bill_id}:`,
            error
          );
          throw new Error(
            `Failed to update bill ${update.bill.bill_id}: ${error}`
          );
        }
      }

      // ✅ Verify the updates by reading back from database
      console.log("Verifying updates...");
      const verifyBills = await this.getAll();
      console.log("Total bills after update:", verifyBills.length);

      const verifyCustomerBills = verifyBills.filter(
        (b) => b.cust_id === customerId
      );
      console.log("Customer bills after update:", verifyCustomerBills.length);
      console.log(
        "Customer bills details:",
        verifyCustomerBills.map((b) => ({
          id: b.bill_id,
          paid: b.paid_sum,
          left: b.left_sum,
        }))
      );

      console.log(
        `✅ Payment of ${amount} added successfully for customer ${customerId}`
      );
      console.log("=== Finished addPaymentToCustomer ===");
    } catch (error) {
      console.error("❌ Failed to add payment:", error);
      throw error;
    }
  },
};
