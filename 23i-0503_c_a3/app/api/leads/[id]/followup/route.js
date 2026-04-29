import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { followUpDate } = await request.json();
    if (!followUpDate) {
      return NextResponse.json({ error: "Follow-up date is required" }, { status: 400 });
    }

    await connectDB();

    const lead = await Lead.findByIdAndUpdate(
      id,
      { followUpDate: new Date(followUpDate) },
      { returnDocument: "after" }
    );

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    await ActivityLog.create({
      leadId: id,
      action: "Follow-up Scheduled",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}`,
    });

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}