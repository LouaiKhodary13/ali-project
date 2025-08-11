import React, { useState, useEffect } from 'react';
import { Transaction } from '@/app/types';

type Props = {
  initial?: Partial<Omit<Transaction, 'tran_id'>>;
  onSubmit: (data: Omit<Transaction, 'tran_id'>) => void;
  onCancel?: () => void;
};

export const FormTransaction: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [prodIds, setProdIds] = useState(initial.prod_ids?.join(', ') || '');
  const [source, setSource] = useState(initial.tran_source || '');
  const [cost, setCost] = useState(initial.tran_cost?.toString() || '');
  const [date, setDate] = useState(initial.tran_date?.slice(0, 10) || '');
  const [note, setNote] = useState(initial.tran_note || '');

  useEffect(() => {
    setProdIds(initial.prod_ids?.join(', ') || '');
    setSource(initial.tran_source || '');
    setCost(initial.tran_cost?.toString() || '');
    setDate(initial.tran_date?.slice(0, 10) || '');
    setNote(initial.tran_note || '');
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!source.trim()) return alert('Source is required');
    if (!cost || isNaN(Number(cost))) return alert('Valid cost is required');
    if (!date) return alert('Date is required');

    onSubmit({
      prod_ids: prodIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
      tran_source: source.trim(),
      tran_cost: Number(cost),
      tran_date: new Date(date).toISOString(),
      tran_note: note.trim(),
    });

    // Clear form
    setProdIds('');
    setSource('');
    setCost('');
    setDate('');
    setNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded '>
      <div>
        <label className='block text-sm font-medium'>
          Product IDs (comma separated)
        </label>
        <input
          type='text'
          value={prodIds}
          onChange={(e) => setProdIds(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Source</label>
        <input
          type='text'
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Cost</label>
        <input
          type='number'
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Date</label>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Note</label>
        <input
          type='text'
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
