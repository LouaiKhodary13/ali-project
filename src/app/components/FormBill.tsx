import React, { useState, useEffect, useMemo } from "react";
import { Bill, Customer, Product, BillProduct } from "@/app/types";

type Props = {
  initial?: Partial<Omit<Bill, "bill_id">>;
  onSubmit: (data: Omit<Bill, "bill_id">) => void;
  onCancel?: () => void;
  customers: Customer[];
  products: Product[];
  isEditing?: boolean;
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

  // Add state for multi-select
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showMultiSelect, setShowMultiSelect] = useState(false);

  // Add state for custom product
  const [showCustomProduct, setShowCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductPrice, setCustomProductPrice] = useState("");

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

  // Add product from existing products (no stock validation)
  const addProduct = (productId: string) => {
    const product = products.find((p) => p.prod_id === productId);
    if (!product) return;

    const existingItem = prodItems.find((item) => item.prod_id === productId);
    if (existingItem) {
      setProdItems(
        prodItems.map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
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

  // Add custom product (not in products table)
  const addCustomProduct = () => {
    if (!customProductName.trim()) {
      alert("يرجى إدخال اسم المنتج");
      return;
    }
    if (
      !customProductPrice ||
      isNaN(Number(customProductPrice)) ||
      Number(customProductPrice) < 0
    ) {
      alert("يرجى إدخال سعر صحيح");
      return;
    }

    // Generate a temporary ID for custom product
    const customId = `custom_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    setProdItems([
      ...prodItems,
      {
        prod_id: customId,
        quantity: 1,
        unit_price: Number(customProductPrice),
        custom_name: customProductName.trim(), // Store custom name
      },
    ]);

    // Reset form
    setCustomProductName("");
    setCustomProductPrice("");
    setShowCustomProduct(false);
  };

  // Update product quantity (no stock validation)
  const updateProductQuantity = (productId: string, quantity: number) => {
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
    if (price < 0) {
      alert("السعر لا يمكن أن يكون سالباً");
      return;
    }

    setProdItems(
      prodItems.map((item) =>
        item.prod_id === productId ? { ...item, unit_price: price } : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setProdItems(prodItems.filter((item) => item.prod_id !== productId));
  };

  // Add multiple products from selection
  const addMultipleProducts = () => {
    selectedProducts.forEach((productId) => {
      const product = products.find((p) => p.prod_id === productId);
      if (!product) return;

      const existingItem = prodItems.find((item) => item.prod_id === productId);
      if (existingItem) {
        setProdItems((prev) =>
          prev.map((item) =>
            item.prod_id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setProdItems((prev) => [
          ...prev,
          {
            prod_id: productId,
            quantity: 1,
            unit_price: product.prod_price,
          },
        ]);
      }
    });

    setSelectedProducts([]);
    setShowMultiSelect(false);
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!custId.trim()) {
      alert("العميل مطلوب");
      return;
    }
    if (prodItems.length === 0) {
      alert("يجب اختيار منتج واحد على الأقل");
      return;
    }
    if (!paidSum || isNaN(Number(paidSum))) {
      setPaidSum("0");
    }
    if (Number(paidSum) < 0) {
      alert("المبلغ المدفوع لا يمكن أن يكون سالباً");
      return;
    }
    if (Number(paidSum) > billSum) {
      alert("المبلغ المدفوع لا يمكن أن يتجاوز إجمالي الفاتورة");
      return;
    }
    if (!billDate) {
      alert("التاريخ مطلوب");
      return;
    }

    const paidAmount = Number(paidSum) || 0;

    onSubmit({
      cust_id: custId.trim(),
      prod_items: prodItems,
      bill_sum: billSum,
      paid_sum: paidAmount,
      left_sum: billSum - paidAmount,
      bill_date: new Date(billDate).toISOString(),
      bill_note: billNote.trim(),
    });

    if (!isEditing) {
      setCustId("");
      setProdItems([]);
      setPaidSum("0");
      setBillDate("");
      setBillNote("");
    }
  }

  // Helper function to get product display name
  const getProductDisplayName = (item: BillProduct) => {
    if (item.custom_name) {
      return `${item.custom_name} (مخصص)`;
    }
    const product = products.find((p) => p.prod_id === item.prod_id);
    return product?.prod_name || "منتج محذوف";
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 text-right">
            {isEditing ? "تعديل الفاتورة" : "إنشاء فاتورة جديدة"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              العميل *
            </label>
            <select
              value={custId}
              onChange={(e) => setCustId(e.target.value)}
              className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              required
            >
              <option value="">اختر العميل</option>
              {customers.map((c) => (
                <option key={c.cust_id} value={c.cust_id}>
                  {c.cust_name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              المنتجات *
            </label>

            {/* Add Product Options */}
            <div className="mb-4 space-y-2">
              {/* Single Product Dropdown */}
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
                    {p.prod_name} -{" "}
                    {Number(p.prod_price).toLocaleString("en-US")}
                  </option>
                ))}
              </select>

              {/* Multi-Select Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMultiSelect(!showMultiSelect)}
                className="w-full h-10 px-4 border border-blue-200 rounded-lg text-right bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors text-sm font-medium"
              >
                {showMultiSelect
                  ? "إخفاء الاختيار المتعدد"
                  : "اختيار منتجات متعددة"}
              </button>

              {/* Custom Product Toggle Button */}
              <button
                type="button"
                onClick={() => setShowCustomProduct(!showCustomProduct)}
                className="w-full h-10 px-4 border border-green-200 rounded-lg text-right bg-green-50 hover:bg-green-100 text-green-600 transition-colors text-sm font-medium"
              >
                {showCustomProduct ? "إخفاء المنتج المخصص" : "إضافة منتج مخصص"}
              </button>

              {/* Custom Product Interface */}
              {showCustomProduct && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 text-right">
                    إضافة منتج مخصص (غير موجود في القائمة)
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                        اسم المنتج *
                      </label>
                      <input
                        type="text"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="أدخل اسم المنتج"
                        className="w-full h-9 px-3 border border-gray-200 rounded text-right bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                        السعر *
                      </label>
                      <input
                        type="number"
                        value={customProductPrice}
                        onChange={(e) => setCustomProductPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full h-9 px-3 border border-gray-200 rounded text-right bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={addCustomProduct}
                        className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                      >
                        إضافة المنتج
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomProductName("");
                          setCustomProductPrice("");
                          setShowCustomProduct(false);
                        }}
                        className="h-9 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Select Interface */}
              {showMultiSelect && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {products.map((product) => (
                      <label
                        key={product.prod_id}
                        className="flex items-center justify-between cursor-pointer hover:bg-white p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.prod_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([
                                ...selectedProducts,
                                product.prod_id,
                              ]);
                            } else {
                              setSelectedProducts(
                                selectedProducts.filter(
                                  (id) => id !== product.prod_id
                                )
                              );
                            }
                          }}
                          className="ml-2"
                        />
                        <span className="text-sm text-right flex-1">
                          {product.prod_name} -{" "}
                          {Number(product.prod_price).toLocaleString("en-US")}
                        </span>
                      </label>
                    ))}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={addMultipleProducts}
                        className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        إضافة المنتجات المحددة ({selectedProducts.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedProducts([])}
                        className="h-8 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                      >
                        مسح الكل
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Products */}
            {prodItems.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 text-right">
                  المنتجات المحددة:
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {prodItems.map((item) => {
                    const product = products.find(
                      (p) => p.prod_id === item.prod_id
                    );
                    const itemTotal = item.quantity * item.unit_price;
                    const isCustomProduct = item.prod_id.startsWith("custom_");

                    return (
                      <div
                        key={item.prod_id}
                        className={`rounded-lg p-3 border ${
                          isCustomProduct
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {/* Product Header - Compact */}
                        <div className="flex justify-between items-center mb-3">
                          <button
                            type="button"
                            onClick={() => removeProduct(item.prod_id)}
                            className="flex items-center justify-center w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                            title="حذف المنتج"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          <div className="text-right flex-1 mr-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {getProductDisplayName(item)}
                            </div>
                            {!isCustomProduct && (
                              <div className="text-xs text-gray-500">
                                متاح: {product?.prod_quant || 0}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Compact Mobile Layout */}
                        <div className="space-y-2">
                          {/* Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button
                                type="button"
                                onClick={() =>
                                  updateProductQuantity(
                                    item.prod_id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateProductQuantity(
                                    item.prod_id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 h-7 px-2 border border-gray-200 rounded text-center text-sm"
                                min="1"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateProductQuantity(
                                    item.prod_id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-gray-600">
                              الكمية
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) =>
                                updateProductPrice(
                                  item.prod_id,
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-7 px-3 border border-gray-200 rounded text-right text-sm"
                              min="0"
                              step="0.01"
                            />
                            <span className="text-xs text-gray-600 mr-2">
                              السعر
                            </span>
                          </div>

                          {/* Total */}
                          <div
                            className={`rounded p-2 border ${
                              isCustomProduct
                                ? "bg-green-100 border-green-300"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium ${
                                  isCustomProduct
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {Number(itemTotal).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span
                                className={`text-xs ${
                                  isCustomProduct
                                    ? "text-green-700"
                                    : "text-blue-700"
                                }`}
                              >
                                الإجمالي
                              </span>
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

          {/* Bill Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  إجمالي الفاتورة
                </label>
                <div className="w-full h-10 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-end text-sm font-bold text-blue-600">
                  {Number(billSum).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  المبلغ المدفوع
                </label>
                <input
                  type="number"
                  value={paidSum}
                  onChange={(e) => setPaidSum(e.target.value)}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  min="0"
                  max={billSum}
                  step="0.01"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  اتركه فارغاً أو 0 لإنشاء فاتورة بدون دفع
                </p>
              </div>

              {/* Remaining Amount */}
              {billSum > 0 && paidSum && !isNaN(Number(paidSum)) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    المبلغ المتبقي
                  </label>
                  <div
                    className={`w-full h-10 px-4 border rounded-lg flex items-center justify-end text-sm font-bold ${
                      billSum - Number(paidSum) > 0
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-green-50 border-green-200 text-green-600"
                    }`}
                  >
                    {Number(billSum - Number(paidSum)).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date and Note */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                تاريخ الفاتورة *
              </label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full h-10 px-4 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                ملاحظات
              </label>
              <textarea
                value={billNote}
                onChange={(e) => setBillNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-sm"
                placeholder="اكتب ملاحظات إضافية"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors text-sm"
            >
              حفظ الفاتورة
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full h-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
