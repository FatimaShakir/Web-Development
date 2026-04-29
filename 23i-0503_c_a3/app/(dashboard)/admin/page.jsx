"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, TrendingUp, AlertCircle, UserCheck } from "lucide-react";

const STATUS_COLORS = {
  New: "#3b82f6",
  Contacted: "#a855f7",
  "In Progress": "#eab308",
  Closed: "#22c55e",
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#eab308",
  Low: "#22c55e",
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  const statusData = analytics.leadsByStatus.map((s) => ({
    name: s._id,
    value: s.count,
    color: STATUS_COLORS[s._id] || "#6b7280",
  }));

  const priorityData = analytics.leadsByPriority.map((p) => ({
    name: p._id,
    value: p.count,
    color: PRIORITY_COLORS[p._id] || "#6b7280",
  }));

  const timeData = analytics.leadsOverTime.map((d) => ({
    date: d._id.slice(5),
    leads: d.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Overview of your CRM system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={analytics.totalLeads}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Total Agents"
          value={analytics.totalAgents}
          icon={<UserCheck size={20} />}
          color="purple"
        />
        <StatCard
          title="Unassigned Leads"
          value={analytics.unassignedLeads}
          icon={<AlertCircle size={20} />}
          color="yellow"
        />
        <StatCard
          title="Closed Leads"
          value={analytics.leadsByStatus.find((s) => s._id === "Closed")?.count || 0}
          icon={<TrendingUp size={20} />}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Leads by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads Over Time */}
      {timeData.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Leads Created (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Agent Performance */}
      {analytics.agentPerformance.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Agent</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Leads</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Closed</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">High Priority</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Close Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.agentPerformance.map((agent) => (
                  <tr key={agent._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{agent.agentName}</p>
                      <p className="text-gray-500 text-xs">{agent.agentEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{agent.totalLeads}</td>
                    <td className="py-3 px-4 text-green-400">{agent.closedLeads}</td>
                    <td className="py-3 px-4 text-red-400">{agent.highPriority}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${agent.totalLeads > 0
                                ? Math.round((agent.closedLeads / agent.totalLeads) * 100)
                                : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-400 text-xs">
                          {agent.totalLeads > 0
                            ? Math.round((agent.closedLeads / agent.totalLeads) * 100)
                            : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    green: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}