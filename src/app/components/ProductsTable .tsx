import React from "react";
import { ar } from "../lang/ar";
import { Product } from "@/app/types";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <div
          key={p.prod_id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
        >
          {/* Product Name Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 text-right truncate">
              {p.prod_name}
            </h3>
          </div>

          {/* Product Details in 2 columns */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Quantity */}
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {ar.products.quantity}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">
                    {p.prod_quant || "0"}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Price */}
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {ar.products.price}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">
                    {p.prod_price ? `${p.prod_price} ل.س` : "غير محدد"}
                  </div>
                </div>
              </div>
            </div>

            {/* Note - Full width if exists */}
            {p.prod_note && (
              <div className="text-right mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                  {ar.strings.Note}
                </div>
                <div className="text-sm text-blue-800 break-words">
                  {p.prod_note}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(p)}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                {ar.buttons.Edit}
              </button>
              <button
                onClick={() => onDelete?.(p.prod_id)}
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
