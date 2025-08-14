// /components/FormCustomer.tsx
import React, { useState, useEffect } from 'react';
import { ar } from '../lang/ar';
import { Customer } from '../types';

type Props = {
  initial?: Partial<Customer>;
  onSubmit: (data: Omit<Customer, 'cust_id'>) => void;
  onCancel?: () => void;
};

export const FormCustomer: React.FC<Props> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initial.cust_name || '');
  const [adr, setAdr] = useState(initial.cust_adr || '');
  const [phone, setPhone] = useState(initial.cust_phone?.toString() || '');
  const [note, setNote] = useState(initial.cust_note || '');

  useEffect(() => {
    setName(initial.cust_name || '');
    setAdr(initial.cust_adr || '');
    setPhone(initial.cust_phone?.toString() || '');
    setNote(initial.cust_note || '');
  }, [initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert('Name required');
    onSubmit({
      cust_name: name,
      cust_adr: adr,
      cust_phone: phone,
      cust_note: note,
    });
    // clear form
    setName('');
    setAdr('');
    setPhone('');
    setNote('');
  }

  return (
    <form onSubmit={submit} className='space-y-2 p-4 border rounded'>
      <div>
        <label className='block font-bold text-sm mb-4'>
          {ar.buttons.Add_Customer}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div>
        <label className='block font-bold  text-sm mb-4'>
          {ar.strings.Address}
        </label>
        <input
          value={adr}
          onChange={(e) => setAdr(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div>
        <label className='block font-bold  text-sm mb-4'>
          {ar.strings.Phone}
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div>
        <label className='block font-bold  text-sm mb-4'>
          {ar.strings.Note}
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <div className='flex gap-2  font-bold '>
        <button className='px-3 py-1 bg-blue-600 text-white rounded'>
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
