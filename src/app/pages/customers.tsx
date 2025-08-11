// /pages/customers.tsx
import React, { useState } from 'react';
import { CustomersTable } from '../components/CustomersTable';
import { FormCustomer } from '../components/FormCustomer';
import { useCustomers } from '../components/hooks/useCustomers';

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useCustomers();
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Customers</h1>
        <div>
          <button
            className='px-4 py-2 bg-green-600 text-white rounded'
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}>
            + Add Customer
          </button>
        </div>
      </div>

      {showForm && (
        <div className='mb-4'>
          <FormCustomer
            initial={editing ?? {}}
            onSubmit={(data) => {
              if (editing) {
                updateCustomer(editing.cust_id, data);
              } else addCustomer(data);
              setShowForm(false);
              setEditing(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      <CustomersTable
        customers={customers}
        onEdit={(c) => {
          setEditing(c);
          setShowForm(true);
        }}
        onDelete={(id) => {
          if (confirm('Delete?')) deleteCustomer(id);
        }}
      />
    </div>
  );
}
