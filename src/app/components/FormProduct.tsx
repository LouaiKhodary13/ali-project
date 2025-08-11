import React, { useState, useEffect } from 'react';
import { Product } from '@/app/types';

type Props = {
  initial?: Partial<Omit<Product, 'prod_id'>>;
  onSubmit: (data: Omit<Product, 'prod_id'>) => void;
  onCancel?: () => void;
};

export const FormProduct: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initial.prod_name || '');
  const [quant, setQuant] = useState(initial.prod_quant?.toString() || '');
  const [price, setPrice] = useState(initial.prod_price?.toString() || '');
  const [note, setNote] = useState(initial.prod_note || '');

  useEffect(() => {
    setName(initial.prod_name || '');
    setQuant(initial.prod_quant?.toString() || '');
    setPrice(initial.prod_price?.toString() || '');
    setNote(initial.prod_note || '');
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert('Product name required');
    if (!quant || isNaN(Number(quant))) return alert('Valid quantity required');
    if (!price || isNaN(Number(price))) return alert('Valid price required');

    onSubmit({
      prod_name: name.trim(),
      prod_quant: Number(quant),
      prod_price: Number(price),
      prod_note: note.trim(),
    });

    // Clear form
    setName('');
    setQuant('');
    setPrice('');
    setNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded '>
      <div>
        <label className='block text-sm font-medium'>Product Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Quantity</label>
        <input
          type='number'
          value={quant}
          onChange={(e) => setQuant(e.target.value)}
          className='w-full p-2 border rounded'
          required
          min={0}
        />
      </div>
      <div>
        <label className='block text-sm font-medium'>Price</label>
        <input
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className='w-full p-2 border rounded'
          required
          min={0}
          step='0.01'
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
