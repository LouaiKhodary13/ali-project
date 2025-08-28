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
    <>
      <div className='w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
        {/* Header - only visible on desktop */}
        <div className='hidden sm:grid grid-cols-5 gap-4 mb-4'>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.products.name}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.products.quantity}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.products.price}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Note}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Actions}
          </h5>
        </div>

        {/* Products */}
        <div className='flow-root'>
          <ul
            role='list'
            className='divide-y divide-gray-200 dark:divide-gray-700'>
            {products.map((p) => (
              <li key={p.prod_id} className='py-3 sm:py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-5 gap-4'>
                  {/* Name */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.products.name}
                    </span>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {p.prod_name}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.products.quantity}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {p.prod_quant}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.products.price}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {p.prod_price}
                    </p>
                  </div>

                  {/* Note */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Note}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {p.prod_note}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Actions}
                    </span>
                    <div className='flex flex-col space-y-2 text-right sm:text-left'>
                      <button
                        onClick={() => onEdit?.(p)}
                        className='font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline'>
                        {ar.buttons.Edit}
                      </button>
                      <button
                        onClick={() => onDelete?.(p.prod_id)}
                        className='font-medium text-sm text-red-600 dark:text-red-500 hover:underline'>
                        {ar.buttons.Delete}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
