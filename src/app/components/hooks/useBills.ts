// hooks/useBills.ts
"use client";
import { useState, useEffect } from "react";
import { Bill } from "@/app/types";
import { billService } from "@/app/services/billService";

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load bills on mount
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await billService.getAll();
      setBills(data);
    } catch (err) {
      setError('Failed to load bills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (input: Omit<Bill, "bill_id">) => {
    try {
      const newBill: Bill = {
        ...input,
        bill_id: crypto?.randomUUID?.() ?? Date.now().toString(),
      };
      
      await billService.create(newBill);
      setBills((prev) => [newBill, ...prev]);
      return newBill;
    } catch (err) {
      setError('Failed to add bill');
      console.error(err);
      throw err;
    }
  };

  const updateBill = async (id: string, patch: Partial<Bill>) => {
    try {
      await billService.update(id, patch);
      setBills((prev) =>
        prev.map((b) => (b.bill_id === id ? { ...b, ...patch } : b))
      );
    } catch (err) {
      setError('Failed to update bill');
      console.error(err);
      throw err;
    }
  };

  const deleteBill = async (id: string) => {
    try {
      await billService.delete(id);
      setBills((prev) => prev.filter((b) => b.bill_id !== id));
    } catch (err) {
      setError('Failed to delete bill');
      console.error(err);
      throw err;
    }
  };

  return { 
    bills, 
    addBill, 
    updateBill, 
    deleteBill, 
    loading, 
    error,
    refetch: loadBills 
  };
}