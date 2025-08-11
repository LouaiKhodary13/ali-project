// /hooks/useCustomers.ts
"use client"; // if using the app router; harmless in pages/
import { useState, useEffect } from "react";
import { Customer } from "@/app/types";
import { customerService } from "@/app/services/customerService";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (input: Omit<Customer, "cust_id">) => {
    try {
      const newCustomer: Customer = {
        ...input,
        cust_id: crypto?.randomUUID?.() ?? Date.now().toString(),
      };
      
      await customerService.create(newCustomer);
      setCustomers((prev) => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      setError('Failed to add customer');
      console.error(err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, patch: Partial<Customer>) => {
    try {
      await customerService.update(id, patch);
      setCustomers((prev) =>
        prev.map((c) => (c.cust_id === id ? { ...c, ...patch } : c))
      );
    } catch (err) {
      setError('Failed to update customer');
      console.error(err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      setCustomers((prev) => prev.filter((c) => c.cust_id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      console.error(err);
      throw err;
    }
  };

  return { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    loading, 
    error,
    refetch: loadCustomers 
  };
}