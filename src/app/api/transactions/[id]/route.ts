import { NextRequest, NextResponse } from "next/server";
import { transactions } from "@/app/database/services";
import { Transaction } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transaction = transactions.getById(id);
  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(transaction);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data: Partial<Transaction> = await request.json();
  const result = transactions.update(id, data);
  return NextResponse.json({ success: true, result });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = transactions.delete(id);
  return NextResponse.json({ success: true, result });
}
