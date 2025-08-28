'use client';
import { Transaction, Product } from '@/app/types';
import { ar } from '../lang/ar';

interface TransactionsTableProps {
  transactions: Transaction[];
  products: Product[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  products,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const getProductName = (prodId: string) => {
    const product = products.find((p) => p.prod_id === prodId);
    return product?.prod_name || 'منتج محذوف';
  };

  const getProductDetails = (transaction: Transaction) => {
    if (!transaction.prod_items || transaction.prod_items.length === 0) {
      return '—';
    }

    return transaction.prod_items
      .map((item) => {
        const productName = getProductName(item.prod_id);
        return `${productName} (الكمية: ${
          item.quantity
        }, السعر: ${item.unit_price.toFixed(2)})`;
      })
      .join(', ');
  };

  return (
    <>
      <div className='w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
        <div className='hidden sm:grid grid-cols-5 gap-4 mb-4'>
          <h5 className='text-sm font-bold text-white'>
            {ar.transaction.Source}
          </h5>
          <h5 className='text-sm font-bold text-white'>
            {ar.strings.Products}
          </h5>
          <h5 className='text-sm font-bold text-white'>{ar.strings.Total}</h5>
          <h5 className='text-sm font-bold text-white'>{ar.strings.Date}</h5>
          <h5 className='text-sm font-bold text-white'>{ar.strings.Actions}</h5>
        </div>

        {/* Transactions */}
        <div className='flow-root'>
          <ul
            role='list'
            className='divide-y divide-gray-200 dark:divide-gray-700'>
            {transactions.map((transaction) => {
              const totalAmount =
                transaction.prod_items?.reduce(
                  (sum, item) => sum + item.quantity * item.unit_price,
                  0
                ) || 0;

              return (
                <li key={transaction.tran_id} className='py-3 sm:py-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-5 gap-4'>
                    {/* Source */}
                    <div>
                      <span className='sm:hidden block text-xs font-bold text-white'>
                        {ar.transaction.Source}
                      </span>
                      <p className='text-sm font-medium text-white'>
                        {transaction.tran_source}
                      </p>
                    </div>

                    {/* Products */}
                    <div>
                      <span className='sm:hidden block text-xs font-bold text-white'>
                        {ar.strings.Products}
                      </span>
                      <p className='text-sm text-white'>
                        {getProductDetails(transaction)}
                      </p>
                    </div>

                    {/* Total */}
                    <div>
                      <span className='sm:hidden block text-xs font-bold text-white'>
                        {ar.strings.Total}
                      </span>
                      <p className='text-sm text-white'>
                        {totalAmount.toFixed(2)}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <span className='sm:hidden block text-xs font-bold text-white'>
                        {ar.strings.Date}
                      </span>
                      <p className='text-sm text-white'>
                        {new Date(transaction.tran_date).toLocaleDateString(
                          'ar-EG'
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div>
                      <span className='sm:hidden block text-xs font-bold text-white'>
                        {ar.strings.Actions}
                      </span>
                      <div className='flex flex-col space-y-2 text-right sm:text-left'>
                        <button
                          onClick={() => onEdit(transaction)}
                          className='font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline'>
                          {ar.buttons.Edit}
                        </button>
                        <button
                          onClick={() => onDelete(transaction.tran_id)}
                          className='font-medium text-sm text-red-600 dark:text-red-500 hover:underline'>
                          {ar.buttons.Delete}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
