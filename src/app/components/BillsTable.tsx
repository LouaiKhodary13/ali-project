// components/BillsTable.tsx
import React from 'react';
import { Bill } from '@/app/types';

type Props = {
  bills: Bill[];
  onEdit?: (bill: Bill) => void;
  onDelete?: (id: string) => void;
};

export const BillsTable: React.FC<Props> = ({ bills, onEdit, onDelete }) => {
  return (
    <table className='min-w-full text-sm border'>
      <thead className=''>
        <tr>
          <th className='p-2 text-left'>Customer ID</th>
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
            <td className='p-2'>{b.cust_id}</td>
            <td className='p-2'>{b.prod_ids.join(', ')}</td>
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
