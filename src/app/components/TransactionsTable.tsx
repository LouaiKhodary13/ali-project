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

  const getProductDetails = (transaction: Transaction) => {
    if (!transaction.prod_items || transaction.prod_items.length === 0) {
      return "—";
    }

    return transaction.prod_items
      .map((item) => {
        const productName = getProductName(item.prod_id);
        return `${productName} (الكمية: ${
          item.quantity
        }, السعر: ${item.unit_price.toFixed(2)})`;
      })
      .join(", ");
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs text-white uppercase bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              {ar.transaction.Source}
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
              {ar.strings.Actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, i) => {
            const totalAmount =
              transaction.prod_items?.reduce(
                (sum, item) => sum + item.quantity * item.unit_price,
                0
              ) || 0;

            return (
              <tr
                key={transaction.tran_id}
                className={`border-b border-gray-700 ${
                  i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {transaction.tran_source}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-white"
                  style={{ maxWidth: "300px", wordWrap: "break-word" }}
                >
                  {getProductDetails(transaction)}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {totalAmount.toFixed(2)}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {new Date(transaction.tran_date).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4 ml-4"
                    onClick={() => onEdit(transaction)}
                  >
                    {ar.buttons.Edit}
                  </button>
                  <button
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    onClick={() => onDelete(transaction.tran_id)}
                  >
                    {ar.buttons.Delete}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
