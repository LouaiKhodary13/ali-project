import { NextRequest, NextResponse } from "next/server";
import { bills } from "@/app/database/services";
import { Bill } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bill = bills.getById(id);
  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }
  return NextResponse.json(bill);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data: Partial<Bill> = await request.json();
  const result = bills.update(id, data);
  return NextResponse.json({ success: true, result });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = bills.delete(id);
  return NextResponse.json({ success: true, result });
}
