import { NextResponse } from "next/server";

// This endpoint is used to check socket status
export async function GET() {
  return NextResponse.json({ status: "Socket.io is handled via polling fallback" });
}