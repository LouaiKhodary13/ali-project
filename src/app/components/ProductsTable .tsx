// src/app/components/ProductsTable.tsx
import React from 'react';
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
    <table className='min-w-full text-sm border'>
      <thead>
        <tr>
          <th className='p-2 text-left'>Product Name</th>
          <th className='p-2 text-left'>Quantity</th>
          <th className='p-2 text-left'>Price</th>
          <th className='p-2 text-left'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.prod_id} className='border-b'>
            <td className='p-2'>{p.prod_name}</td>
            <td className='p-2'>{p.prod_quant}</td>
            <td className='p-2'>{p.prod_price}</td>
            <td className='p-2'>
              <button className='mr-2 underline' onClick={() => onEdit?.(p)}>
                Edit
              </button>
              <button
                className='text-red-600'
                onClick={() => onDelete?.(p.prod_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
