import React from 'react';
import { ar } from '../lang/ar';
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
    return product ? product.prod_name : 'المنتج محذوف';
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right'>
        <thead className='text-xs text-white uppercase bg-gray-700'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              {ar.tabs.products}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.transaction.Source}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.transaction.Cost}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.strings.Date}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.strings.Note}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.strings.Actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr
              key={t.tran_id}
              className={`border-b border-gray-700 ${
                i % 2 === 0 ? 'bg-gray-800 ' : 'bg-gray-900'
              }`}>
              <td
                scope='row'
                className='px-6 py-4 font-medium  text-white whitespace-nowrap'>
                {t.prod_ids.map(getProductName).join(', ')}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-white whitespace-nowrap '>
                {t.tran_source}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-white whitespace-nowrap '>
                {t.tran_cost}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-white whitespace-nowrap '>
                {new Date(t.tran_date).toLocaleDateString()}
              </td>
              <td
                scope='row'
                className='px-6 py-4 font-medium text-white whitespace-nowrap '>
                {t.tran_note}
              </td>
              <td scope='row' className='px-6 py-4 text-right'>
                <button
                  className='font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4 ml-4'
                  onClick={() => onEdit?.(t)}>
                  {ar.buttons.Edit}
                </button>
                <button
                  className='font-medium text-red-600 dark:text-red-500 hover:underline'
                  onClick={() => onDelete?.(t.tran_id)}>
                  {ar.buttons.Delete}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
