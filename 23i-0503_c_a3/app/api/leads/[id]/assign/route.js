import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { agentId } = await request.json();
    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    await connectDB();

    const lead = await Lead.findByIdAndUpdate(
      params.id,
      { assignedTo: agentId },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    await ActivityLog.create({
      leadId: params.id,
      action: "Lead Assigned",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Lead assigned to ${lead.assignedTo.name}`,
    });

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}