import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let query = { status: { $ne: "Closed" } };
    if (session.user.role === "agent") {
      query.assignedTo = session.user.id;
    }

    // Overdue follow-ups
    const overdueFollowUps = await Lead.find({
      ...query,
      followUpDate: { $lt: now, $ne: null },
    }).populate("assignedTo", "name");

    // No activity for 7 days
    const staleLeads = await Lead.find({
      ...query,
      updatedAt: { $lt: sevenDaysAgo },
      followUpDate: null,
    }).populate("assignedTo", "name");

    return NextResponse.json({ overdueFollowUps, staleLeads }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}