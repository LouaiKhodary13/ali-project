'use client';

import { useState } from 'react';
import { DateRange, calculateAnalytics } from '@/app/utils/analytics';
import { exportAnalyticsToExcel } from '@/app/utils/excelExport';
import { Bill, Transaction, Customer, Product } from '@/app/types';
import { ar } from '../lang/ar';

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
  const [selectedRange, setSelectedRange] = useState<DateRange>('alltime');
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
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
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
    <div className='space-y-6'>
      {/* Debug Section */}
      {showDebug && (
        <div className=' p-4 rounded-lg border'>
          <div className='flex justify-between items-center mb-2'>
            <h4 className='font-semibold text-yellow-800'>
              {ar.analytics.Debug_Information}
            </h4>
            <button
              onClick={() => setShowDebug(false)}
              className='text-yellow-600 hover:text-yellow-800'>
              {ar.analytics.Hide}
            </button>
          </div>
          <div className='text-sm space-y-1'>
            <p>
              <strong>{ar.analytics.Raw_Bills}</strong>
              {JSON.stringify(bills, null, 2)}
            </p>
            <p>
              <strong>{ar.analytics.Raw_Transactions}</strong>
              {JSON.stringify(transactions, null, 2)}
            </p>
            <p>
              <strong>{ar.analytics.Selected_Range}</strong> {selectedRange}
            </p>
            <p>
              <strong>{ar.analytics.Analytics_Result}</strong>
              {JSON.stringify(currentAnalytics, null, 2)}
            </p>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className='p-10 rounded-lg shadow-md border'>
        <h3 className='text-lg font-semibold text-black'>
          {ar.analytics.Export_Analytics}
        </h3>

        <div className='mb-5'>
          <label
            htmlFor='dateRange'
            className='block text-sm font-medium text-black'>
            {ar.analytics.TimePeriod}
          </label>
        </div>
        <div className='flex gap-5'>
          <select
            id='dateRange'
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as DateRange)}
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value='monthly'>{ar.analytics.This_Month}</option>
            <option value='6months'>{ar.analytics.Last_6_Months}</option>
            <option value='yearly'>{ar.analytics.This_Year}</option>
            <option value='alltime'>{ar.analytics.all_time}</option>
          </select>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50  flex items-center'>
            {isExporting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                {ar.analytics.Exporting}...
              </>
            ) : (
              <>📊 {ar.analytics.Export_to_Excel}</>
            )}
          </button>
        </div>

        <p className='text-sm text-black font-bold mt-10'>
          {
            ar.analytics
              .Export_includes_Financial_overview_top_selling_products_top_customers_and_monthly_breakdown
          }
        </p>
      </div>

      {/* Analytics Preview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Financial Overview */}
        <div className='bg-white p-4 rounded-lg shadow-md border'>
          <h4 className='font-bold text-black mb-3'>
            {ar.analytics.Financial_Overview}
          </h4>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-green-600 font-bold'>
                {ar.analytics.Total_Earned}:
              </span>
              <span className='font-bold text-green-600'>
                ${currentAnalytics.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-red-600 font-bold'>
                {ar.analytics.Total_Spent}
              </span>
              <span className='font-medium text-red-600'>
                ${currentAnalytics.totalSpent.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between border-t pt-2'>
              <span
                className={`font-semibold ${
                  currentAnalytics.netProfit >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                {ar.analytics.Net_Profit}:
              </span>
              <span
                className={`font-bold ${
                  currentAnalytics.netProfit >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                ${currentAnalytics.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className=' p-4 rounded-lg shadow-md border'>
          <h4 className='font-semibold text-black mb-3'>
            {ar.analytics.Top_Selling_Products}
          </h4>
          <div className='space-y-2 text-white'>
            {currentAnalytics.topSellingProducts
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className='flex justify-between text-sm'>
                  <span className='truncate text-black font-bold'>
                    {item.product.prod_name}
                  </span>
                  <span className='font-bold text-black'>
                    ${item.totalRevenue.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topSellingProducts.length === 0 && (
              <p className='text-white text-sm'>
                {ar.analytics.No_sales_data_available}
              </p>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className='p-4 rounded-lg shadow-md border'>
          <h4 className='font-bold text-black mb-3'>
            {ar.analytics.Top_Customers}
          </h4>
          <div className='space-y-2'>
            {currentAnalytics.topBuyingCustomers
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className='flex justify-between text-sm'>
                  <span className='truncate text-black font-bold'>
                    {item.customer.cust_name}
                  </span>
                  <span className='font-bold text-black'>
                    ${item.totalSpent.toFixed(2)}
                  </span>
                </div>
              ))}
            {currentAnalytics.topBuyingCustomers.length === 0 && (
              <p className='text-white text-sm'>
                {ar.analytics.No_customer_data_available}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {currentAnalytics.monthlyBreakdown.length > 0 && (
        <div className=' p-4 rounded-lg shadow-md border'>
          <h4 className='font-bold text-black mb-3'>
            {ar.analytics.Monthly_Breakdown}
          </h4>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='text-right py-2 text-black font-bold'>
                    {ar.analytics.Month}
                  </th>
                  <th className='text-right py-2 text-black font-bold'>
                    {ar.analytics.Earned}
                  </th>
                  <th className='text-right py-2 text-black font-bold'>
                    {ar.analytics.Spent}
                  </th>
                  <th className='text-right py-2 text-black font-bold'>
                    {ar.analytics.Profit}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAnalytics.monthlyBreakdown
                  .slice(-6)
                  .map((item, index) => (
                    <tr key={index} className='border-b'>
                      <td className='py-2'>{item.month}</td>
                      <td className='text-right py-2 text-green-600'>
                        ${item.earned.toFixed(2)}
                      </td>
                      <td className='text-right py-2 text-red-600'>
                        ${item.spent.toFixed(2)}
                      </td>
                      <td
                        className={`text-right py-2 font-medium ${
                          item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
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
