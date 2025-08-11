import { NextRequest, NextResponse } from 'next/server';
import { bills } from '@/app/database/services';
import { Bill } from '@/app/types';

export async function GET() {
  try {
    const allBills = bills.getAll();
    return NextResponse.json(allBills);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Bill = await request.json();
    console.log('Received bill data:', data);
    
    const result = bills.create(data);
    console.log('Database result:', result);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create bill', details: error.message },
      { status: 500 }
    );
  }
}