// hooks/useTransactions.ts
"use client";
import { useState, useEffect } from "react";
import { Transaction } from "@/app/types";
import { transactionService } from "@/app/services/transactionService";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (input: Omit<Transaction, "tran_id">) => {
    try {
      const newTransaction: Transaction = {
        ...input,
        tran_id: crypto?.randomUUID?.() ?? Date.now().toString(),
      };
      
      await transactionService.create(newTransaction);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError('Failed to add transaction');
      console.error(err);
      throw err;
    }
  };

  const updateTransaction = async (id: string, patch: Partial<Transaction>) => {
    try {
      await transactionService.update(id, patch);
      setTransactions((prev) =>
        prev.map((t) => (t.tran_id === id ? { ...t, ...patch } : t))
      );
    } catch (err) {
      setError('Failed to update transaction');
      console.error(err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.tran_id !== id));
    } catch (err) {
      setError('Failed to delete transaction');
      console.error(err);
      throw err;
    }
  };

  return { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    loading, 
    error,
    refetch: loadTransactions 
  };
}