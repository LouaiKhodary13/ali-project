import * as XLSX from 'xlsx';
import { AnalyticsData, DateRange } from './analytics';

export function exportAnalyticsToExcel(
  analytics: AnalyticsData,
  range: DateRange
) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Financial Overview
  const overviewData = [
    ['نظرة عامة مالية', ''],
    ['إجمالي الإيرادات', `${analytics.totalEarned.toFixed(2)}`],
    ['مجمل الإنفاق', `${analytics.totalSpent.toFixed(2)}`],
    ['صافي الربح', `${analytics.netProfit.toFixed(2)}`],
    ['', ''],
    ['الفترة', range],
    ['تم انشاؤها', new Date().toLocaleDateString()],
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');

  // Sheet 2: Top Selling Products
  const productsData = [
    ['Product Name', 'Total Quantity Sold', 'Total Revenue'],
    ...analytics.topSellingProducts.map((item) => [
      item.product.prod_name,
      item.totalQuantity,
      `${item.totalRevenue.toFixed(2)}`,
    ]),
  ];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Products');

  // Sheet 3: Top Customers
  const customersData = [
    ['Customer Name', 'Total Spent', 'Total Transactions'],
    ...analytics.topBuyingCustomers.map((item) => [
      item.customer.cust_name,
      `${item.totalSpent.toFixed(2)}`,
      item.totalTransactions,
    ]),
  ];
  const customersSheet = XLSX.utils.aoa_to_sheet(customersData);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Top Customers');

  // Sheet 4: Monthly Breakdown
  const monthlyData = [
    ['Month', 'Earned', 'Spent', 'Profit'],
    ...analytics.monthlyBreakdown.map((item) => [
      item.month,
      `${item.earned.toFixed(2)}`,
      `${item.spent.toFixed(2)}`,
      `${item.profit.toFixed(2)}`,
    ]),
  ];
  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Breakdown');

  // Generate filename
  const filename = `analytics_${range}_${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  // Write and download the file
  XLSX.writeFile(workbook, filename);
}
