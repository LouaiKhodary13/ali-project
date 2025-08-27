import React, { useMemo } from "react";
import { Bill, Customer, Product } from "../types/index";

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
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const getProductName = (prodId: string) => {
    const product = products.find((p) => p.prod_id === prodId);
    return product ? product.prod_name : prodId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              فواتير العميل: {customer.cust_name}
            </h2>
            <p className="text-gray-600 mt-1">
              العنوان: {customer.cust_adr} | الهاتف: {customer.cust_phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">إجمالي عدد الفواتير</p>
              <p className="text-xl font-bold text-blue-600">
                {customerBills.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المبلغ</p>
              <p className="text-xl font-bold text-green-600">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">المبلغ المدفوع</p>
              <p className="text-xl font-bold text-blue-600">
                ${totalPaid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">المبلغ المتبقي</p>
              <p className="text-xl font-bold text-red-600">
                ${totalRemaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Bills List */}
        {customerBills.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">لا توجد فواتير لهذا العميل</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customerBills.map((bill) => {
              return (
                <div
                  key={bill.bill_id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-600">
                        التاريخ: {formatDate(bill.bill_date)}
                      </p>
                      {bill.bill_note && (
                        <p className="text-gray-600 text-sm mt-1">
                          ملاحظة: {bill.bill_note}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-green-600">
                        الإجمالي: ${(bill.bill_sum || 0).toFixed(2)}
                      </p>
                      <p className="text-md font-semibold text-blue-600">
                        المدفوع: ${(bill.paid_sum || 0).toFixed(2)}
                      </p>
                      <p className="text-md font-semibold text-red-600">
                        المتبقي: ${(bill.left_sum || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Products in this bill */}
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="font-medium mb-2">المنتجات:</h4>
                    <div className="space-y-1">
                      {bill.prod_items && bill.prod_items.length > 0 ? (
                        bill.prod_items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>المنتج: {getProductName(item.prod_id)}</span>
                            <span>الكمية: {item.quantity}</span>
                            <span>السعر: ${item.unit_price.toFixed(2)}</span>
                            <span className="font-medium">
                              المجموع: $
                              {(item.quantity * item.unit_price).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">لا توجد منتجات</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
