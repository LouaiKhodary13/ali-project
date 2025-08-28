'use client';
import { Product, Transaction, BillProduct } from '@/app/types';
import { useState, useEffect } from 'react';
import { ar } from '../lang/ar';

interface FormTransactionProps {
  products: Product[];
  initial: Partial<Transaction>;
  isEditing?: boolean;
  onSubmit: (data: Omit<Transaction, 'tran_id'>) => void;
  onCancel: () => void;
}

export function FormTransaction({
  products,
  initial,
  isEditing = false,
  onSubmit,
  onCancel,
}: FormTransactionProps) {
  const [source, setSource] = useState(initial.tran_source || '');
  const [date, setDate] = useState(
    initial.tran_date || new Date().toISOString().split('T')[0]
  );
  const [selectedProducts, setSelectedProducts] = useState<BillProduct[]>(
    initial.prod_items || []
  );

  // Calculate cost automatically from products
  const cost = selectedProducts.reduce(
    (total, item) => total + item.quantity * item.unit_price,
    0
  );

  function toDateInputValue(date?: string | Date) {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }
    return '';
  }

  useEffect(() => {
    setSource(initial.tran_source || '');
    setDate(toDateInputValue(initial.tran_date));
    setSelectedProducts(initial.prod_items || []);
  }, [initial]);

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.prod_id === productId);
    if (!product) return;

    const existingItem = selectedProducts.find(
      (item) => item.prod_id === productId
    );
    if (existingItem) {
      // Increase quantity if product already exists
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new product
      setSelectedProducts([
        ...selectedProducts,
        {
          prod_id: productId,
          quantity: 1,
          unit_price: product.prod_price,
        },
      ]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(
        selectedProducts.filter((item) => item.prod_id !== productId)
      );
    } else {
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.prod_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateProductPrice = (productId: string, price: number) => {
    setSelectedProducts(
      selectedProducts.map((item) =>
        item.prod_id === productId ? { ...item, unit_price: price } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!source.trim()) return alert('Source is required');
    if (selectedProducts.length === 0)
      return alert('At least one product required');
    if (cost <= 0) return alert('Cost must be greater than 0');
    if (!date) return alert('Date is required');

    // Validate all products have valid data
    for (const item of selectedProducts) {
      if (!item.prod_id) return alert('All products must be selected');
      if (item.quantity <= 0)
        return alert('All quantities must be greater than 0');
      if (item.unit_price < 0) return alert('Unit prices cannot be negative');
    }

    onSubmit({
      tran_source: source,
      tran_cost: cost, // This is now automatically calculated
      tran_date: new Date(date).toISOString(),
      prod_items: selectedProducts,
    });

    // Clear form if not editing
    if (!isEditing) {
      setSource('');
      setDate('');
      setSelectedProducts([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4 border rounded'>
      <div>
        <label className='block text-sm font-bold mb-2'>
          {ar.transaction.Source}
        </label>
        <input
          type='text'
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className='w-full p-2 border rounded'
          placeholder={ar.transaction.Source}
          required
        />
      </div>

      <div>
        <label className='block text-sm font-bold mb-2'>
          {ar.strings.Products}
        </label>
        <div className='border rounded p-2'>
          <div className='mb-2'>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addProduct(e.target.value);
                  e.target.value = '';
                }
              }}
              className='w-full p-2 border rounded'>
              <option value=''>اختر منتج لإضافته</option>
              {products.map((p) => (
                <option
                  key={p.prod_id}
                  value={p.prod_id}
                  className=' flex flex-col'>
                  {p.prod_name} - {p.prod_price} (متاح: {p.prod_quant})
                </option>
              ))}
            </select>
          </div>

          {selectedProducts.length > 0 && (
            <div className='border-t pt-2 w-full max-h-96 overflow-y-auto'>
              <h4 className='font-bold mb-2'>المنتجات المحددة:</h4>
              {selectedProducts.map((item) => {
                const product = products.find(
                  (p) => p.prod_id === item.prod_id
                );
                return (
                  <div
                    key={item.prod_id}
                    className='flex flex-col sm:flex-row sm:items-center sm:gap-4 p-2 bg-gray-50 rounded border border-gray-200 w-full mb-2'>
                    {/* Product Name */}
                    <span className='flex-1 min-w-[120px]'>
                      {product?.prod_name || 'منتج محذوف'}
                      <span className='text-sm text-white ml-2'>
                        (متاح: {product?.prod_quant || 0})
                      </span>
                    </span>

                    {/* Quantity */}
                    <div className='flex items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0'>
                      <input
                        type='number'
                        value={item.quantity}
                        onChange={(e) =>
                          updateProductQuantity(
                            item.prod_id,
                            Number(e.target.value)
                          )
                        }
                        className='p-1 border rounded w-full sm:w-20'
                        min='1'
                        placeholder='الكمية'
                      />
                      <span className='text-sm text-white'>الكمية</span>
                    </div>

                    {/* Unit Price */}
                    <div className='flex items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0'>
                      <input
                        type='number'
                        value={item.unit_price}
                        onChange={(e) =>
                          updateProductPrice(
                            item.prod_id,
                            Number(e.target.value)
                          )
                        }
                        className='p-1 border rounded w-full sm:w-24'
                        min='0'
                        step='0.01'
                        placeholder='السعر'
                      />
                      <span className='text-sm text-white'>السعر</span>
                    </div>
                    <div className='flex items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0'>
                      <span className='text-sm text-white'>الكلفة</span>
                      <span className='w-full sm:w-20 text-right flex-shrink-0 mt-2 sm:mt-0'>
                        {(item.quantity * item.unit_price).toFixed(2)}
                      </span>
                    </div>
                    {/* Total */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className='block text-sm font-bold mb-2'>
          {ar.transaction.Cost}
        </label>
        <div className='w-full p-2 border rounded bg-gray-100'>
          {cost.toFixed(2)}
        </div>
      </div>

      <div>
        <label className='block text-sm font-bold mb-2'>
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
}
