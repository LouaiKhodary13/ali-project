import { NextRequest, NextResponse } from "next/server";
import { customers } from "@/app/database/services";
import { Customer } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = customers.getById(id);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function POST(request: NextRequest) {
  const data: Customer = await request.json();
  console.log("Received customer data:", data); // Debug log

  const result = customers.create(data);
  console.log("Database result:", result); // Debug log

  return NextResponse.json({ success: true, result });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data: Partial<Customer> = await request.json();
  const result = customers.update(id, data);
  return NextResponse.json({ success: true, result });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = customers.delete(id);
  return NextResponse.json({ success: true, result });
}
