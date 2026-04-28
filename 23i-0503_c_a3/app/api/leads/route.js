import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ActivityLog from "@/models/ActivityLog";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { calculateScore } from "@/lib/scoring";
import { sendNewLeadEmail } from "@/lib/email";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const score = searchParams.get("score");

    let query = {};

    if (session.user.role === "agent") {
      query.assignedTo = session.user.id;
    }

    if (status) query.status = status;
    if (score) query.score = score;

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, propertyInterest, budget, status, notes, source } = body;

    if (!name || !email || !phone || !propertyInterest || !budget) {
      return NextResponse.json(
        { error: "Name, email, phone, property interest, and budget are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const score = calculateScore(Number(budget));

    const lead = await Lead.create({
      name,
      email,
      phone,
      propertyInterest,
      budget: Number(budget),
      status: status || "New",
      notes: notes || "",
      source: source || "Other",
      score,
    });

    // Log activity
    await ActivityLog.create({
      leadId: lead._id,
      action: "Lead Created",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Lead created with ${score} priority`,
    });

    // Create notification for admins
    await Notification.create({
      title: "New Lead Created",
      message: `${lead.name} — ${score} Priority — PKR ${Number(budget).toLocaleString()}`,
      type: "lead_created",
      forRole: "admin",
    });

    // Send email to admin
    try {
      const admins = await User.find({ role: "admin" }).select("email");
      for (const admin of admins) {
        await sendNewLeadEmail(lead, admin.email);
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}