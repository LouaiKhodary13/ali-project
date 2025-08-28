// components/BillsTable.tsx
import React from 'react';
import { ar } from '../lang/ar';
import { Bill, Customer, Product } from '@/app/types';

type Props = {
  bills: Bill[];
  customers?: Customer[];
  products?: Product[];
  onEdit?: (bill: Bill) => void;
  onDelete?: (id: string) => void;
};

export const BillsTable: React.FC<Props> = ({
  bills,
  customers = [],
  products = [],
  onEdit,
  onDelete,
}) => {
  const getProductDetails = (bill: Bill) => {
    if (!bill.prod_items || bill.prod_items.length === 0) {
      return '—';
    }

    return bill.prod_items
      .map((item) => {
        const product = products.find((p) => p.prod_id === item.prod_id);
        const productName = product?.prod_name || 'منتج محذوف';
        return `${productName} (الكمية: ${
          item.quantity
        }, السعر: ${item.unit_price.toFixed(2)})`;
      })
      .join(', ');
  };

  return (
    <>
      <div className='w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
        {/* Header - only visible on desktop */}
        <div className='hidden sm:grid grid-cols-8 gap-4 mb-4'>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Customer}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Products}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Total_Bill}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Paid_Sum}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Left_Sum}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Date}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Note}
          </h5>
          <h5 className='text-sm font-bold leading-none text-white'>
            {ar.strings.Actions}
          </h5>
        </div>

        {/* Customers */}
        <div className='flow-root'>
          <ul
            role='list'
            className='divide-y divide-gray-200 dark:divide-gray-700'>
            {bills.map((b) => (
              <li key={b.bill_id} className='py-3 sm:py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-8 gap-4'>
                  {/* Customer Name */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-white'>
                      {ar.strings.Customer}
                    </span>
                    <p className='text-sm font-medium text-white'>
                      {customers.length > 0
                        ? customers.find((c) => c.cust_id === b.cust_id)
                            ?.cust_name ??
                          b.cust_id ??
                          '—'
                        : b.cust_id ?? '—'}
                    </p>
                  </div>

                  {/* Products */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-white'>
                      {ar.strings.Products}
                    </span>
                    <p className='text-sm text-white'>{getProductDetails(b)}</p>
                  </div>

                  {/* Total */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-white'>
                      {ar.strings.Total}
                    </span>
                    <p className='text-sm font-medium text-white'>
                      {b.bill_sum?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Paid */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-white'>
                      {ar.transaction.Paid}
                    </span>
                    <p className='text-sm font-medium text-white'>
                      {b.paid_sum?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Remaining */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.transaction.Remaining}
                    </span>
                    <p className='text-sm font-medium text-red-600'>
                      {b.left_sum?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Date}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(b.bill_date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Note */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Note}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {b.bill_note}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Actions}
                    </span>
                    <div className='flex flex-col space-y-2 text-right sm:text-left'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                        onClick={() => onEdit?.(b)}>
                        {ar.buttons.Edit}
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-500 hover:underline'
                        onClick={() => onDelete?.(b.bill_id)}>
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
