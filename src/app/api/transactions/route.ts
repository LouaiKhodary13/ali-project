import { NextRequest, NextResponse } from "next/server";
import { transactions } from "@/app/database/services";
import { Transaction } from "@/app/types";

export async function GET() {
  const allTransactions = transactions.getAll();
  return NextResponse.json(allTransactions);
}

export async function POST(request: NextRequest) {
  const data: Transaction = await request.json();
  console.log("Received transaction data:", data);

  const result = transactions.create(data);
  console.log("Database result:", result);

  return NextResponse.json({ success: true, result });
}
