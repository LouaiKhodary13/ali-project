import { NextRequest, NextResponse } from "next/server";
import { products } from "@/app/database/services";
import { Product } from "@/app/types";

export async function GET() {
  const allProducts = products.getAll();
  return NextResponse.json(allProducts);
}

export async function POST(request: NextRequest) {
  const data: Product = await request.json();
  console.log("Received product data:", data);

  const result = products.create(data);
  console.log("Database result:", result);

  return NextResponse.json({ success: true, result });
}
