import React from 'react';
import { Transaction, Product } from '@/app/types';

type Props = {
  transactions: Transaction[];
  products: Product[]; // products list passed as prop
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
};

export const TransactionsTable: React.FC<Props> = ({
  transactions,
  products,
  onEdit,
  onDelete,
}) => {
  // Declare getProductName function inside component scope
  const getProductName = (id: string) => {
    const product = products.find((p) => p.prod_id === id);
    return product ? product.prod_name : 'Deleted product';
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Products
            </th>
            <th scope='col' className='px-6 py-3'>
              Source
            </th>
            <th scope='col' className='px-6 py-3'>
              Cost
            </th>
            <th scope='col' className='px-6 py-3'>
              Date
            </th>
            <th scope='col' className='px-6 py-3'>
              Note
            </th>
            <th scope='col' className='px-6 py-3'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr
              key={t.tran_id}
              className={`border-b border-gray-200 dark:border-gray-700 ${
                i % 2 === 0
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                {t.prod_ids.map(getProductName).join(', ')}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                {t.tran_source}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                {t.tran_cost}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                {new Date(t.tran_date).toLocaleDateString()}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                {t.tran_note}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                <button className='mr-2 underline' onClick={() => onEdit?.(t)}>
                  Edit
                </button>
                <button
                  className='font-medium text-red-600 dark:text-red-500 hover:underline'
                  onClick={() => onDelete?.(t.tran_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
