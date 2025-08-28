import React, { useMemo } from 'react';
import { Bill, Customer, Product } from '../types/index';
import { ar } from '../lang/ar';
interface Props {
  customer: Customer;
  bills: Bill[];
  products: Product[];
  onClose: () => void;
}

export const CustomerBillsModal: React.FC<Props> = ({
  customer,
  bills,
  products,
  onClose,
}) => {
  // Filter bills for this specific customer
  const customerBills = useMemo(() => {
    return bills.filter((bill) => bill.cust_id === customer.cust_id);
  }, [bills, customer.cust_id]);

  // Calculate total amount for all customer bills
  const totalAmount = useMemo(() => {
    return customerBills.reduce((sum, bill) => sum + (bill.bill_sum || 0), 0);
  }, [customerBills]);

  // Calculate total paid amount
  const totalPaid = useMemo(() => {
    return customerBills.reduce((sum, bill) => sum + (bill.paid_sum || 0), 0);
  }, [customerBills]);

  // Calculate total remaining amount
  const totalRemaining = useMemo(() => {
    return customerBills.reduce((sum, bill) => sum + (bill.left_sum || 0), 0);
  }, [customerBills]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const getProductName = (prodId: string) => {
    const product = products.find((p) => p.prod_id === prodId);
    return product ? product.prod_name : prodId;
  };

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50'>
        <div className='relative w-full max-w-4xl max-h-[90vh] p-4'>
          {/* Modal content */}
          <div className='relative  rounded-lg shadow-sm bg-gray-800 max-h-full overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 rounded-t dark:border-gray-600'>
              <div>
                <h2 className='text-2xl font-bold text-white  dark:text-white'>
                  {ar.analytics.Client_invoices} {customer.cust_name}
                </h2>
                <p className='text-white dark:text-gray-400 mt-1'>
                  {ar.strings.Address}: {customer.cust_adr} | {ar.strings.Phone}
                  {customer.cust_phone}
                </p>
              </div>
              <button
                onClick={onClose}
                className='text-md bg-transparent text-white  rounded-lg text-sm w-10 h-10 flex justify-center items-center'>
                ×<span className='sr-only'>Close modal</span>
              </button>
            </div>

            {/* Summary */}
            <div className='p-4 md:p-5 space-y-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left'>
                <div>
                  <p className='text-sm text-white '>
                    {ar.strings.Total_number_of_invoices}
                  </p>
                  <p className='text-xl font-bold text-white'>
                    {customerBills.length}
                  </p>
                </div>
                <div>
                  <p className='text-sm  text-white'>
                    {ar.analytics.Total_amount}
                  </p>
                  <p className='text-xl font-bold text-white'>
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-white'>
                    {ar.analytics.Amount_paid}
                  </p>
                  <p className='text-xl font-bold text-white'>
                    ${totalPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-white'>
                    {ar.analytics.remaining_amount}
                  </p>
                  <p className='text-xl font-bold text-white'>
                    ${totalRemaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bills List */}
            {customerBills.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-white text-md'>{ar.analytics.no_bills}</p>
              </div>
            ) : (
              <div className='p-4 md:p-5 space-y-4'>
                {customerBills.map((bill) => (
                  <div
                    key={bill.bill_id}
                    className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3'>
                      <div>
                        <p className='text-white'>
                          {ar.transaction.date}: {formatDate(bill.bill_date)}
                        </p>
                        {bill.bill_note && (
                          <p className='text-white text-sm mt-1'>
                            {ar.strings.Note}: {bill.bill_note}
                          </p>
                        )}
                      </div>
                      <div className='text-right sm:text-left space-y-1 mt-2 sm:mt-0 text-white'>
                        <p className='text-lg font-bold text-white'>
                          {ar.strings.Total} ${(bill.bill_sum || 0).toFixed(2)}
                        </p>
                        <p className='text-md font-semibold text-white'>
                          {ar.strings.Paid_Sum} $
                          {(bill.paid_sum || 0).toFixed(2)}
                        </p>
                        <p className='text-md font-semibold text-white'>
                          {ar.strings.left_amount} $
                          {(bill.left_sum || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className='bg-gray-50 dark:bg-gray-700 rounded p-3'>
                      <h4 className='font-medium mb-2 text-white'>
                        {ar.tabs.products}:
                      </h4>
                      <div className='space-y-1'>
                        {bill.prod_items && bill.prod_items.length > 0 ? (
                          bill.prod_items.map((item, index) => (
                            <div
                              key={index}
                              className='grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-white'>
                              <span>
                                {ar.products.product}:{' '}
                                {getProductName(item.prod_id)}
                              </span>
                              <span>
                                {ar.products.quantity}: {item.quantity}
                              </span>
                              <span>
                                {ar.products.price} $
                                {item.unit_price.toFixed(2)}
                              </span>
                              <span className='font-medium text-white'>
                                {ar.strings.Total} $
                                {(item.quantity * item.unit_price).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className='text-xs text-white'>
                            {ar.products.no_products}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className='flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end'>
              <button
                onClick={onClose}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
