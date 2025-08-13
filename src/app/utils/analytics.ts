import { Bill, Transaction, Customer, Product } from '@/app/types';

export type DateRange = 'monthly' | '6months' | 'yearly' | 'alltime';

export interface AnalyticsData {
  totalEarned: number;
  totalSpent: number;
  netProfit: number;
  topSellingProducts: Array<{
    product: Product;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  topBuyingCustomers: Array<{
    customer: Customer;
    totalSpent: number;
    totalTransactions: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    earned: number;
    spent: number;
    profit: number;
  }>;
}

export function getDateRangeFilter(range: DateRange): Date | null {
  const now = new Date();
  
  switch (range) {
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case '6months':
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case 'yearly':
      return new Date(now.getFullYear(), 0, 1);
    case 'alltime':
      return null;
    default:
      return null;
  }
}

function parseDate(dateValue: string | Date | null | undefined): Date | null {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

export function filterByDateRange<T extends { bill_date?: string | Date; tran_date?: string | Date }>(
  items: T[],
  range: DateRange
): T[] {
  const startDate = getDateRangeFilter(range);
  if (!startDate) return items;

  return items.filter(item => {
    // Check both possible date fields
    const itemDate = parseDate(item.bill_date || item.tran_date);
    if (!itemDate) return false;
    return itemDate >= startDate;
  });
}

export function calculateAnalytics(
  bills: Bill[],
  transactions: Transaction[],
  customers: Customer[],
  products: Product[],
  range: DateRange
): AnalyticsData {
  const filteredBills = filterByDateRange(bills, range);
  const filteredTransactions = filterByDateRange(transactions, range);

  // Calculate totals from bills (money earned) - using bill_sum
  const totalEarned = filteredBills.reduce((sum, bill) => {
    return sum + (bill.bill_sum || 0);
  }, 0);

  // Calculate totals from transactions (money spent) - using tran_cost
  const totalSpent = filteredTransactions.reduce((sum, transaction) => {
    return sum + (transaction.tran_cost || 0);
  }, 0);

  const netProfit = totalEarned - totalSpent;

  // Top selling products (from bills - count how many times each product appears)
  const productSales = new Map<string, { quantity: number; revenue: number }>();
  
  filteredBills.forEach(bill => {
    if (bill.prod_ids && Array.isArray(bill.prod_ids)) {
      const revenuePerProduct = (bill.bill_sum || 0) / bill.prod_ids.length; // Split revenue equally among products
      
      bill.prod_ids.forEach(prodId => {
        const current = productSales.get(prodId) || { quantity: 0, revenue: 0 };
        productSales.set(prodId, {
          quantity: current.quantity + 1, // Count each sale as 1 quantity
          revenue: current.revenue + revenuePerProduct
        });
      });
    }
  });

  const topSellingProducts = Array.from(productSales.entries())
    .map(([prodId, data]) => {
      const product = products.find(p => p.prod_id === prodId);
      return product ? {
        product,
        totalQuantity: data.quantity,
        totalRevenue: data.revenue
      } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Top buying customers (from bills) - using bill_sum
  const customerSpending = new Map<string, { spent: number; transactions: number }>();
  
  filteredBills.forEach(bill => {
    const custId = bill.cust_id;
    const amount = bill.bill_sum || 0;
    
    const current = customerSpending.get(custId) || { spent: 0, transactions: 0 };
    customerSpending.set(custId, {
      spent: current.spent + amount,
      transactions: current.transactions + 1
    });
  });

  const topBuyingCustomers = Array.from(customerSpending.entries())
    .map(([custId, data]) => {
      const customer = customers.find(c => c.cust_id === custId);
      return customer ? {
        customer,
        totalSpent: data.spent,
        totalTransactions: data.transactions
      } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // Monthly breakdown
  const monthlyData = new Map<string, { earned: number; spent: number }>();
  
  // Process bills (earnings) - using bill_date
  filteredBills.forEach(bill => {
    const date = parseDate(bill.bill_date);
    if (date) {
      const month = date.toISOString().slice(0, 7); // YYYY-MM
      const current = monthlyData.get(month) || { earned: 0, spent: 0 };
      monthlyData.set(month, {
        ...current,
        earned: current.earned + (bill.bill_sum || 0)
      });
    }
  });

  // Process transactions (spending) - using tran_date
  filteredTransactions.forEach(transaction => {
    const date = parseDate(transaction.tran_date);
    if (date) {
      const month = date.toISOString().slice(0, 7);
      const current = monthlyData.get(month) || { earned: 0, spent: 0 };
      monthlyData.set(month, {
        ...current,
        spent: current.spent + (transaction.tran_cost || 0)
      });
    }
  });

  const monthlyBreakdown = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      earned: data.earned,
      spent: data.spent,
      profit: data.earned - data.spent
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalEarned,
    totalSpent,
    netProfit,
    topSellingProducts,
    topBuyingCustomers,
    monthlyBreakdown
  };
}