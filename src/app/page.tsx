// src/app/page.tsx
'use client';
import { ar } from './lang/ar';
import { useState } from 'react';
import { useProducts } from './components/hooks/useProducts';
import { FormProduct } from './components/FormProduct';
import { ProductsTable } from './components/ProductsTable ';
import { useCustomers } from './components/hooks/useCustomers';
import { CustomersTable } from '@/app/components/CustomersTable';
import { FormCustomer } from '@/app/components/FormCustomer';
import { Customer, Bill, Transaction, Product } from '@/app/types';
import { useBills } from './components/hooks/useBills';
import { BillsTable } from '@/app/components/BillsTable';
import { useTransactions } from './components/hooks/useTransactions';
import { TransactionsTable } from '@/app/components/TransactionsTable';
import { FormTransaction } from './components/FormTransaction';
import { FormBill } from './components/FormBill';

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'customers' | 'bills' | 'transactions' | 'products'
  >('customers');

  // Customers
  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Bills
  const { bills, addBill, updateBill, deleteBill } = useBills();
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showBillForm, setShowBillForm] = useState(false);

  // Transactions
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Products
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  return (
    <div className='p-6 max-w-5xl mx-auto'>
      {/* Tabs Nav */}
      <div className='flex border-b mb-4 justify-between'>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-2 py-2 ${
            activeTab === 'customers'
              ? 'border-b-2 border-blue-600 font-bold'
              : 'text-gray-500'
          }`}>
          {ar.tabs.customers}
        </button>
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-4 py-2 ${
            activeTab === 'bills'
              ? 'border-b-2 border-blue-600 font-bold'
              : 'text-gray-500'
          }`}>
          {ar.tabs.bills}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 ${
            activeTab === 'transactions'
              ? 'border-b-2 border-blue-600 font-bold'
              : 'text-gray-500'
          }`}>
          {ar.tabs.transactions}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 ${
            activeTab === 'products'
              ? 'border-b-2 border-blue-600 font-bold'
              : 'text-gray-500'
          }`}>
          {ar.tabs.products}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'customers' && (
        <>
          <h1 className='text-2xl font-bold mb-4'>
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
              className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
              onClick={() => setShowCustomerForm(true)}>
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
          />
        </>
      )}

      {activeTab === 'bills' && (
        <>
          <h1 className='text-2xl font-bold mb-4'>
            {ar.titles.Bills_Management}
          </h1>

          {showBillForm && (
            <FormBill
              customers={customers}
              products={products}
              initial={editingBill || {}}
              onSubmit={async (data) => {
                if (editingBill) {
                  await updateBill(editingBill.bill_id, data);
                  setEditingBill(null);
                } else {
                  await addBill(data);
                }
                setShowBillForm(false);
              }}
              onCancel={() => {
                setEditingBill(null);
                setShowBillForm(false);
              }}
            />
          )}

          {!showBillForm && (
            <button
              className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
              onClick={() => setShowBillForm(true)}>
              {ar.buttons.Add_Bill}
            </button>
          )}

          <BillsTable
            bills={bills}
            customers={customers}
            products={products} // 👈 pass products here
            onCustomerChange={async (billId, custId) => {
              try {
                await updateBill(billId, { cust_id: custId });
              } catch (err) {
                console.error('Failed to change bill customer:', err);
              }
            }}
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

      {activeTab === 'transactions' && (
        <>
          <h1 className='text-2xl font-bold mb-4'>
            {ar.titles.Transactions_Management}
          </h1>

          {showTransactionForm && (
            <FormTransaction
              products={products}
              initial={editingTransaction || {}}
              onSubmit={(data) => {
                if (editingTransaction) {
                  updateTransaction(editingTransaction.tran_id, data);
                  setEditingTransaction(null);
                } else {
                  addTransaction(data);
                }
                setShowTransactionForm(false);
              }}
              onCancel={() => {
                setEditingTransaction(null);
                setShowTransactionForm(false);
              }}
            />
          )}

          {!showTransactionForm && (
            <button
              className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
              onClick={() => setShowTransactionForm(true)}>
              {ar.buttons.Add_Transaction}
            </button>
          )}

          <TransactionsTable
            products={products}
            transactions={transactions}
            onEdit={(t) => {
              setEditingTransaction(t);
              setShowTransactionForm(true);
            }}
            onDelete={(id) => deleteTransaction(id)}
          />
        </>
      )}

      {activeTab === 'products' && (
        <>
          <h1 className='text-2xl font-bold mb-4'>
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
              className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
              onClick={() => setShowProductForm(true)}>
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
    </div>
  );
}
