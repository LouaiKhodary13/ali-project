import React, { useState, useEffect } from 'react';
import { ar } from '../lang/ar';
import { Bill, Customer, Product } from '@/app/types';

type Props = {
  initial?: Partial<Omit<Bill, 'bill_id'>>;
  onSubmit: (data: Omit<Bill, 'bill_id'>) => void;
  onCancel?: () => void;
  customers: Customer[];
  products: Product[];
};

export const FormBill: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
  customers,
  products,
}) => {
  const [custId, setCustId] = useState(initial.cust_id || '');
  const [prodIds, setProdIds] = useState<string[]>(initial.prod_ids || []);
  const [billSum, setBillSum] = useState(initial.bill_sum?.toString() || '');
  const [billDate, setBillDate] = useState(toDateInputValue(initial.bill_date));
  const [billNote, setBillNote] = useState(initial.bill_note || '');

  function toDateInputValue(date?: string | Date) {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    if (date instanceof Date) {
      // convert Date object to YYYY-MM-DD
      return date.toISOString().slice(0, 10);
    }
    return '';
  }

  useEffect(() => {
    setCustId(initial.cust_id || '');
    setProdIds(initial.prod_ids || []);
    setBillSum(initial.bill_sum?.toString() || '');
    setBillDate(toDateInputValue(initial.bill_date));
    setBillNote(initial.bill_note || '');
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!custId.trim()) return alert('Customer is required');
    if (prodIds.length === 0)
      return alert('At least one product must be selected');
    if (!billSum || isNaN(Number(billSum)))
      return alert('Valid bill total is required');
    if (!billDate) return alert('Date is required');

    onSubmit({
      cust_id: custId.trim(),
      prod_ids: prodIds,
      bill_sum: Number(billSum),
      bill_date: new Date(billDate).toISOString(),
      bill_note: billNote.trim(),
    });

    // clear form if needed
    setCustId('');
    setProdIds([]);
    setBillSum('');
    setBillDate('');
    setBillNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded'>
      <div>
        <label className='block text-md font-bold  mb-2'>
          {ar.strings.Customer}
        </label>
        <select
          value={custId}
          onChange={(e) => setCustId(e.target.value)}
          className='w-full p-2 border rounded'
          required>
          <option value=''>{ar.strings.Select_a_customer}</option>
          {customers.map((c) => (
            <option key={c.cust_id} value={c.cust_id}>
              {c.cust_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-md  font-bold'>{ar.tabs.products}</label>
        <div className='border rounded p-2 max-h-48 overflow-y-auto  mb-2 mt-2'>
          {products.map((p) => (
            <label key={p.prod_id} className='flex items-center gap-2 text-md'>
              <input
                type='checkbox'
                value={p.prod_id}
                checked={prodIds.includes(p.prod_id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProdIds([...prodIds, p.prod_id]);
                  } else {
                    setProdIds(prodIds.filter((id) => id !== p.prod_id));
                  }
                }}
              />
              {p.prod_name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-md  font-bold mb-4 mt-4'>
          {ar.strings.Total}
        </label>
        <input
          type='number'
          value={billSum}
          onChange={(e) => setBillSum(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>

      <div>
        <label className='block text-md font-bold  mb-2 mt-2'>
          {ar.strings.Date}
        </label>
        <input
          type='date'
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>

      <div>
        <label className='block text-md font-bold  mb-2 mt-2'>
          {ar.strings.Note}
        </label>
        <input
          type='text'
          value={billNote}
          onChange={(e) => setBillNote(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div className='flex gap-2'>
        <button
          type='submit'
          className='px-3 py-1 bg-blue-600 text-white rounded  text-md font-bold  mb-2 mt-2'>
          {ar.buttons.Save}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='px-3 py-1 border rounded text-md font-bold  mb-2 mt-2 '>
          {ar.buttons.Cancel}
        </button>
      </div>
    </form>
  );
};
