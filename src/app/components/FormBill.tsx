import React, { useState, useEffect, useMemo } from "react";
import { ar } from "../lang/ar";
import { Bill, Customer, Product, BillProduct } from "@/app/types";

type Props = {
  initial?: Partial<Omit<Bill, "bill_id">>;
  onSubmit: (data: Omit<Bill, "bill_id">) => void;
  onCancel?: () => void;
  customers: Customer[];
  products: Product[];
  isEditing?: boolean; // Add this prop to know if we're editing
};

export const FormBill: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
  customers,
  products,
  isEditing = false,
}) => {
  const [custId, setCustId] = useState(initial.cust_id || "");
  const [prodItems, setProdItems] = useState<BillProduct[]>(
    initial.prod_items || []
  );
  const [paidSum, setPaidSum] = useState(initial.paid_sum?.toString() || "0");
  const [billDate, setBillDate] = useState(toDateInputValue(initial.bill_date));
  const [billNote, setBillNote] = useState(initial.bill_note || "");

  // Calculate available quantities considering the original bill items when editing
  const availableQuantities = useMemo(() => {
    if (!isEditing || !initial.prod_items) {
      return products.reduce((acc, product) => {
        acc[product.prod_id] = product.prod_quant;
        return acc;
      }, {} as Record<string, number>);
    }

    // When editing, add back the original quantities to get true availability
    return products.reduce((acc, product) => {
      const originalItem = initial.prod_items?.find(
        (item) => item.prod_id === product.prod_id
      );
      const originalQuantity = originalItem?.quantity || 0;
      acc[product.prod_id] = product.prod_quant + originalQuantity;
      return acc;
    }, {} as Record<string, number>);
  }, [products, initial.prod_items, isEditing]);

  // Calculate total bill sum from product items
  const billSum = prodItems.reduce(
    (total, item) => total + item.quantity * item.unit_price,
    0
  );

  function toDateInputValue(date?: string | Date) {
    if (!date) return "";
    if (typeof date === "string") {
      return date.slice(0, 10);
    }
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }
    return "";
  }

  useEffect(() => {
    setCustId(initial.cust_id || "");
    setProdItems(initial.prod_items || []);
    setPaidSum(initial.paid_sum?.toString() || "0");
    setBillDate(toDateInputValue(initial.bill_date));
    setBillNote(initial.bill_note || "");
  }, [initial]);

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.prod_id === productId);
    if (!product) return;

    const availableQuantity = availableQuantities[productId] || 0;

    // Check if sufficient quantity is available
    const existingItem = prodItems.find((item) => item.prod_id === productId);
    if (existingItem) {
      // If product already exists, check if adding one more exceeds available quantity
      const currentQuantity = existingItem.quantity;
      if (currentQuantity >= availableQuantity) {
        alert(
          `لا توجد كمية كافية من هذا المنتج. الكمية المتاحة: ${availableQuantity}`
        );
        return;
      }
      // Increase quantity if product already exists
      setProdItems(
        prodItems.map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Check if adding new product exceeds available quantity
      if (availableQuantity < 1) {
        alert(
          `لا توجد كمية كافية من هذا المنتج. الكمية المتاحة: ${availableQuantity}`
        );
        return;
      }
      // Add new product
      setProdItems([
        ...prodItems,
        {
          prod_id: productId,
          quantity: 1,
          unit_price: product.prod_price,
        },
      ]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.prod_id === productId);
    if (!product) return;

    const availableQuantity = availableQuantities[productId] || 0;

    // Check if the new quantity exceeds available quantity
    if (quantity > availableQuantity) {
      alert(
        `لا توجد كمية كافية من هذا المنتج. الكمية المتاحة: ${availableQuantity}`
      );
      return;
    }

    if (quantity <= 0) {
      setProdItems(prodItems.filter((item) => item.prod_id !== productId));
    } else {
      setProdItems(
        prodItems.map((item) =>
          item.prod_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateProductPrice = (productId: string, price: number) => {
    setProdItems(
      prodItems.map((item) =>
        item.prod_id === productId ? { ...item, unit_price: price } : item
      )
    );
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!custId.trim()) return alert("Customer is required");
    if (prodItems.length === 0)
      return alert("At least one product must be selected");
    if (!paidSum || isNaN(Number(paidSum)))
      return alert("Valid paid amount is required");
    if (Number(paidSum) < 0) return alert("Paid amount cannot be negative");
    if (Number(paidSum) > billSum)
      return alert("Paid amount cannot exceed total bill amount");
    if (!billDate) return alert("Date is required");

    const paidAmount = Number(paidSum);

    onSubmit({
      cust_id: custId.trim(),
      prod_items: prodItems,
      bill_sum: billSum,
      paid_sum: paidAmount,
      left_sum: billSum - paidAmount,
      bill_date: new Date(billDate).toISOString(),
      bill_note: billNote.trim(),
    });

    // clear form if needed (only for new bills, not when editing)
    if (!isEditing) {
      setCustId("");
      setProdItems([]);
      setPaidSum("0");
      setBillDate("");
      setBillNote("");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.strings.Customer}
        </label>
        <select
          value={custId}
          onChange={(e) => setCustId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">{ar.strings.Select_a_customer}</option>
          {customers.map((c) => (
            <option key={c.cust_id} value={c.cust_id}>
              {c.cust_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.tabs.products}
        </label>
        <div className="border rounded p-2">
          <div className="mb-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addProduct(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر منتج لإضافته</option>
              {products.map((p) => (
                <option key={p.prod_id} value={p.prod_id}>
                  {p.prod_name} - {p.prod_price} (متاح:{" "}
                  {availableQuantities[p.prod_id] || 0})
                </option>
              ))}
            </select>
          </div>

          {prodItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold">المنتجات المحددة:</h4>
              {prodItems.map((item) => {
                const product = products.find(
                  (p) => p.prod_id === item.prod_id
                );
                const availableQty = availableQuantities[item.prod_id] || 0;
                return (
                  <div
                    key={item.prod_id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className="flex-1">
                      {product?.prod_name || "منتج محذوف"}
                      <span className="text-sm text-gray-500 ml-2">
                        (متاح: {availableQty})
                      </span>
                    </span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateProductQuantity(
                          item.prod_id,
                          Number(e.target.value)
                        )
                      }
                      className="w-20 p-1 border rounded"
                      min="1"
                      max={availableQty}
                      placeholder="الكمية"
                    />
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateProductPrice(item.prod_id, Number(e.target.value))
                      }
                      className="w-24 p-1 border rounded"
                      min="0"
                      step="0.01"
                      placeholder="السعر"
                    />
                    <span className="w-20 text-right">
                      {(item.quantity * item.unit_price).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.strings.Total_Bill}
        </label>
        <div className="w-full p-2 border rounded bg-gray-100">
          {billSum.toFixed(2)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.strings.Paid_Sum}
        </label>
        <input
          type="number"
          value={paidSum}
          onChange={(e) => setPaidSum(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>

      {billSum &&
        paidSum &&
        !isNaN(Number(billSum)) &&
        !isNaN(Number(paidSum)) && (
          <div>
            <label className="block text-sm font-bold mb-2">
              {ar.strings.Left_Sum}
            </label>
            <div className="w-full p-2 border rounded bg-gray-100">
              {(billSum - Number(paidSum)).toFixed(2)}
            </div>
          </div>
        )}

      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.strings.Date}
        </label>
        <input
          type="date"
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          {ar.strings.Note}
        </label>
        <input
          type="text"
          value={billNote}
          onChange={(e) => setBillNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2 font-bold">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          {ar.buttons.Save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border rounded"
        >
          {ar.buttons.Cancel}
        </button>
      </div>
    </form>
  );
};
