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
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const lead = await Lead.findById(id).populate("assignedTo", "name email");

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    if (session.user.role === "agent" && lead.assignedTo?._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const activities = await ActivityLog.find({ leadId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ lead, activities }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update lead
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    if (body.budget) {
      body.score = calculateScore(Number(body.budget));
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, body, { new: true });

    await ActivityLog.create({
      leadId: id,
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
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    await Lead.findByIdAndDelete(id);
    await ActivityLog.deleteMany({ leadId: id });

    return NextResponse.json({ message: "Lead deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}