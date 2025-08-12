// components/BillsTable.tsx
import React from 'react';
import { Bill, Customer, Product } from '@/app/types';

type Props = {
  bills: Bill[];
  customers?: Customer[];
  products?: Product[];
  onEdit?: (bill: Bill) => void;
  onDelete?: (id: string) => void;
  onCustomerChange?: (billId: string, custId: string) => void;
  onProductsChange?: (billId: string, prodIds: string[]) => void;
};

export const BillsTable: React.FC<Props> = ({
  bills,
  customers = [],
  products = [],
  onEdit,
  onDelete,
  onCustomerChange,
  onProductsChange,
}) => {
  return (
    <table className='min-w-full text-sm border'>
      <thead>
        <tr>
          <th className='p-2 text-left'>Customer</th>
          <th className='p-2 text-left'>Products</th>
          <th className='p-2 text-left'>Total</th>
          <th className='p-2 text-left'>Date</th>
          <th className='p-2 text-left'>Note</th>
          <th className='p-2 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b) => (
          <tr key={b.bill_id} className='border-b'>
            {/* Customer Dropdown */}
            <td className='p-2'>
              {customers.length > 0 ? (
                <select
                  value={b.cust_id ?? ''}
                  onChange={(e) =>
                    onCustomerChange?.(b.bill_id, e.target.value)
                  }
                  className='border rounded p-1 bg-amber-800'>
                  <option value=''>Select customer</option>
                  {customers.map((c) => (
                    <option key={c.cust_id} value={c.cust_id}>
                      {c.cust_name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{b.cust_id || '—'}</span>
              )}
            </td>

            <td className='p-2'>
              {(b.prod_ids ?? [])
                .map(
                  (id) =>
                    products.find((p) => p.prod_id === id)?.prod_name || id
                )
                .join(', ') || '—'}
            </td>

            <td className='p-2'>{b.bill_sum}</td>
            <td className='p-2'>
              {new Date(b.bill_date).toLocaleDateString()}
            </td>
            <td className='p-2'>{b.bill_note}</td>
            <td className='p-2'>
              <button className='mr-2 underline' onClick={() => onEdit?.(b)}>
                Edit
              </button>
              <button
                className='text-red-600'
                onClick={() => onDelete?.(b.bill_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
