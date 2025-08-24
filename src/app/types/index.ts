// /types/index.ts
export interface Customer {
  cust_id: string;
  cust_name: string;
  cust_adr: string;
  cust_phone: string | number;
  cust_note?: string;
}

export interface Product {
  prod_id: string;
  prod_name: string;
  prod_quant: number;
  prod_price: number;
  prod_note?: string;
}

export interface BillProduct {
  prod_id: string;
  quantity: number;
  unit_price: number; // Store the price at time of sale
}

export interface Bill {
  bill_id: string;
  cust_id: string;
  prod_items: BillProduct[]; // Changed from prod_ids to prod_items
  bill_sum: number;
  paid_sum: number;
  left_sum: number;
  bill_date: string;
  bill_note?: string;
}

export interface Transaction {
  tran_id: string;
  prod_ids: string[];
  tran_source: string;
  tran_cost: number;
  tran_date: string;
  tran_note?: string;
}
