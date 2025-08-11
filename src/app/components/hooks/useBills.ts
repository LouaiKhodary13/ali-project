// hooks/useBills.ts
'use client';
import { useState } from 'react';
import { Bill } from '@/app/types';
import { billsMock } from '@/app/data/mockData';

export function useBills() {
  const [bills, setBills] = useState<Bill[]>(billsMock);

  function addBill(input: Omit<Bill, 'bill_id'>) {
    const newBill: Bill = {
      ...input,
      bill_id: crypto?.randomUUID?.() ?? Date.now().toString(),
    };
    setBills((prev) => [newBill, ...prev]);
    return newBill;
  }

  function updateBill(id: string, patch: Partial<Bill>) {
    setBills((prev) =>
      prev.map((b) => (b.bill_id === id ? { ...b, ...patch } : b))
    );
  }

  function deleteBill(id: string) {
    setBills((prev) => prev.filter((b) => b.bill_id !== id));
  }

  return { bills, addBill, updateBill, deleteBill };
}
