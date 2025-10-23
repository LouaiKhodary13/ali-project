// src/app/page.tsx
"use client";
import { BillsTable } from "@/app/components/BillsTable";
import { CustomerBillsModal } from "@/app/components/CustomerBillsModal";
import { CustomersTable } from "@/app/components/CustomersTable";
import { FormCustomer } from "@/app/components/FormCustomer";
import { TransactionsTable } from "@/app/components/TransactionsTable";
import { ar } from "@/app/lang/ar";
import { Bill, Customer, Product, Transaction } from "@/app/types";
import { useState } from "react";
import { AnalyticsExport } from "./components/AnalyticsExport";
import { FormBill } from "./components/FormBill";
import { FormProduct } from "./components/FormProduct";
import { FormTransaction } from "./components/FormTransaction";
import { ProductsTable } from "./components/ProductsTable ";
import { useBills } from "./components/hooks/useBills";
import { useCustomers } from "./components/hooks/useCustomers";
import { useProducts } from "./components/hooks/useProducts";
import { useTransactions } from "./components/hooks/useTransactions";

export default function Home() {
  // Change default tab to "bills"
  const [activeTab, setActiveTab] = useState<
    "customers" | "bills" | "transactions" | "products" | "analytics"
  >("bills");

  // Add this state at the top with other states:
  const [billsRefreshKey, setBillsRefreshKey] = useState(0);

  // Customers
  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Customer Bills Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showCustomerBillsModal, setShowCustomerBillsModal] = useState(false);

  // Bills
  const { bills, addBill, updateBill, deleteBill, refreshBills } = useBills();
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showBillForm, setShowBillForm] = useState(false);

  // Transactions
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Products
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductQuantities,
  } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Customer Bills handlers
  const handleViewCustomerBills = (customerId: string) => {
    const customer = customers.find((c) => c.cust_id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setShowCustomerBillsModal(true);
    }
  };

  const handleCloseCustomerBillsModal = () => {
    setShowCustomerBillsModal(false);
    setSelectedCustomer(null);
  };

  // Bill handlers with inventory management
  const handleCreateBill = async (billData: Omit<Bill, "bill_id">) => {
    try {
      // Create the bill
      await addBill(billData);

      // Update product quantities (subtract from inventory)
      await updateProductQuantities(billData.prod_items, "subtract");

      setShowBillForm(false);
    } catch (error) {
      console.error("Failed to create bill:", error);
      alert(ar.messages.Failed_to_create_bill);
    }
  };

  const handleUpdateBill = async (billData: Omit<Bill, "bill_id">) => {
    if (!editingBill) return;

    try {
      // Calculate the difference in quantities for each product
      const quantityChanges = new Map<string, number>();

      // First, add back all original quantities
      if (editingBill.prod_items) {
        editingBill.prod_items.forEach((item) => {
          quantityChanges.set(
            item.prod_id,
            (quantityChanges.get(item.prod_id) || 0) + item.quantity
          );
        });
      }

      // Then subtract the new quantities
      billData.prod_items.forEach((item) => {
        quantityChanges.set(
          item.prod_id,
          (quantityChanges.get(item.prod_id) || 0) - item.quantity
        );
      });

      // Update the bill first
      await updateBill(editingBill.bill_id, billData);

      // Apply net changes to inventory
      quantityChanges.forEach(async (netChange, prod_id) => {
        if (netChange !== 0) {
          const changeItem: {
            prod_id: string;
            quantity: number;
            unit_price: number;
          } = {
            prod_id,
            quantity: Math.abs(netChange),
            unit_price: 0, // Price doesn't matter for quantity updates
          };

          if (netChange > 0) {
            // Net increase means we need to add back to inventory
            await updateProductQuantities([changeItem], "add");
          } else if (netChange < 0) {
            // Net decrease means we need to subtract from inventory
            await updateProductQuantities([changeItem], "subtract");
          }
        }
      });

      setEditingBill(null);
      setShowBillForm(false);
    } catch (error) {
      console.error("Failed to update bill:", error);
      alert(ar.messages.Failed_to_update_bill);
    }
  };

  const handleDeleteBill = async (billId: string) => {
    const billToDelete = bills.find((b) => b.bill_id === billId);
    if (!billToDelete) return;

    if (!confirm(ar.messages.Are_you_sure_delete_bill)) return;

    try {
      await deleteBill(billId);

      // Restore product quantities when bill is deleted
      if (billToDelete.prod_items) {
        await updateProductQuantities(billToDelete.prod_items, "add");
      }
    } catch (error) {
      console.error("Failed to delete bill:", error);
      alert(ar.messages.Failed_to_delete_bill);
    }
  };

  // Transaction handlers with inventory management
  const handleCreateTransaction = async (
    transactionData: Omit<Transaction, "tran_id">
  ) => {
    try {
      // Create the transaction
      await addTransaction(transactionData);

      // Update product quantities (add to inventory for purchases)
      await updateProductQuantities(transactionData.prod_items, "add");

      setShowTransactionForm(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert(ar.messages.Failed_to_create_transaction);
    }
  };

  const handleUpdateTransaction = async (
    transactionData: Omit<Transaction, "tran_id">
  ) => {
    if (!editingTransaction) return;

    try {
      // Calculate the difference in quantities for each product
      const quantityChanges = new Map<string, number>();

      // First, subtract all original quantities (reverse the original addition)
      if (editingTransaction.prod_items) {
        editingTransaction.prod_items.forEach((item) => {
          quantityChanges.set(
            item.prod_id,
            (quantityChanges.get(item.prod_id) || 0) - item.quantity
          );
        });
      }

      // Then add the new quantities
      transactionData.prod_items.forEach((item) => {
        quantityChanges.set(
          item.prod_id,
          (quantityChanges.get(item.prod_id) || 0) + item.quantity
        );
      });

      // Update the transaction first
      await updateTransaction(editingTransaction.tran_id, transactionData);

      // Apply net changes to inventory
      quantityChanges.forEach(async (netChange, prod_id) => {
        if (netChange !== 0) {
          const changeItem: {
            prod_id: string;
            quantity: number;
            unit_price: number;
          } = {
            prod_id,
            quantity: Math.abs(netChange),
            unit_price: 0, // Price doesn't matter for quantity updates
          };

          if (netChange > 0) {
            // Net increase means we need to add to inventory
            await updateProductQuantities([changeItem], "add");
          } else if (netChange < 0) {
            // Net decrease means we need to subtract from inventory
            await updateProductQuantities([changeItem], "subtract");
          }
        }
      });

      setEditingTransaction(null);
      setShowTransactionForm(false);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert(ar.messages.Failed_to_update_transaction);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const transactionToDelete = transactions.find(
      (t) => t.tran_id === transactionId
    );
    if (!transactionToDelete) return;

    if (!confirm(ar.messages.Are_you_sure_delete_transaction)) return;

    try {
      await deleteTransaction(transactionId);

      // Remove product quantities when transaction is deleted
      if (transactionToDelete.prod_items) {
        await updateProductQuantities(
          transactionToDelete.prod_items,
          "subtract"
        );
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert(ar.messages.Failed_to_delete_transaction);
    }
  };

  // Replace handleBillsUpdated with this EXACT implementation:
  const handleBillsUpdated = async () => {
    try {
      console.log("=== Starting bills update process ===");

      // STEP 1: Refresh bills from IndexedDB
      console.log("Step 1: Refreshing bills from database...");
      await refreshBills();

      // STEP 2: Small delay to ensure React processes the update
      console.log("Step 2: Waiting for React state update...");
      await new Promise((resolve) => setTimeout(resolve, 150));

      // STEP 3: Force re-render
      console.log("Step 3: Forcing re-render...");
      setBillsRefreshKey((prev) => prev + 1);

      // STEP 4: Another small delay before closing
      await new Promise((resolve) => setTimeout(resolve, 100));

      // STEP 5: Show success and close
      console.log("Step 4: Success! Closing modal...");
      alert("تم إضافة الدفعة بنجاح");

      setShowCustomerBillsModal(false);
      setSelectedCustomer(null);

      console.log("=== Bills update complete ===");
    } catch (error) {
      console.error("Error in handleBillsUpdated:", error);
      alert("حدث خطأ أثناء تحديث الفواتير");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Tabs Nav */}
      <div className="mb-6">
        {/* Mobile: Dropdown */}
        <div className="block sm:hidden">
          <select
            value={activeTab}
            onChange={(e) =>
              setActiveTab(
                e.target.value as
                  | "customers"
                  | "bills"
                  | "transactions"
                  | "products"
                  | "analytics"
              )
            }
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bills">📄 {ar.tabs.bills}</option>
            <option value="customers">👥 {ar.tabs.customers}</option>
            <option value="transactions">💰 المدفوعات</option>
            <option value="products">📦 {ar.tabs.products}</option>
            <option value="analytics">📊 {ar.tabs.analytics}</option>
          </select>
        </div>

        {/* Desktop: Tab buttons - Reorder to put Bills first */}
        <div className="hidden sm:flex border-b-2 border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setActiveTab("bills")}
            className={`flex-1 px-4 lg:px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "bills"
                ? "bg-blue-600 text-white border-b-2 border-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📄</span>
              <span className="hidden md:inline">{ar.tabs.bills}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex-1 px-4 lg:px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "customers"
                ? "bg-blue-600 text-white border-b-2 border-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>👥</span>
              <span className="hidden md:inline">{ar.tabs.customers}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 px-4 lg:px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "transactions"
                ? "bg-blue-600 text-white border-b-2 border-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>💰</span>
              <span className="hidden md:inline">المدفوعات</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 px-4 lg:px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "products"
                ? "bg-blue-600 text-white border-b-2 border-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📦</span>
              <span className="hidden md:inline">{ar.tabs.products}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 px-4 lg:px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white border-b-2 border-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span className="hidden md:inline">{ar.tabs.analytics}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content - Reorder to put Bills first */}
      {activeTab === "bills" && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            {ar.titles.Bills_Management}
          </h1>

          {showBillForm && (
            <FormBill
              customers={customers}
              products={products}
              initial={editingBill || {}}
              isEditing={!!editingBill}
              onSubmit={async (data) => {
                if (editingBill) {
                  await handleUpdateBill(data);
                } else {
                  await handleCreateBill(data);
                }
              }}
              onCancel={() => {
                setEditingBill(null);
                setShowBillForm(false);
              }}
            />
          )}

          {!showBillForm && (
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowBillForm(true)}
            >
              {ar.buttons.Add_Bill}
            </button>
          )}

          <BillsTable
            bills={bills}
            customers={customers}
            products={products}
            onEdit={(b) => {
              setEditingBill(b);
              setShowBillForm(true);
            }}
            onDelete={handleDeleteBill}
          />
        </>
      )}

      {activeTab === "customers" && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            {ar.titles.Customer_Management}
          </h1>

          {showCustomerForm && (
            <FormCustomer
              initial={editingCustomer || {}}
              onSubmit={(data) => {
                if (editingCustomer) {
                  updateCustomer(editingCustomer.cust_id, data);
                  setEditingCustomer(null);
                } else {
                  addCustomer(data);
                }
                setShowCustomerForm(false);
              }}
              onCancel={() => {
                setEditingCustomer(null);
                setShowCustomerForm(false);
              }}
            />
          )}

          {!showCustomerForm && (
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowCustomerForm(true)}
            >
              {ar.buttons.Add_Customer}
            </button>
          )}

          <CustomersTable
            customers={customers}
            onEdit={(c) => {
              setEditingCustomer(c);
              setShowCustomerForm(true);
            }}
            onDelete={(id) => deleteCustomer(id)}
            onViewBills={(customerId) => handleViewCustomerBills(customerId)}
          />
        </>
      )}

      {activeTab === "transactions" && (
        <>
          <h1 className="text-2xl font-bold mb-4">إدارة المدفوعات</h1>

          {showTransactionForm && (
            <FormTransaction
              products={products}
              initial={editingTransaction || {}}
              isEditing={!!editingTransaction}
              onSubmit={async (data) => {
                if (editingTransaction) {
                  await handleUpdateTransaction(data);
                } else {
                  await handleCreateTransaction(data);
                }
              }}
              onCancel={() => {
                setEditingTransaction(null);
                setShowTransactionForm(false);
              }}
            />
          )}

          {!showTransactionForm && (
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowTransactionForm(true)}
            >
              إضافة مدفوعة
            </button>
          )}

          <TransactionsTable
            products={products}
            transactions={transactions}
            onEdit={(t) => {
              setEditingTransaction(t);
              setShowTransactionForm(true);
            }}
            onDelete={handleDeleteTransaction}
          />
        </>
      )}

      {activeTab === "products" && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            {ar.titles.Products_Management}
          </h1>

          {showProductForm && (
            <FormProduct
              initial={editingProduct || {}}
              onSubmit={(data) => {
                if (editingProduct) {
                  updateProduct(editingProduct.prod_id, data);
                  setEditingProduct(null);
                } else {
                  addProduct(data);
                }
                setShowProductForm(false);
              }}
              onCancel={() => {
                setEditingProduct(null);
                setShowProductForm(false);
              }}
            />
          )}

          {!showProductForm && (
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowProductForm(true)}
            >
              {ar.buttons.Add_Product}
            </button>
          )}

          <ProductsTable
            products={products}
            onEdit={(p) => {
              setEditingProduct(p);
              setShowProductForm(true);
            }}
            onDelete={(id) => deleteProduct(id)}
          />
        </>
      )}

      {activeTab === "analytics" && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            {ar.titles.Analytics_Reports}
          </h1>
          <AnalyticsExport
            bills={bills}
            transactions={transactions}
            customers={customers}
            products={products}
          />
        </>
      )}

      {/* Customer Bills Modal */}
      {showCustomerBillsModal && selectedCustomer && (
        <CustomerBillsModal
          key={`customer-bills-${selectedCustomer.cust_id}-${billsRefreshKey}`}
          customer={selectedCustomer}
          bills={bills}
          onClose={handleCloseCustomerBillsModal}
          products={products}
          onBillsUpdated={handleBillsUpdated}
        />
      )}
    </div>
  );
}
