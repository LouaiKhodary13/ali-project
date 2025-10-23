// /workspaces/nextjs/ali-project/src/app/components/TransactionsTable.tsx
"use client";
import { Transaction, Product } from "@/app/types";
import { ar } from "../lang/ar";

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
    return product?.prod_name || "منتج محذوف";
  };

  const renderProductItems = (transaction: Transaction) => {
    if (!transaction.prod_items || transaction.prod_items.length === 0) {
      return <div className="text-gray-500 text-sm italic">لا توجد منتجات</div>;
    }

    return (
      <div className="space-y-2">
        {transaction.prod_items.map((item, index) => {
          const productName = getProductName(item.prod_id);

          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-semibold text-gray-900 text-right flex-1">
                  {productName}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-right">
                  <span className="text-gray-500">الكمية:</span>
                  <span className="font-medium text-gray-900 mr-1">
                    {item.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">السعر:</span>
                  <span className="font-medium text-gray-900 mr-1">
                    {item.unit_price.toFixed(2)} ل.س
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const calculateTotal = (transaction: Transaction) => {
    return (
      transaction.prod_items?.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      ) || 0
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {transactions.map((transaction) => {
        const totalAmount = calculateTotal(transaction);

        return (
          <div
            key={transaction.tran_id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
          >
            {/* Transaction Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 text-right">
                  {transaction.tran_source}
                </h3>
                <div className="text-sm text-gray-600">
                  {new Date(transaction.tran_date).toLocaleDateString("ar-EG")}
                </div>
              </div>
            </div>

            {/* Transaction Content */}
            <div className="p-4 space-y-4">
              {/* Products Section */}
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {ar.strings.Products}
                </div>
                {renderProductItems(transaction)}
              </div>

              {/* Total Amount */}
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-xs text-green-700 font-medium uppercase tracking-wide mb-1">
                    {ar.strings.Total}
                  </div>
                  <div className="text-xl font-bold text-green-800">
                    {totalAmount.toFixed(2)} ل.س
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  {ar.buttons.Edit}
                </button>
                <button
                  onClick={() => onDelete(transaction.tran_id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  {ar.buttons.Delete}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
