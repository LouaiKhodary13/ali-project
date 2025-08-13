// components/BillsTable.tsx
import React from "react";
import { ar } from "../lang/ar";
import { Bill, Customer, Product } from "@/app/types";

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
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Customer}
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Products}
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                {ar.strings.Total}
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Date}
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Note}
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b, i) => (
            <tr
              key={b.bill_id}
              className={`border-b border-gray-200 dark:border-gray-700 ${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-900"
              }`}
            >
              {/* Customer Dropdown */}
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {customers.length > 0
                  ? customers.find((c) => c.cust_id === b.cust_id)?.cust_name ??
                    b.cust_id ??
                    "—"
                  : b.cust_id ?? "—"}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {(b.prod_ids ?? [])
                  .map(
                    (id) =>
                      products.find((p) => p.prod_id === id)?.prod_name ||
                      "Deleted product"
                  )
                  .join(", ") || "—"}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {b.bill_sum}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {new Date(b.bill_date).toLocaleDateString()}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {b.bill_note}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <button className="mr-2 underline" onClick={() => onEdit?.(b)}>
                  {ar.buttons.Edit}
                </button>
                <button
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  onClick={() => onDelete?.(b.bill_id)}
                >
                  {ar.buttons.Delete}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
