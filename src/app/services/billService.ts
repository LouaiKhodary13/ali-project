import { Bill } from '@/app/types';

const API_BASE = '/api/bills';

export const billService = {
  async getAll(): Promise<Bill[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch bills:', response.status, errorData);
      throw new Error(`Failed to fetch bills: ${response.status}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Bill> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch bill:', response.status, errorData);
      throw new Error(`Failed to fetch bill: ${response.status}`);
    }
    return response.json();
  },

  async create(bill: Bill): Promise<void> {
    console.log('Sending bill data:', bill);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to create bill:', response.status, errorData);
      throw new Error(`Failed to create bill: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
  },

  async update(id: string, bill: Partial<Bill>): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to update bill:', response.status, errorData);
      throw new Error(`Failed to update bill: ${response.status}`);
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to delete bill:', response.status, errorData);
      throw new Error(`Failed to delete bill: ${response.status}`);
    }
  },
};