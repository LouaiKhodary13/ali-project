// /hooks/useCustomers.ts
'use client'; // if using the app router; harmless in pages/
import { useState } from 'react';
import { Customer } from '@/app/types';
import { customersMock } from '@/app/data/mockData';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(customersMock);

  function addCustomer(input: Omit<Customer, 'cust_id'>) {
    const newCustomer: Customer = {
      ...input,
      cust_id: crypto?.randomUUID?.() ?? Date.now().toString(),
    };
    setCustomers((p) => [newCustomer, ...p]);
    return newCustomer;
  }

  function updateCustomer(id: string, patch: Partial<Customer>) {
    setCustomers((p) =>
      p.map((c) => (c.cust_id === id ? { ...c, ...patch } : c))
    );
  }

  function deleteCustomer(id: string) {
    setCustomers((p) => p.filter((c) => c.cust_id !== id));
  }

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
