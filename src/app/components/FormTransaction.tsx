// /workspaces/nextjs/ali-project/src/app/components/FormTransaction.tsx
"use client";
import { Product, Transaction, BillProduct } from "@/app/types";
import { useState, useEffect } from "react";

interface FormTransactionProps {
  products: Product[];
  initial: Partial<Transaction>;
  isEditing?: boolean;
  onSubmit: (data: Omit<Transaction, "tran_id">) => void;
  onCancel: () => void;
}

export function FormTransaction({
  products,
  initial,
  isEditing = false,
  onSubmit,
  onCancel,
}: FormTransactionProps) {
  const [source, setSource] = useState(initial.tran_source || "");
  const [date, setDate] = useState(
    initial.tran_date || new Date().toISOString().split("T")[0]
  );
  const [selectedProducts, setSelectedProducts] = useState<BillProduct[]>(
    initial.prod_items || []
  );

  // Calculate cost automatically from products
  const cost = selectedProducts.reduce(
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
    setSource(initial.tran_source || "");
    setDate(toDateInputValue(initial.tran_date));
    setSelectedProducts(initial.prod_items || []);
  }, [initial]);

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.prod_id === productId);
    if (!product) return;

    const existingItem = selectedProducts.find(
      (item) => item.prod_id === productId
    );
    if (existingItem) {
      // Increase quantity if product already exists
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new product with quantity 1
      setSelectedProducts([
        ...selectedProducts,
        {
          prod_id: productId,
          quantity: 1,
          unit_price: product.prod_price,
        },
      ]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      // Don't allow quantity less than 1, reset to 1
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.prod_id === productId ? { ...item, quantity: 1 } : item
        )
      );
    } else {
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.prod_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateProductPrice = (productId: string, price: number) => {
    setSelectedProducts(
      selectedProducts.map((item) =>
        item.prod_id === productId ? { ...item, unit_price: price } : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.prod_id !== productId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!source.trim()) {
      alert("المصدر مطلوب");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("يجب اختيار منتج واحد على الأقل");
      return;
    }
    if (cost <= 0) {
      alert("التكلفة يجب أن تكون أكبر من صفر");
      return;
    }
    if (!date) {
      alert("التاريخ مطلوب");
      return;
    }

    // Validate all products have valid data
    for (const item of selectedProducts) {
      if (!item.prod_id) {
        alert("يجب اختيار جميع المنتجات");
        return;
      }
      if (item.quantity <= 0) {
        alert("جميع الكميات يجب أن تكون أكبر من صفر");
        return;
      }
      if (item.unit_price < 0) {
        alert("أسعار الوحدة لا يمكن أن تكون سالبة");
        return;
      }
    }

    onSubmit({
      tran_source: source,
      tran_cost: cost,
      tran_date: new Date(date).toISOString(),
      prod_items: selectedProducts,
    });

    // Clear form if not editing
    if (!isEditing) {
      setSource("");
      setDate("");
      setSelectedProducts([]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 text-right">
            {isEditing ? "تعديل المعاملة" : "إضافة معاملة جديدة"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              المصدر *
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              placeholder="اكتب مصدر المعاملة"
              required
            />
          </div>

          {/* Products Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              المنتجات *
            </label>

            {/* Add Product Dropdown */}
            <div className="mb-4">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addProduct(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              >
                <option value="">اختر منتج لإضافته</option>
                {products.map((p) => (
                  <option key={p.prod_id} value={p.prod_id}>
                    {p.prod_name} - {Number(p.prod_price).toLocaleString("en-US")} (متاح: {p.prod_quant})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 text-right">
                  المنتجات المحددة:
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedProducts.map((item) => {
                    const product = products.find(
                      (p) => p.prod_id === item.prod_id
                    );
                    const itemTotal = item.quantity * item.unit_price;

                    return (
                      <div
                        key={item.prod_id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        {/* Product Header - Compact */}
                        <div className="flex justify-between items-center mb-3">
                          <button
                            type="button"
                            onClick={() => removeProduct(item.prod_id)}
                            className="flex items-center justify-center w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                            title="حذف المنتج"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="text-right flex-1 mr-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {product?.prod_name || "منتج محذوف"}
                            </div>
                            <div className="text-xs text-gray-500">
                              متاح: {product?.prod_quant || 0}
                            </div>
                          </div>
                        </div>

                        {/* Compact Mobile Layout */}
                        <div className="space-y-2">
                          {/* Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button
                                type="button"
                                onClick={() => updateProductQuantity(item.prod_id, item.quantity - 1)}
                                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateProductQuantity(item.prod_id, Math.max(1, Number(e.target.value)))}
                                className="w-16 h-7 px-2 border border-gray-200 rounded text-center text-sm"
                                min="1"
                              />
                              <button
                                type="button"
                                onClick={() => updateProductQuantity(item.prod_id, item.quantity + 1)}
                                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-gray-600">الكمية</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateProductPrice(item.prod_id, Number(e.target.value))}
                              className="flex-1 h-7 px-3 border border-gray-200 rounded text-right text-sm"
                              min="0"
                              step="0.01"
                            />
                            <span className="text-xs text-gray-600 mr-2">السعر</span>
                          </div>

                          {/* Total */}
                          <div className="bg-blue-50 rounded p-2 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-600">
                                {Number(itemTotal).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span className="text-xs text-blue-700">الإجمالي</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Total Cost */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-green-600">
                {Number(cost).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <label className="text-sm font-medium text-green-700">
                إجمالي التكلفة
              </label>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              التاريخ *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors text-sm"
            >
              حفظ المعاملة
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full h-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
