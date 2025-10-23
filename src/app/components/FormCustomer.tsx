import React, { useState, useEffect } from "react";
import { Customer } from "../types";

type Props = {
  initial?: Partial<Customer>;
  onSubmit: (data: Omit<Customer, "cust_id">) => void;
  onCancel?: () => void;
};

export const FormCustomer: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initial.cust_name || "");
  const [adr, setAdr] = useState(initial.cust_adr || "");
  const [phone, setPhone] = useState(initial.cust_phone?.toString() || "");
  const [note, setNote] = useState(initial.cust_note || "");

  useEffect(() => {
    setName(initial.cust_name || "");
    setAdr(initial.cust_adr || "");
    setPhone(initial.cust_phone?.toString() || "");
    setNote(initial.cust_note || "");
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("اسم العميل مطلوب");
      return;
    }
    onSubmit({
      cust_name: name,
      cust_adr: adr,
      cust_phone: phone,
      cust_note: note,
    });
    // clear form
    setName("");
    setAdr("");
    setPhone("");
    setNote("");
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Simple Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 text-right">
            {initial.cust_id ? "تعديل العميل" : "إضافة عميل جديد"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              اسم العميل *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
              placeholder="اكتب اسم العميل"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              العنوان
            </label>
            <input
              type="text"
              value={adr}
              onChange={(e) => setAdr(e.target.value)}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
              placeholder="اكتب العنوان"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-base"
              placeholder="اكتب رقم الهاتف"
            />
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
