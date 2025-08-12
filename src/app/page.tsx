// src/app/page.tsx
"use client";

import { useState } from "react";
import { useProducts } from "./components/hooks/useProducts";
import { FormProduct } from "./components/FormProduct";
import { ProductsTable } from "./components/ProductsTable ";
import { useCustomers } from "./components/hooks/useCustomers";
import { CustomersTable } from "@/app/components/CustomersTable";
import { FormCustomer } from "@/app/components/FormCustomer";
import { Customer, Bill, Transaction } from "@/app/types";
import { useBills } from "./components/hooks/useBills";
import { BillsTable } from "@/app/components/BillsTable";
import { useTransactions } from "./components/hooks/useTransactions";
import { TransactionsTable } from "@/app/components/TransactionsTable";
import { FormTransaction } from "./components/FormTransaction";
import { FormBill } from "./components/FormBill";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "customers" | "bills" | "transactions" | "products"
  >("customers");

  // Customers
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    loading: customersLoading,
    error: customersError,
  } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Bills
  const { bills, addBill, updateBill, deleteBill, loading: billsLoading, error: billsError } = useBills();
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showBillForm, setShowBillForm] = useState(false);

  // Transactions
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading: transactionsLoading, error: transactionsError } =
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
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Tabs Nav */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 ${
            activeTab === "customers"
              ? "border-b-2 border-blue-600 font-bold"
              : "text-gray-500"
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveTab("bills")}
          className={`px-4 py-2 ${
            activeTab === "bills"
              ? "border-b-2 border-blue-600 font-bold"
              : "text-gray-500"
          }`}
        >
          Bills
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 ${
            activeTab === "transactions"
              ? "border-b-2 border-blue-600 font-bold"
              : "text-gray-500"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 ${
            activeTab === "products"
              ? "border-b-2 border-blue-600 font-bold"
              : "text-gray-500"
          }`}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "customers" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

          {showCustomerForm && (
            <FormCustomer
              initial={editingCustomer || {}}
              onSubmit={async (data) => {
                try {
                  if (editingCustomer) {
                    await updateCustomer(editingCustomer.cust_id, data);
                    setEditingCustomer(null);
                  } else {
                    await addCustomer(data);
                  }
                  setShowCustomerForm(false);
                } catch (err) {
                  console.error("Failed to save customer:", err);
                }
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
              Add Customer
            </button>
          )}

          <CustomersTable
            customers={customers}
            loading={customersLoading}
            error={customersError}
            onEdit={(c) => {
              setEditingCustomer(c);
              setShowCustomerForm(true);
            }}
            onDelete={async (id) => {
              try {
                await deleteCustomer(id);
              } catch (err) {
                console.error("Failed to delete customer:", err);
              }
            }}
          />
        </>
      )}

      {activeTab === "bills" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Bills Management</h1>

          {showBillForm && (
            <FormBill
              initial={editingBill || {}}
              onSubmit={async (data) => {
                try {
                  if (editingBill) {
                    await updateBill(editingBill.bill_id, data);
                    setEditingBill(null);
                  } else {
                    await addBill(data);
                  }
                  setShowBillForm(false);
                } catch (err) {
                  console.error('Failed to save bill:', err);
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
              Add Bill
            </button>
          )}

          <BillsTable
            bills={bills}
            loading={billsLoading}
            error={billsError}
            onEdit={(b) => {
              setEditingBill(b);
              setShowBillForm(true);
            }}
            onDelete={async (id) => {
              try {
                await deleteBill(id);
              } catch (err) {
                console.error('Failed to delete bill:', err);
              }
            }}
          />
        </>
      )}

      {activeTab === "transactions" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Transactions Management</h1>

          {showTransactionForm && (
            <FormTransaction
              initial={editingTransaction || {}}
              onSubmit={async (data) => {
                try {
                  if (editingTransaction) {
                    await updateTransaction(editingTransaction.tran_id, data);
                    setEditingTransaction(null);
                  } else {
                    await addTransaction(data);
                  }
                  setShowTransactionForm(false);
                } catch (err) {
                  console.error('Failed to save transaction:', err);
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
              Add Transaction
            </button>
          )}

          <TransactionsTable
            transactions={transactions}
            loading={transactionsLoading}
            error={transactionsError}
            onEdit={(t) => {
              setEditingTransaction(t);
              setShowTransactionForm(true);
            }}
            onDelete={async (id) => {
              try {
                await deleteTransaction(id);
              } catch (err) {
                console.error('Failed to delete transaction:', err);
              }
            }}
          />
        </>
      )}

      {activeTab === "products" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Products Management</h1>

          {showProductForm && (
            <FormProduct
              initial={editingProduct || {}}
              onSubmit={async (data) => {
                try {
                  if (editingProduct) {
                    await updateProduct(editingProduct.prod_id, data);
                    setEditingProduct(null);
                  } else {
                    await addProduct(data);
                  }
                  setShowProductForm(false);
                } catch (err) {
                  console.error("Failed to save product:", err);
                }
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
              Add Product
            </button>
          )}

          <ProductsTable
            products={products}
            loading={productsLoading}
            error={productsError}
            onEdit={(p) => {
              setEditingProduct(p);
              setShowProductForm(true);
            }}
            onDelete={async (id) => {
              try {
                await deleteProduct(id);
              } catch (err) {
                console.error("Failed to delete product:", err);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
