// hooks/useBills.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { Bill } from "@/app/types";
import { billService } from "@/app/services/billService";

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await billService.getAll();
      setBills(data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const addBill = async (bill: Omit<Bill, "bill_id">) => {
    const newBill: Bill = {
      ...bill,
      bill_id: crypto?.randomUUID?.() ?? Date.now().toString(),
    };

    await billService.create(newBill);
    await fetchBills();
  };

  const updateBill = async (id: string, bill: Partial<Bill>) => {
    await billService.update(id, bill);
    await fetchBills();
  };

  const deleteBill = async (id: string) => {
    await billService.delete(id);
    await fetchBills();
  };

  const refreshBills = useCallback(async () => {
    try {
      console.log("refreshBills: Fetching from database...");

      // ✅ Fetch from database service (IndexedDB)
      const data = await billService.getAll();

      console.log("refreshBills: Found", data.length, "bills");

      // Create NEW array reference to trigger React re-render
      setBills([...data]);

      console.log("refreshBills: State updated with new reference");
    } catch (error) {
      console.error("refreshBills: Error fetching bills:", error);
      setBills([]);
    }
  }, []);

  return {
    bills,
    loading,
    addBill,
    updateBill,
    deleteBill,
    refreshBills,
  };
}
