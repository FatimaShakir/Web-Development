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
import { validateLeadData } from "@/middleware/validationMiddleware";
import { rateLimit } from "@/middleware/rateLimitMiddleware";

// GET all leads
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

// POST create lead
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const limitResult = rateLimit(session.user.id, session.user.role);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: limitResult.message, retryAfter: limitResult.retryAfter },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation
    const errors = validateLeadData(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const { name, email, phone, propertyInterest, budget, status, notes, source } = body;

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

    await ActivityLog.create({
      leadId: lead._id,
      action: "Lead Created",
      performedBy: session.user.id,
      performedByName: session.user.name,
      details: `Lead created with ${score} priority`,
    });

    await Notification.create({
      title: "New Lead Created",
      message: `${lead.name} — ${score} Priority — PKR ${Number(budget).toLocaleString()}`,
      type: "lead_created",
      forRole: "admin",
    });

    try {
      const admins = await User.find({ role: "admin" }).select("email");
      for (const admin of admins) {
        await sendNewLeadEmail(lead, admin.email);
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}