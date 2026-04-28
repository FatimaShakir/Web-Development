import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendLeadAssignedEmail } from "@/lib/email";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
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
      id,
      { assignedTo: agentId },
      { returnDocument: "after" }
    ).populate("assignedTo", "name email");

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // Log activity
    await ActivityLog.create({
      leadId: id,
      action: "Lead Assigned",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Lead assigned to ${lead.assignedTo.name}`,
    });

    // Create notification for the assigned agent
    await Notification.create({
      title: "New Lead Assigned",
      message: `You have been assigned lead: ${lead.name}`,
      type: "lead_assigned",
      forUser: agentId,
    });

    // Send email to agent
    try {
      const agent = await User.findById(agentId).select("email name");
      if (agent) {
        await sendLeadAssignedEmail(lead, agent.email, agent.name);
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error) {
    console.error("Assign error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}