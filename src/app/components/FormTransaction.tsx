import React, { useState, useEffect } from 'react';
import { ar } from '../lang/ar';
import { Transaction, Product } from '@/app/types';

type Props = {
  initial?: Partial<Omit<Transaction, 'tran_id'>>;
  onSubmit: (data: Omit<Transaction, 'tran_id'>) => void;
  onCancel?: () => void;
  products: Product[];
};

export const FormTransaction: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
  products,
}) => {
  const [prodIds, setProdIds] = useState<string[]>(initial.prod_ids || []);
  const [source, setSource] = useState(initial.tran_source || '');
  const [cost, setCost] = useState(initial.tran_cost?.toString() || '');
  const [date, setDate] = useState(initial.tran_date?.slice(0, 10) || '');
  const [note, setNote] = useState(initial.tran_note || '');

  useEffect(() => {
    setProdIds(initial.prod_ids || []);
    setSource(initial.tran_source || '');
    setCost(initial.tran_cost?.toString() || '');
    setDate(initial.tran_date?.slice(0, 10) || '');
    setNote(initial.tran_note || '');
  }, [initial]);

  const toggleProduct = (id: string) => {
    setProdIds((current) =>
      current.includes(id)
        ? current.filter((pid) => pid !== id)
        : [...current, id]
    );
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!source.trim()) return alert('Source is required');
    if (!cost || isNaN(Number(cost))) return alert('Valid cost is required');
    if (!date) return alert('Date is required');
    if (prodIds.length === 0) return alert('يرجى اختيار منتج واحد على الأقل');

    onSubmit({
      prod_ids: prodIds,
      tran_source: source.trim(),
      tran_cost: Number(cost),
      tran_date: new Date(date).toISOString(),
      tran_note: note.trim(),
    });

    // Clear form
    setProdIds([]);
    setSource('');
    setCost('');
    setDate('');
    setNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded'>
      <div>
        <label className='block text-sm font-bold mb-4'>
          {ar.strings.Products}
        </label>
        <div className='border rounded p-2 max-h-48 overflow-y-auto'>
          {products.map((p) => (
            <label key={p.prod_id} className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={prodIds.includes(p.prod_id)}
                onChange={() => toggleProduct(p.prod_id)}
              />
              {p.prod_name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-sm font-bold mb-4'>
          {ar.transaction.Source}
        </label>
        <input
          type='text'
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-bold mb-4'>
          {ar.transaction.Cost}
        </label>
        <input
          type='number'
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-bold mb-4'>
          {ar.strings.Date}
        </label>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-bold mb-4'>
          {ar.strings.Note}
        </label>
        <input
          type='text'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div className='flex gap-2 font-bold'>
        <button
          type='submit'
          className='px-3 py-1 bg-blue-600 text-white rounded'>
          {ar.buttons.Save}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='px-3 py-1 border rounded'>
          {ar.buttons.Cancel}
        </button>
      </div>
    </form>
  );
};
