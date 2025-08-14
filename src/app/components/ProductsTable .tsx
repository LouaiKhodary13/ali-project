// src/app/components/ProductsTable.tsx
import React from 'react';
import { ar } from '../lang/ar';
import { Product } from '@/app/types';

type Props = {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
};

export const ProductsTable: React.FC<Props> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right'>
        <thead className='text-xs text-white uppercase bg-gray-700'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              {ar.products.name}
            </th>
            <th scope='col' className='px-6 py-3'>
              {ar.products.quantity}
            </th>
            <th scope='col' className='px-6 py-3'>
              <div className='flex items-center'>
                {ar.products.price}
                <a href='#'>
                  <svg
                    className='w-3 h-3 ms-1.5'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'>
                    <path d='M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z' />
                  </svg>
                </a>
              </div>
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
          {products.map((p, i) => (
            <tr
              key={p.prod_id}
              className={`border-b border-gray-700 ${
                i % 2 === 0 ? ' bg-gray-800' : 'bg-gray-900'
              }`}>
              <th
                scope='row'
                className='px-6 py-4 font-medium text-white whitespace-nowrap'>
                {p.prod_name}
              </th>
              <td className='px-6 py-4 text-white font-medium'>
                {p.prod_quant}
              </td>
              <td className='px-6 py-4 text-white font-medium'>
                {p.prod_price}
              </td>
              <td className='px-6 py-4 text-white font-medium'>
                {p.prod_note}
              </td>
              <td className='px-6 py-4 text-right'>
                <button
                  onClick={() => onEdit?.(p)}
                  className='font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4 ml-4'>
                  {ar.buttons.Edit}
                </button>
                <button
                  onClick={() => onDelete?.(p.prod_id)}
                  className='font-medium text-red-600 dark:text-red-500 hover:underline'>
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
