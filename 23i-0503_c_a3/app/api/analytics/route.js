import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Total leads
    const totalLeads = await Lead.countDocuments();

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Leads by priority
    const leadsByPriority = await Lead.aggregate([
      { $group: { _id: "$score", count: { $sum: 1 } } },
    ]);

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    // Agent performance
    const agentPerformance = await Lead.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          totalLeads: { $sum: 1 },
          closedLeads: {
            $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$score", "High"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: "$agent" },
      {
        $project: {
          agentName: "$agent.name",
          agentEmail: "$agent.email",
          totalLeads: 1,
          closedLeads: 1,
          highPriority: 1,
        },
      },
    ]);

    // Leads created over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const leadsOverTime = await Lead.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Total agents
    const totalAgents = await User.countDocuments({ role: "agent" });

    // Unassigned leads
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });

    return NextResponse.json({
      totalLeads,
      totalAgents,
      unassignedLeads,
      leadsByStatus,
      leadsByPriority,
      leadsBySource,
      agentPerformance,
      leadsOverTime,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}