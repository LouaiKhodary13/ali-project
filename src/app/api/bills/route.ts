import { NextRequest, NextResponse } from "next/server";
import { bills } from "@/app/database/services";
import { Bill } from "@/app/types";

export async function GET() {
  const allBills = bills.getAll();
  return NextResponse.json(allBills);
}

export async function POST(request: NextRequest) {
  const data: Bill = await request.json();
  console.log("Received bill data:", data);

  const result = bills.create(data);
  console.log("Database result:", result);

  return NextResponse.json({ success: true, result });
}
