import { Product } from '@/app/types';

const API_BASE = '/api/products';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch products:', response.status, errorData);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch product:', response.status, errorData);
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return response.json();
  },

  async create(product: Product): Promise<void> {
    console.log('Sending product data:', product);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to create product:', response.status, errorData);
      throw new Error(`Failed to create product: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
  },

  async update(id: string, product: Partial<Product>): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to update product:', response.status, errorData);
      throw new Error(`Failed to update product: ${response.status}`);
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to delete product:', response.status, errorData);
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  },
};