// hooks/useTransactions.ts
'use client';
import { useState } from 'react';
import { Transaction } from '@/app/types';
import { transactionsMock } from '@/app/data/mockData';

export function useTransactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionsMock);

  function addTransaction(input: Omit<Transaction, 'tran_id'>) {
    const newTransaction: Transaction = {
      ...input,
      tran_id: crypto?.randomUUID?.() ?? Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }

  function updateTransaction(id: string, patch: Partial<Transaction>) {
    setTransactions((prev) =>
      prev.map((t) => (t.tran_id === id ? { ...t, ...patch } : t))
    );
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.tran_id !== id));
  }

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
}
