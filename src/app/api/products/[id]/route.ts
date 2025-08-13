import { NextRequest, NextResponse } from "next/server";
import { products } from "@/app/database/services";
import { Product } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = products.getById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data: Partial<Product> = await request.json();
  const result = products.update(id, data);
  return NextResponse.json({ success: true, result });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = products.delete(id);
  return NextResponse.json({ success: true, result });
}
