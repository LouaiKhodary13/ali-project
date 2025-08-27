"use client";
import { useState, useEffect } from "react";
import { Product, BillProduct } from "@/app/types";
import { products as productService } from "@/app/database/services";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (input: Omit<Product, "prod_id">) => {
    try {
      const newProduct: Product = {
        ...input,
        prod_id: crypto?.randomUUID?.() ?? Date.now().toString(),
      };

      await productService.create(newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError("Failed to add product");
      console.error(err);
      throw err;
    }
  };

  const updateProduct = async (id: string, patch: Partial<Product>) => {
    try {
      await productService.update(id, patch);
      setProducts((prev) =>
        prev.map((p) => (p.prod_id === id ? { ...p, ...patch } : p))
      );
    } catch (err) {
      setError("Failed to update product");
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.prod_id !== id));
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
      throw err;
    }
  };

  // Check if products have sufficient quantities for a bill
  const checkProductAvailability = (billItems: BillProduct[]) => {
    const errors: string[] = [];
    let available = true;

    for (const item of billItems) {
      const product = products.find((p) => p.prod_id === item.prod_id);
      if (!product) {
        errors.push(`Product ${item.prod_id} not found`);
        available = false;
        continue;
      }

      if (product.prod_quant < item.quantity) {
        errors.push(
          `Insufficient quantity for ${product.prod_name}. Available: ${product.prod_quant}, Required: ${item.quantity}`
        );
        available = false;
      }
    }

    return { available, errors };
  };

  // Update product quantities (for bill operations)
  const updateProductQuantities = async (
    items: { prod_id: string; quantity: number; unit_price: number }[],
    operation: "add" | "subtract"
  ) => {
    try {
      for (const item of items) {
        const product = products.find((p) => p.prod_id === item.prod_id);
        if (product) {
          const newQuantity =
            operation === "add"
              ? product.prod_quant + item.quantity
              : product.prod_quant - item.quantity;

          if (newQuantity < 0) {
            throw new Error(
              `Insufficient quantity for product ${product.prod_name}`
            );
          }

          await updateProduct(product.prod_id, {
            ...product,
            prod_quant: newQuantity,
          });
        }
      }
    } catch (error: unknown) {
      console.error("Failed to update product quantities:", error);
      throw error;
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
    refetch: loadProducts,
    checkProductAvailability,
    updateProductQuantities,
  };
}
