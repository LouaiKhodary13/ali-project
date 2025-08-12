"use client";
import { useState, useEffect } from "react";
import { Product } from "@/app/types";
import { productService } from "@/app/services/productService";

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
      setError('Failed to load products');
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
      setError('Failed to add product');
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
      setError('Failed to update product');
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.prod_id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
      throw err;
    }
  };

  return { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    loading, 
    error,
    refetch: loadProducts 
  };
}