import { Product } from "@/app/types";
import { products } from "@/app/database/services";

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      return products.getAll();
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error("Failed to fetch products");
    }
  },

  async getById(id: string): Promise<Product | undefined> {
    try {
      const product = products.getById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw new Error("Failed to fetch product");
    }
  },

  async create(product: Product): Promise<void> {
    console.log("Creating product:", product);

    try {
      products.create(product);
    } catch (error) {
      console.error("Failed to create product:", error);
      throw new Error("Failed to create product");
    }
  },

  async update(id: string, product: Partial<Product>): Promise<void> {
    try {
      products.update(id, product);
    } catch (error) {
      console.error("Failed to update product:", error);
      throw new Error("Failed to update product");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      products.delete(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw new Error("Failed to delete product");
    }
  },
};
