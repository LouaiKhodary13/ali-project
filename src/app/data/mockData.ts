// /data/mockData.ts
import { Customer, Product, Bill, Transaction } from '@/app/types';

export const customersMock: Customer[] = [
  {
    cust_id: 'c1',
    cust_name: 'John Doe',
    cust_adr: '123 Main St',
    cust_phone: '555-1234',
    cust_note: 'VIP',
  },
  {
    cust_id: 'c2',
    cust_name: 'Jane Smith',
    cust_adr: '456 Park Ave',
    cust_phone: '555-5678',
    cust_note: '',
  },
];

export const productsMock: Product[] = [
  { prod_id: 'p1', prod_name: 'Rice 5kg', prod_quant: 100, prod_price: 30 },
  { prod_id: 'p2', prod_name: 'Sugar 1kg', prod_quant: 200, prod_price: 10 },
];

export const billsMock: Bill[] = [
  {
    bill_id: 'b1',
    cust_id: 'c1',
    prod_ids: ['p1', 'p2'],
    bill_sum: 40, // sample
    bill_date: new Date().toISOString(),
    bill_note: 'Paid',
  },
];

export const transactionsMock: Transaction[] = [
  {
    tran_id: 't1',
    prod_ids: ['p1'],
    tran_source: 'Purchase',
    tran_cost: 300,
    tran_date: new Date().toISOString(),
    tran_note: '',
  },
];
