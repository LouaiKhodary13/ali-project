// /workspaces/nextjs/ali-project/src/app/components/FormProduct.tsx
import React, { useState, useEffect } from "react";
import { Product } from "@/app/types";

type Props = {
  initial?: Partial<Omit<Product, "prod_id">>;
  onSubmit: (data: Omit<Product, "prod_id">) => void;
  onCancel?: () => void;
};

export const FormProduct: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initial.prod_name || "");
  const [quant, setQuant] = useState(initial.prod_quant?.toString() || "");
  const [price, setPrice] = useState(initial.prod_price?.toString() || "");
  const [note, setNote] = useState(initial.prod_note || "");

  useEffect(() => {
    setName(initial.prod_name || "");
    setQuant(initial.prod_quant?.toString() || "");
    setPrice(initial.prod_price?.toString() || "");
    setNote(initial.prod_note || "");
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("اسم المنتج مطلوب");
      return;
    }
    if (!quant || isNaN(Number(quant))) {
      alert("كمية صحيحة مطلوبة");
      return;
    }
    if (!price || isNaN(Number(price))) {
      alert("سعر صحيح مطلوب");
      return;
    }

    onSubmit({
      prod_name: name.trim(),
      prod_quant: Number(quant),
      prod_price: Number(price),
      prod_note: note.trim(),
    });

    // Clear form
    setName("");
    setQuant("");
    setPrice("");
    setNote("");
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Simple Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 text-right">
            {initial.prod_name ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              اسم المنتج *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
              placeholder="اكتب اسم المنتج"
              required
            />
          </div>

          {/* Quantity and Price in Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الكمية *
              </label>
              <input
                type="number"
                value={quant}
                onChange={(e) => setQuant(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
                placeholder="0"
                required
                min={0}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                السعر *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
                placeholder="0.00"
                required
                min={0}
                step="0.01"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              ملاحظات
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-base"
              placeholder="اكتب ملاحظات إضافية"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl transition-colors text-base"
            >
              حفظ
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full h-12 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors text-base"
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
