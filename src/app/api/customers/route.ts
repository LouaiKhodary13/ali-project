import { NextRequest, NextResponse } from "next/server";
import { customers } from "@/app/database/services";
import { Customer } from "@/app/types";

export async function GET() {
  const allCustomers = customers.getAll();
  return NextResponse.json(allCustomers);
}

export async function POST(request: NextRequest) {
  const data: Customer = await request.json();
  console.log("Received customer data:", data);

  const result = customers.create(data);
  console.log("Database result:", result);

  return NextResponse.json({ success: true, result });
}
