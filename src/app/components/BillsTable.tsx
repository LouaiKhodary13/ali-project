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
  const getProductDetails = (bill: Bill) => {
    if (!bill.prod_items || bill.prod_items.length === 0) {
      return "—";
    }

    return bill.prod_items
      .map((item) => {
        const product = products.find((p) => p.prod_id === item.prod_id);
        const productName = product?.prod_name || "منتج محذوف";
        return `${productName} (${item.quantity}x${item.unit_price})`;
      })
      .join(", ");
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs text-white uppercase bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Customer}
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Products}
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                {ar.strings.Total_Bill}
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
              {ar.strings.Paid_Sum}
            </th>
            <th scope="col" className="px-6 py-3">
              {ar.strings.Left_Sum}
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
              className={`border-b border-gray-700 ${
                i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
              }`}
            >
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {customers.length > 0
                  ? customers.find((c) => c.cust_id === b.cust_id)?.cust_name ??
                    b.cust_id ??
                    "—"
                  : b.cust_id ?? "—"}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white"
                style={{ maxWidth: "300px", wordWrap: "break-word" }}
              >
                {getProductDetails(b)}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {b.bill_sum?.toFixed(2) || "0.00"}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {b.paid_sum?.toFixed(2) || "0.00"}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {b.left_sum?.toFixed(2) || "0.00"}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {new Date(b.bill_date).toLocaleDateString()}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-white whitespace-nowrap"
              >
                {b.bill_note}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4 ml-4"
                  onClick={() => onEdit?.(b)}
                >
                  {ar.buttons.Edit}
                </button>
                <button
                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
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
