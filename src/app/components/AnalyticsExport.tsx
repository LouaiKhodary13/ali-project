"use client";

import { useState } from "react";
import { DateRange, calculateAnalytics } from "@/app/utils/analytics";
import { exportAnalyticsToExcel } from "@/app/utils/excelExport";
import { Bill, Transaction, Customer, Product } from "@/app/types";
import { ar } from "../lang/ar";

interface AnalyticsExportProps {
  bills: Bill[];
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
}

export function AnalyticsExport({
  bills,
  transactions,
  customers,
  products,
}: AnalyticsExportProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>("monthly");
  const [isExporting, setIsExporting] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log("Starting export process...");
      const analytics = calculateAnalytics(
        bills,
        transactions,
        customers,
        products,
        selectedRange
      );

      console.log("Analytics calculated:", analytics);
      await exportAnalyticsToExcel(analytics, selectedRange);
      console.log("Export completed successfully");
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate current analytics for preview
  const currentAnalytics = calculateAnalytics(
    bills,
    transactions,
    customers,
    products,
    selectedRange
  );

  // Quick filter buttons
  const quickFilters = [
    { key: "today" as DateRange, label: "اليوم", icon: "📅" },
    { key: "weekly" as DateRange, label: "هذا الأسبوع", icon: "📊" },
    { key: "monthly" as DateRange, label: "هذا الشهر", icon: "📈" },
    { key: "yearly" as DateRange, label: "هذا العام", icon: "🗓️" },
    { key: "alltime" as DateRange, label: "كل الوقت", icon: "♾️" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-right">
              📊 لوحة التحليلات المالية
            </h2>
            <p className="text-gray-600 text-right mt-1">
              تحليل شامل للأداء المالي والمبيعات
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري التصدير...
              </>
            ) : (
              <>📊 تصدير إلى Excel</>
            )}
          </button>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedRange(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedRange === filter.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              من تاريخ
            </label>
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) =>
                setCustomDateRange((prev) => ({
                  ...prev,
                  start: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) =>
                setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                // Apply custom date range logic here
                console.log("Custom range:", customDateRange);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تطبيق النطاق المخصص
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Profit - Most Important */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">صافي الربح</p>
              <p className="text-3xl font-bold">
                {currentAnalytics.netProfit.toFixed(2)} ل.س
              </p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                currentAnalytics.netProfit >= 0
                  ? "bg-green-400 text-green-900"
                  : "bg-red-400 text-red-900"
              }`}
            >
              {currentAnalytics.netProfit >= 0 ? "ربح" : "خسارة"}
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                إجمالي الإيرادات
              </p>
              <p className="text-3xl font-bold">
                {currentAnalytics.totalEarned.toFixed(2)} ل.س
              </p>
            </div>
            <div className="text-4xl opacity-80">📈</div>
          </div>
          <div className="mt-4">
            <span className="text-xs bg-blue-400 text-blue-900 px-2 py-1 rounded-full">
              من {bills.length} فاتورة
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">
                إجمالي المصروفات
              </p>
              <p className="text-3xl font-bold">
                {currentAnalytics.totalSpent.toFixed(2)} ل.س
              </p>
            </div>
            <div className="text-4xl opacity-80">📉</div>
          </div>
          <div className="mt-4">
            <span className="text-xs bg-red-400 text-red-900 px-2 py-1 rounded-full">
              من {transactions.length} معاملة
            </span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">هامش الربح</p>
              <p className="text-3xl font-bold">
                {currentAnalytics.totalEarned > 0
                  ? (
                      (currentAnalytics.netProfit /
                        currentAnalytics.totalEarned) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
          <div className="mt-4">
            <span className="text-xs bg-purple-400 text-purple-900 px-2 py-1 rounded-full">
              نسبة مئوية
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4 text-right flex items-center gap-2">
            <span>🏆</span>
            أفضل المنتجات مبيعاً
          </h4>
          <div className="space-y-3">
            {currentAnalytics.topSellingProducts
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.product.prod_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.totalQuantity} قطعة مباعة
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-green-600 text-sm">
                      {item.totalRevenue.toFixed(2)} ل.س
                    </p>
                  </div>
                </div>
              ))}
            {currentAnalytics.topSellingProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-sm">لا توجد بيانات مبيعات</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4 text-right flex items-center gap-2">
            <span>👥</span>
            أفضل العملاء
          </h4>
          <div className="space-y-3">
            {currentAnalytics.topBuyingCustomers
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.customer.cust_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.totalSpent} فاتورة
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-blue-600 text-sm">
                      {item.totalSpent.toFixed(2)} ل.س
                    </p>
                  </div>
                </div>
              ))}
            {currentAnalytics.topBuyingCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-sm">لا توجد بيانات عملاء</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4 text-right flex items-center gap-2">
            <span>📋</span>
            إحصائيات سريعة
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium text-sm">
                إجمالي العملاء
              </span>
              <span className="font-bold text-blue-900">
                {customers.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium text-sm">
                إجمالي المنتجات
              </span>
              <span className="font-bold text-green-900">
                {products.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium text-sm">
                إجمالي الفواتير
              </span>
              <span className="font-bold text-purple-900">{bills.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-700 font-medium text-sm">
                إجمالي المدفوعات
              </span>
              <span className="font-bold text-orange-900">
                {transactions.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium text-sm">
                متوسط قيمة الفاتورة
              </span>
              <span className="font-bold text-red-900">
                {bills.length > 0
                  ? (currentAnalytics.totalEarned / bills.length).toFixed(2)
                  : "0.00"}{" "}
                ل.س
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Chart */}
      {currentAnalytics.monthlyBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-6 text-right flex items-center gap-2">
            <span>📈</span>
            التحليل الشهري
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-right py-3 px-4 font-bold text-gray-900">
                    الشهر
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">
                    الإيرادات
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">
                    المصروفات
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">
                    صافي الربح
                  </th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">
                    هامش الربح
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnalytics.monthlyBreakdown
                  .slice(-6)
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {item.month}
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-green-600 font-bold">
                          {item.earned.toFixed(2)} ل.س
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-red-600 font-bold">
                          {item.spent.toFixed(2)} ل.س
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span
                          className={`font-bold ${
                            item.profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.profit.toFixed(2)} ل.س
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span
                          className={`font-medium ${
                            item.earned > 0 &&
                            (item.profit / item.earned) * 100 >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.earned > 0
                            ? ((item.profit / item.earned) * 100).toFixed(1)
                            : "0.0"}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Debug Section */}
      {showDebug && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-yellow-800">
              {ar.analytics.Debug_Information}
            </h4>
            <button
              onClick={() => setShowDebug(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              {ar.analytics.Hide}
            </button>
          </div>
          <div className="text-sm space-y-1 text-yellow-700">
            <p>
              <strong>Selected Range:</strong> {selectedRange}
            </p>
            <p>
              <strong>Bills Count:</strong> {bills.length}
            </p>
            <p>
              <strong>Transactions Count:</strong> {transactions.length}
            </p>
            <p>
              <strong>Analytics Result:</strong>{" "}
              {JSON.stringify(currentAnalytics, null, 2)}
            </p>
          </div>
        </div>
      )}

      {!showDebug && (
        <div className="text-center">
          <button
            onClick={() => setShowDebug(true)}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            عرض معلومات التشخيص
          </button>
        </div>
      )}

      {/* Export Section */}
      <div className="p-10 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-black">
          {ar.analytics.Export_Analytics}
        </h3>

        <div className="mb-5">
          <label
            htmlFor="dateRange"
            className="block text-sm font-medium text-black"
          >
            {ar.analytics.TimePeriod}
          </label>
        </div>
        <div className="flex gap-5">
          <select
            id="dateRange"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as DateRange)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">{ar.analytics.This_Month}</option>
            <option value="6months">{ar.analytics.Last_6_Months}</option>
            <option value="yearly">{ar.analytics.This_Year}</option>
            <option value="alltime">{ar.analytics.all_time}</option>
          </select>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50  flex items-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {ar.analytics.Exporting}...
              </>
            ) : (
              <>📊 {ar.analytics.Export_to_Excel}</>
            )}
          </button>
        </div>

        <p className="text-sm text-black font-bold mt-10">
          {
            ar.analytics
              .Export_includes_Financial_overview_top_selling_products_top_customers_and_monthly_breakdown
          }
        </p>
      </div>

      {/* Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Financial Overview */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <h4 className="font-bold text-black mb-3">
            {ar.analytics.Financial_Overview}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600 font-bold">
                {ar.analytics.Total_Earned}:
              </span>
              <span className="font-bold text-green-600">
                ${currentAnalytics.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 font-bold">
                {ar.analytics.Total_Spent}
              </span>
              <span className="font-medium text-red-600">
                ${currentAnalytics.totalSpent.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span
                className={`font-semibold ${
                  currentAnalytics.netProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {ar.analytics.Net_Profit}:
              </span>
              <span
                className={`font-bold ${
                  currentAnalytics.netProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${currentAnalytics.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <h4 className="font-semibold text-black mb-3">
            {ar.analytics.Top_Selling_Products}
          </h4>
          <div className="space-y-2">
            {currentAnalytics.topSellingProducts
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate text-black font-bold">
                    {item.product.prod_name}
                  </span>
                  <span className="font-bold text-black">
                    ${item.totalRevenue.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topSellingProducts.length === 0 && (
              <div className="text-gray-500 text-sm">
                <p>{ar.analytics.No_sales_data_available}</p>
                <p className="text-xs mt-1">
                  Bills: {bills.length}, Products: {products.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="p-4 rounded-lg shadow-md border">
          <h4 className="font-bold text-black mb-3">
            {ar.analytics.Top_Customers}
          </h4>
          <div className="space-y-2">
            {currentAnalytics.topBuyingCustomers
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate text-black font-bold">
                    {item.customer.cust_name}
                  </span>
                  <span className="font-bold text-black">
                    ${item.totalSpent.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topBuyingCustomers.length === 0 && (
              <p className="text-white text-sm">
                {ar.analytics.No_customer_data_available}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {currentAnalytics.monthlyBreakdown.length > 0 && (
        <div className=" p-4 rounded-lg shadow-md border">
          <h4 className="font-bold text-black mb-3">
            {ar.analytics.Monthly_Breakdown}
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2 text-black font-bold">
                    {ar.analytics.Month}
                  </th>
                  <th className="text-right py-2 text-black font-bold">
                    {ar.analytics.Earned}
                  </th>
                  <th className="text-right py-2 text-black font-bold">
                    {ar.analytics.Spent}
                  </th>
                  <th className="text-right py-2 text-black font-bold">
                    {ar.analytics.Profit}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnalytics.monthlyBreakdown
                  .slice(-6)
                  .map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.month}</td>
                      <td className="text-right py-2 text-green-600">
                        ${item.earned.toFixed(2)}
                      </td>
                      <td className="text-right py-2 text-red-600">
                        ${item.spent.toFixed(2)}
                      </td>
                      <td
                        className={`text-right py-2 font-medium ${
                          item.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ${item.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
