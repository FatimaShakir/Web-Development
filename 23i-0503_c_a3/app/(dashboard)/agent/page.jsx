"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getScoreBadgeColor, getStatusBadgeColor } from "@/lib/scoring";
import { AlertCircle, Clock, Users } from "lucide-react";

export default function AgentDashboard() {
  const [leads, setLeads] = useState([]);
  const [staleData, setStaleData] = useState({ overdueFollowUps: [], staleLeads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/leads").then((r) => r.json()),
      fetch("/api/leads/stale").then((r) => r.json()),
    ]).then(([leadsData, staleData]) => {
      setLeads(leadsData.leads || []);
      setStaleData(staleData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;

  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;
  const highPriority = leads.filter((l) => l.score === "High").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Agent Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Your assigned leads overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">My Leads</p>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Users size={18} /></div>
          </div>
          <p className="text-3xl font-bold text-white">{totalLeads}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Closed</p>
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400"><Clock size={18} /></div>
          </div>
          <p className="text-3xl font-bold text-white">{closedLeads}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">High Priority</p>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400"><AlertCircle size={18} /></div>
          </div>
          <p className="text-3xl font-bold text-white">{highPriority}</p>
        </div>
      </div>

      {/* Overdue Follow-ups */}
      {staleData.overdueFollowUps?.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
            <AlertCircle size={18} /> Overdue Follow-ups ({staleData.overdueFollowUps.length})
          </h3>
          <div className="space-y-2">
            {staleData.overdueFollowUps.map((lead) => (
              <Link
                key={lead._id}
                href={`/agent/leads/${lead._id}`}
                className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 hover:bg-gray-800 transition"
              >
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">
                    Follow-up was due: {new Date(lead.followUpDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadgeColor(lead.score)}`}>
                  {lead.score}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stale Leads */}
      {staleData.staleLeads?.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
          <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
            <Clock size={18} /> Stale Leads — No activity in 7 days ({staleData.staleLeads.length})
          </h3>
          <div className="space-y-2">
            {staleData.staleLeads.map((lead) => (
              <Link
                key={lead._id}
                href={`/agent/leads/${lead._id}`}
                className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 hover:bg-gray-800 transition"
              >
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">
                    Last updated: {new Date(lead.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(lead.status)}`}>
                  {lead.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Leads</h3>
          <Link href="/agent/leads" className="text-blue-400 text-sm hover:underline">
            View all
          </Link>
        </div>
        {leads.slice(0, 5).length === 0 ? (
          <p className="text-gray-500 text-sm">No leads assigned yet</p>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <Link
                key={lead._id}
                href={`/agent/leads/${lead._id}`}
                className="flex items-center justify-between hover:bg-gray-800 rounded-lg px-3 py-2 transition"
              >
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">{lead.propertyInterest} — PKR {lead.budget?.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getScoreBadgeColor(lead.score)}`}>
                    {lead.score}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}