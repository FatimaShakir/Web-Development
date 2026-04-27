import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";
import { calculateScore } from "@/lib/scoring";

// GET single lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const lead = await Lead.findById(params.id).populate("assignedTo", "name email");

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // Agent can only view their assigned lead
    if (session.user.role === "agent" && lead.assignedTo?._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const activities = await ActivityLog.find({ leadId: params.id }).sort({ createdAt: -1 });

    return NextResponse.json({ lead, activities }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update lead
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    const existingLead = await Lead.findById(params.id);
    if (!existingLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // Recalculate score if budget changed
    if (body.budget) {
      body.score = calculateScore(Number(body.budget));
    }

    const updatedLead = await Lead.findByIdAndUpdate(params.id, body, { new: true });

    // Log activity
    await ActivityLog.create({
      leadId: params.id,
      action: "Lead Updated",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Lead details updated`,
    });

    return NextResponse.json({ lead: updatedLead }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE lead
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    await Lead.findByIdAndDelete(params.id);
    await ActivityLog.deleteMany({ leadId: params.id });

    return NextResponse.json({ message: "Lead deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}