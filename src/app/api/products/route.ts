import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/app/database/services';
import { Product } from '@/app/types';

export async function GET() {
  try {
    const allProducts = products.getAll();
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Product = await request.json();
    console.log('Received product data:', data);
    
    const result = products.create(data);
    console.log('Database result:', result);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}