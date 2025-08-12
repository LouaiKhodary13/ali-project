import { Transaction } from '@/app/types';

const API_BASE = '/api/transactions';

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch transactions:', response.status, errorData);
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch transaction:', response.status, errorData);
      throw new Error(`Failed to fetch transaction: ${response.status}`);
    }
    return response.json();
  },

  async create(transaction: Transaction): Promise<void> {
    console.log('Sending transaction data:', transaction);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to create transaction:', response.status, errorData);
      throw new Error(`Failed to create transaction: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to update transaction:', response.status, errorData);
      throw new Error(`Failed to update transaction: ${response.status}`);
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to delete transaction:', response.status, errorData);
      throw new Error(`Failed to delete transaction: ${response.status}`);
    }
  },
};