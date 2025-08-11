// components/TransactionsTable.tsx
import React from 'react';
import { Transaction } from '@/app/types';

type Props = {
  transactions: Transaction[];
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
};

export const TransactionsTable: React.FC<Props> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  return (
    <table className='min-w-full text-sm border'>
      <thead className=''>
        <tr>
          <th className='p-2 text-left'>Products</th>
          <th className='p-2 text-left'>Source</th>
          <th className='p-2 text-left'>Cost</th>
          <th className='p-2 text-left'>Date</th>
          <th className='p-2 text-left'>Note</th>
          <th className='p-2 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.tran_id} className='border-b'>
            <td className='p-2'>{t.prod_ids.join(', ')}</td>
            <td className='p-2'>{t.tran_source}</td>
            <td className='p-2'>{t.tran_cost}</td>
            <td className='p-2'>
              {new Date(t.tran_date).toLocaleDateString()}
            </td>
            <td className='p-2'>{t.tran_note}</td>
            <td className='p-2'>
              <button className='mr-2 underline' onClick={() => onEdit?.(t)}>
                Edit
              </button>
              <button
                className='text-red-600'
                onClick={() => onDelete?.(t.tran_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
