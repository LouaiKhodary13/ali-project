import { NextRequest, NextResponse } from 'next/server';
import { transactions } from '@/app/database/services';
import { Transaction } from '@/app/types';

export async function GET() {
  try {
    const allTransactions = transactions.getAll();
    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Transaction = await request.json();
    console.log('Received transaction data:', data);
    
    const result = transactions.create(data);
    console.log('Database result:', result);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error.message },
      { status: 500 }
    );
  }
}