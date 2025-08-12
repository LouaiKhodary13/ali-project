import { Customer } from '@/app/types';

const API_BASE = '/api/customers';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch customers:', response.status, errorData);
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Customer> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch customer:', response.status, errorData);
      throw new Error(`Failed to fetch customer: ${response.status}`);
    }
    return response.json();
  },

  async create(customer: Customer): Promise<void> {
    console.log('Sending customer data:', customer); // Debug log
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to create customer:', response.status, errorData);
      throw new Error(`Failed to create customer: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
  },

  async update(id: string, customer: Partial<Customer>): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to update customer:', response.status, errorData);
      throw new Error(`Failed to update customer: ${response.status}`);
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to delete customer:', response.status, errorData);
      throw new Error(`Failed to delete customer: ${response.status}`);
    }
  },
};