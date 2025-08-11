import React, { useState, useEffect } from 'react';
import { Bill } from '@/app/types';

type Props = {
  initial?: Partial<Omit<Bill, 'bill_id'>>;
  onSubmit: (data: Omit<Bill, 'bill_id'>) => void;
  onCancel?: () => void;
};

export const FormBill: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [custId, setCustId] = useState(initial.cust_id || '');
  const [prodIds, setProdIds] = useState(initial.prod_ids?.join(', ') || '');
  const [billSum, setBillSum] = useState(initial.bill_sum?.toString() || '');
  const [billDate, setBillDate] = useState(
    initial.bill_date?.slice(0, 10) || ''
  );
  const [billNote, setBillNote] = useState(initial.bill_note || '');

  useEffect(() => {
    setCustId(initial.cust_id || '');
    setProdIds(initial.prod_ids?.join(', ') || '');
    setBillSum(initial.bill_sum?.toString() || '');
    setBillDate(initial.bill_date?.slice(0, 10) || '');
    setBillNote(initial.bill_note || '');
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!custId.trim()) return alert('Customer ID is required');
    if (!prodIds.trim()) return alert('At least one Product ID is required');
    if (!billSum || isNaN(Number(billSum)))
      return alert('Valid bill total is required');
    if (!billDate) return alert('Date is required');

    onSubmit({
      cust_id: custId.trim(),
      prod_ids: prodIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
      bill_sum: Number(billSum),
      bill_date: new Date(billDate).toISOString(),
      bill_note: billNote.trim(),
    });

    // Clear form
    setCustId('');
    setProdIds('');
    setBillSum('');
    setBillDate('');
    setBillNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded '>
      <div>
        <label className='block text-sm font-medium'>Customer ID</label>
        <input
          type='text'
          value={custId}
          onChange={(e) => setCustId(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>
          Product IDs (comma separated)
        </label>
        <input
          type='text'
          value={prodIds}
          onChange={(e) => setProdIds(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Total</label>
        <input
          type='number'
          value={billSum}
          onChange={(e) => setBillSum(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Date</label>
        <input
          type='date'
          value={billDate}
          onChange={(e) => setBillDate(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Note</label>
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
          className='px-3 py-1 bg-blue-600 text-white rounded'>
          Save
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='px-3 py-1 border rounded'>
          Cancel
        </button>
      </div>
    </form>
  );
};
