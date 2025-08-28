// /components/CustomersTable.tsx
import React from 'react';
import { ar } from '../lang/ar';
import { Customer } from '../types';

type Props = {
  customers: Customer[];
  onEdit?: (c: Customer) => void;
  onDelete?: (id: string) => void;
  onViewBills?: (customerId: string) => void;
};

export const CustomersTable: React.FC<Props> = ({
  customers,
  onEdit,
  onDelete,
  onViewBills,
}) => {
  return (
    <>
      <div className='w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
        {/* Header - only visible on desktop */}
        <div className='hidden sm:grid grid-cols-5 gap-4 mb-4'>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Name}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Address}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Phone}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Note}
          </h5>
          <h5 className='text-sm font-bold leading-none text-gray-900 dark:text-white'>
            {ar.strings.Actions}
          </h5>
        </div>

        {/* Customers */}
        <div className='flow-root'>
          <ul
            role='list'
            className='divide-y divide-gray-200 dark:divide-gray-700'>
            {customers.map((c) => (
              <li key={c.cust_id} className='py-3 sm:py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-5 gap-4'>
                  {/* Name */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Name}
                    </span>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {c.cust_name}
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Address}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {c.cust_adr}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Phone}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {c.cust_phone}
                    </p>
                  </div>

                  {/* Note */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Note}
                    </span>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {c.cust_note}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <span className='sm:hidden block text-xs font-bold text-gray-500 dark:text-gray-400'>
                      {ar.strings.Actions}
                    </span>
                    <div className='flex flex-col space-y-2 text-right sm:text-left'>
                      <button
                        onClick={() => onViewBills?.(c.cust_id)}
                        className='font-medium text-sm text-green-600 dark:text-green-500 hover:underline'>
                        {ar.buttons.display_bills}
                      </button>
                      <button
                        onClick={() => onEdit?.(c)}
                        className='font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline'>
                        {ar.buttons.Edit}
                      </button>
                      <button
                        onClick={() => onDelete?.(c.cust_id)}
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
