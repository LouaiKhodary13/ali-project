"use client";

import { useState } from "react";
import { DateRange, calculateAnalytics } from "@/app/utils/analytics";
import { exportAnalyticsToExcel } from "@/app/utils/excelExport";
import { Bill, Transaction, Customer, Product } from "@/app/types";

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
  const [selectedRange, setSelectedRange] = useState<DateRange>("alltime");
  const [isExporting, setIsExporting] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const analytics = calculateAnalytics(
        bills,
        transactions,
        customers,
        products,
        selectedRange
      );
      exportAnalyticsToExcel(analytics, selectedRange);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
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

  return (
    <div className="space-y-6">
      {/* Debug Section */}
      {showDebug && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-yellow-800">Debug Information</h4>
            <button
              onClick={() => setShowDebug(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              Hide
            </button>
          </div>
          <div className="text-sm space-y-1">
            <p>
              <strong>Raw Bills:</strong> {JSON.stringify(bills, null, 2)}
            </p>
            <p>
              <strong>Raw Transactions:</strong>{" "}
              {JSON.stringify(transactions, null, 2)}
            </p>
            <p>
              <strong>Selected Range:</strong> {selectedRange}
            </p>
            <p>
              <strong>Analytics Result:</strong>{" "}
              {JSON.stringify(currentAnalytics, null, 2)}
            </p>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4">Export Analytics</h3>

        <div className="flex items-center gap-4 mb-4">
          <div>
            <label
              htmlFor="dateRange"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Period:
            </label>
            <select
              id="dateRange"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as DateRange)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">This Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="yearly">This Year</option>
              <option value="alltime">All Time</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>📊 Export to Excel</>
            )}
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Export includes: Financial overview, top selling products, top
          customers, and monthly breakdown.
        </p>
      </div>

      {/* Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Financial Overview */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <h4 className="font-semibold text-gray-800 mb-3">
            Financial Overview
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Total Earned:</span>
              <span className="font-medium">
                ${currentAnalytics.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Total Spent:</span>
              <span className="font-medium">
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
                Net Profit:
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
          <h4 className="font-semibold text-gray-800 mb-3">
            Top Selling Products
          </h4>
          <div className="space-y-2">
            {currentAnalytics.topSellingProducts
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate">{item.product.prod_name}</span>
                  <span className="font-medium">
                    ${item.totalRevenue.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topSellingProducts.length === 0 && (
              <p className="text-gray-500 text-sm">No sales data available</p>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <h4 className="font-semibold text-gray-800 mb-3">Top Customers</h4>
          <div className="space-y-2">
            {currentAnalytics.topBuyingCustomers
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate">{item.customer.cust_name}</span>
                  <span className="font-medium">
                    ${item.totalSpent.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topBuyingCustomers.length === 0 && (
              <p className="text-gray-500 text-sm">
                No customer data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {currentAnalytics.monthlyBreakdown.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <h4 className="font-semibold text-gray-800 mb-3">
            Monthly Breakdown
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Earned</th>
                  <th className="text-right py-2">Spent</th>
                  <th className="text-right py-2">Profit</th>
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
