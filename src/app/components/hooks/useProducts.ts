'use client';
import { useState } from 'react';
import { Product } from '@/app/types';
import { productsMock } from '@/app/data/mockData';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(productsMock);

  function addProduct(input: Omit<Product, 'prod_id'>) {
    const newProduct: Product = {
      ...input,
      prod_id: crypto?.randomUUID?.() ?? Date.now().toString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) => (p.prod_id === id ? { ...p, ...patch } : p))
    );
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.prod_id !== id));
  }

  return { products, addProduct, updateProduct, deleteProduct };
}
