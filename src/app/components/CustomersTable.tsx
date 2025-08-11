// /components/CustomersTable.tsx
import React from 'react';
import { Customer } from '../types';

type Props = {
  customers: Customer[];
  onEdit?: (c: Customer) => void;
  onDelete?: (id: string) => void;
};

export const CustomersTable: React.FC<Props> = ({
  customers,
  onEdit,
  onDelete,
}) => {
  return (
    <table className='min-w-full text-sm'>
      <thead className=''>
        <tr>
          <th className='p-2 text-left'>Name</th>
          <th className='p-2 text-left'>Address</th>
          <th className='p-2 text-left'>Phone</th>
          <th className='p-2 text-left'>Note</th>
          <th className='p-2 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.cust_id} className='border-b'>
            <td className='p-2'>{c.cust_name}</td>
            <td className='p-2'>{c.cust_adr}</td>
            <td className='p-2'>{c.cust_phone}</td>
            <td className='p-2'>{c.cust_note}</td>
            <td className='p-2'>
              <button className='mr-2 underline' onClick={() => onEdit?.(c)}>
                Edit
              </button>
              <button
                className='text-red-600'
                onClick={() => onDelete?.(c.cust_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
