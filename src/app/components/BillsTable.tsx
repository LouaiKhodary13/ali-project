// /workspaces/nextjs/ali-project/src/app/components/BillsTable.tsx
import React from "react";
import { ar } from "../lang/ar";
import { Bill, Customer, Product, BillProduct } from "@/app/types";

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
  const getCustomerName = (custId: string) => {
    if (customers.length > 0) {
      return (
        customers.find((c) => c.cust_id === custId)?.cust_name || custId || "—"
      );
    }
    return custId || "—";
  };

  // Helper function to get product display name
  const getProductDisplayName = (item: BillProduct) => {
    // Check if it's a custom product
    if (item.custom_name) {
      return {
        name: item.custom_name,
        isCustom: true,
      };
    }

    // Otherwise, find the product from the products list
    const product = products.find((p) => p.prod_id === item.prod_id);
    return {
      name: product?.prod_name || "منتج محذوف",
      isCustom: false,
    };
  };

  const renderProductItems = (bill: Bill) => {
    if (!bill.prod_items || bill.prod_items.length === 0) {
      return <div className="text-gray-500 text-sm italic">لا توجد منتجات</div>;
    }

    return (
      <div className="space-y-2">
        {bill.prod_items.map((item, index) => {
          const productInfo = getProductDisplayName(item);

          return (
            <div
              key={index}
              className={`rounded-lg p-3 border ${
                productInfo.isCustom
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-semibold text-right flex-1">
                  <span
                    className={
                      productInfo.isCustom ? "text-green-700" : "text-gray-900"
                    }
                  >
                    {productInfo.name}
                  </span>
                  {productInfo.isCustom && (
                    <span className="text-xs text-green-600 mr-2 font-normal">
                      (مخصص)
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-right">
                  <span className="text-gray-500">الكمية:</span>
                  <span
                    className={`font-medium mr-1 ${
                      productInfo.isCustom ? "text-green-700" : "text-gray-900"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">السعر:</span>
                  <span
                    className={`font-medium mr-1 ${
                      productInfo.isCustom ? "text-green-700" : "text-gray-900"
                    }`}
                  >
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {bills.map((b) => (
        <div
          key={b.bill_id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
        >
          {/* Bill Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 text-right">
                {getCustomerName(b.cust_id)}
              </h3>
              <div className="text-sm text-gray-600">
                {new Date(b.bill_date).toLocaleDateString("ar-EG")}
              </div>
            </div>
          </div>

          {/* Bill Content */}
          <div className="p-4 space-y-4">
            {/* Products Section */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {ar.strings.Products}
              </div>
              {renderProductItems(b)}
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  إجمالي الفاتورة
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {b.bill_sum?.toFixed(2) || "0.00"} ل.س
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">المدفوع</div>
                <div className="text-sm font-bold text-green-600">
                  {b.paid_sum?.toFixed(2) || "0.00"} ل.س
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">المتبقي</div>
                <div
                  className={`text-sm font-bold ${
                    (b.left_sum || 0) > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {b.left_sum?.toFixed(2) || "0.00"} ل.س
                </div>
              </div>
            </div>

            {/* Note - Full width if exists */}
            {b.bill_note && (
              <div className="text-right p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                  {ar.strings.Note}
                </div>
                <div className="text-sm text-amber-800 break-words">
                  {b.bill_note}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(b)}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                {ar.buttons.Edit}
              </button>
              <button
                onClick={() => onDelete?.(b.bill_id)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                {ar.buttons.Delete}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
