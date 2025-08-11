import { NextRequest, NextResponse } from 'next/server';
import { customers } from '@/app/database/services';
import { Customer } from '@/app/types';

export async function GET() {
  try {
    const allCustomers = customers.getAll();
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Customer = await request.json();
    console.log('Received customer data:', data);
    
    const result = customers.create(data);
    console.log('Database result:', result);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer', details: error.message },
      { status: 500 }
    );
  }
}