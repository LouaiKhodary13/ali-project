import React from "react";
import { ar } from "../lang/ar";
import { Customer } from "../types";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {customers.map((c) => (
        <div
          key={c.cust_id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
        >
          {/* Customer Name Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 text-right truncate">
              {c.cust_name}
            </h3>
          </div>

          {/* Customer Details in 2 columns */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Address */}
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {ar.strings.Address}
                  </div>
                  <div className="text-sm text-gray-900 font-medium break-words">
                    {c.cust_adr || "غير محدد"}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Phone */}
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {ar.strings.Phone}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">
                    {c.cust_phone || "غير محدد"}
                  </div>
                </div>
              </div>
            </div>

            {/* Note - Full width if exists */}
            {c.cust_note && (
              <div className="text-right mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mb-1">
                  {ar.strings.Note}
                </div>
                <div className="text-sm text-yellow-800 break-words">
                  {c.cust_note}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {/* Primary Action - View Bills */}
              <button
                onClick={() => onViewBills?.(c.cust_id)}
                className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                عرض الفواتير
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(c)}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-sm font-medium rounded-lg transition-colors duration-200 border border-blue-200"
                >
                  {ar.buttons.Edit}
                </button>
                <button
                  onClick={() => onDelete?.(c.cust_id)}
                  className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-sm font-medium rounded-lg transition-colors duration-200 border border-red-200"
                >
                  {ar.buttons.Delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
