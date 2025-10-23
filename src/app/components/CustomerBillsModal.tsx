import React, { useMemo, useEffect } from "react";
import { Bill, Customer, Product } from "../types/index";
import { billService } from "../services/billService";

interface Props {
  customer: Customer;
  bills: Bill[];
  products: Product[];
  onClose: () => void;
  onAddPayment?: (customerId: string, amount: number, note?: string) => void;
  onBillsUpdated?: () => void;
}

export const CustomerBillsModal: React.FC<Props> = ({
  customer,
  bills,
  products,
  onClose,
  onAddPayment,
  onBillsUpdated,
}) => {
  // Add state for payment modal
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [paymentNote, setPaymentNote] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Filter bills for this specific customer
  const customerBills = useMemo(() => {
    console.log("Recalculating customerBills, total bills:", bills.length);
    return bills.filter((bill) => bill.cust_id === customer.cust_id);
  }, [bills, customer.cust_id]);

  // Calculate total amount for all customer bills
  const totalAmount = useMemo(() => {
    const sum = customerBills.reduce(
      (sum, bill) => sum + (bill.bill_sum || 0),
      0
    );
    console.log("Total amount:", sum);
    return sum;
  }, [customerBills]);

  // Calculate total paid amount
  const totalPaid = useMemo(() => {
    const sum = customerBills.reduce(
      (sum, bill) => sum + (bill.paid_sum || 0),
      0
    );
    console.log("Total paid:", sum);
    return sum;
  }, [customerBills]);

  // Calculate total remaining amount
  const totalRemaining = useMemo(() => {
    const sum = customerBills.reduce(
      (sum, bill) => sum + (bill.left_sum || 0),
      0
    );
    console.log("Total remaining:", sum);
    return sum;
  }, [customerBills]);

  // Enhanced effect to log when bills prop changes
  useEffect(() => {
    console.log("=== CustomerBillsModal Props Update ===");
    console.log("Total bills received:", bills.length);
    console.log("Customer ID:", customer.cust_id);
    console.log("Customer bills filtered:", customerBills.length);
    console.log("Total amount:", totalAmount);
    console.log("Total paid:", totalPaid);
    console.log("Total remaining:", totalRemaining);
    console.log("Bills array reference:", bills);
    console.log("=====================================");
  }, [
    bills,
    customerBills,
    totalAmount,
    totalPaid,
    totalRemaining,
    customer.cust_id,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const getProductName = (prodId: string) => {
    const product = products.find((p) => p.prod_id === prodId);
    return product ? product.prod_name : prodId;
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("يرجى إدخال مبلغ صحيح");
      return;
    }
    if (amount > totalRemaining) {
      alert("المبلغ المدخل أكبر من المبلغ المتبقي");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Adding payment:", amount);

      await billService.addPaymentToCustomer(
        customer.cust_id,
        amount,
        bills,
        paymentNote.trim() || undefined
      );

      console.log("Payment added successfully");

      // Reset form
      setPaymentAmount("");
      setPaymentNote("");
      setShowPaymentModal(false);

      // Call parent's refresh handler which will close the modal
      if (onBillsUpdated) {
        await onBillsUpdated();
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("حدث خطأ أثناء إضافة الدفعة");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 sm:items-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[100vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300 mt-auto sm:mt-0">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-right mb-2">
                {customer.cust_name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-lg sm:text-xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary Cards - Fixed */}
        <div className="p-3 sm:p-6 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1">💰</div>
              <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">
                إجمالي المبلغ
              </p>
              <p className="text-sm sm:text-lg font-bold text-green-600">
                {totalAmount.toFixed(2)} ل.س
              </p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1">✅</div>
              <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">
                المبلغ المدفوع
              </p>
              <p className="text-sm sm:text-lg font-bold text-blue-600">
                {totalPaid.toFixed(2)} ل.س
              </p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1">⏳</div>
              <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">
                المبلغ المتبقي
              </p>
              <p className="text-sm sm:text-lg font-bold text-red-600">
                {totalRemaining.toFixed(2)} ل.س
              </p>
            </div>
          </div>

          {/* Add Credit Button */}
          {totalRemaining > 0 && (
            <div className="mt-3 sm:mt-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full h-9 sm:h-12 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-xs sm:text-base"
              >
                <span>💳</span>
                إضافة دفعة ({totalRemaining.toFixed(2)} ل.س متبقي)
              </button>
            </div>
          )}
        </div>

        {/* Bills List - Scrollable with proper mobile handling */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-4 sm:pb-6"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {customerBills.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                لا توجد فواتير لهذا العميل
              </p>
              <p className="text-gray-400 text-sm mt-2">
                ابدأ بإنشاء فاتورة جديدة
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 pb-4">
              {customerBills.map((bill) => {
                const isFullyPaid = (bill.left_sum || 0) === 0;

                return (
                  <div
                    key={bill.bill_id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    {/* Bill Header */}
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isFullyPaid ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isFullyPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isFullyPaid ? "مدفوعة بالكامل" : "غير مكتملة"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            📅 {formatDate(bill.bill_date)}
                          </p>
                          {bill.bill_note && (
                            <p className="text-xs text-gray-500 mt-1">
                              📝 {bill.bill_note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bill Amounts */}
                    <div className="p-3 sm:p-4 bg-gray-50">
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الإجمالي</p>
                          <p className="text-sm font-bold text-gray-900">
                            {(bill.bill_sum || 0).toFixed(2)} ل.س
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">المدفوع</p>
                          <p className="text-sm font-bold text-blue-600">
                            {(bill.paid_sum || 0).toFixed(2)} ل.س
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">المتبقي</p>
                          <p className="text-sm font-bold text-red-600">
                            {(bill.left_sum || 0).toFixed(2)} ل.س
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="p-3 sm:p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 text-right">
                        🛍️ المنتجات:
                      </h4>
                      {bill.prod_items && bill.prod_items.length > 0 ? (
                        <div
                          className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto"
                          style={{ WebkitOverflowScrolling: "touch" }}
                        >
                          {bill.prod_items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-xl p-3 text-sm"
                            >
                              <div className="flex justify-between items-center">
                                <div className="text-right flex-1">
                                  <p className="font-medium text-gray-900">
                                    {getProductName(item.prod_id)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    الكمية: {item.quantity} ×{" "}
                                    {item.unit_price.toFixed(2)} ل.س
                                  </p>
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-green-600">
                                    {(item.quantity * item.unit_price).toFixed(
                                      2
                                    )}{" "}
                                    ل.س
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">
                          لا توجد منتجات
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-10 sm:h-12 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-right">
              إضافة دفعة للعميل
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  المبلغ المدفوع *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  placeholder="0.00"
                  min="0"
                  max={totalRemaining}
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  الحد الأقصى: {totalRemaining.toFixed(2)} ل.س
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  ملاحظة (اختيارية)
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-sm"
                  placeholder="ملاحظة حول الدفعة..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddPayment}
                disabled={isProcessing}
                className="flex-1 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
              >
                {isProcessing ? "جاري الإضافة..." : "إضافة الدفعة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
