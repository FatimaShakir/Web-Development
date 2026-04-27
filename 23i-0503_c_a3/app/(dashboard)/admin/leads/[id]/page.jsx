"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getScoreBadgeColor, getStatusBadgeColor } from "@/lib/scoring";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchAgents();
  }, []);

  const fetchLead = async () => {
    const res = await fetch(`/api/leads/${id}`);
    const data = await res.json();
    setLead(data.lead);
    setActivities(data.activities || []);
    setLoading(false);
  };

  const fetchAgents = async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data.agents || []);
  };

  const handleAssign = async () => {
    if (!selectedAgent) return;
    setAssigning(true);
    await fetch(`/api/leads/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: selectedAgent }),
    });
    await fetchLead();
    setAssigning(false);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    await fetch(`/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchLead();
    setUpdatingStatus(false);
  };

  const handleWhatsApp = () => {
    const cleaned = lead.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;
  if (!lead) return <div className="text-gray-400 text-center py-20">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/admin/leads" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Lead Info */}
        <div className="col-span-2 space-y-4">
          {/* Lead Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{lead.name}</h2>
                <p className="text-gray-400 text-sm">{lead.email}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(lead.score)}`}>
                  {lead.score} Priority
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-white">{lead.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Budget</p>
                <p className="text-white">PKR {lead.budget?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Property Interest</p>
                <p className="text-white">{lead.propertyInterest}</p>
              </div>
              <div>
                <p className="text-gray-500">Source</p>
                <p className="text-white">{lead.source}</p>
              </div>
              <div>
                <p className="text-gray-500">Assigned To</p>
                <p className="text-white">{lead.assignedTo ? lead.assignedTo.name : "Unassigned"}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-white">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-sm">Notes</p>
                <p className="text-gray-300 text-sm mt-1">{lead.notes}</p>
              </div>
            )}

            <button
              onClick={handleWhatsApp}
              className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </button>
          </div>

          {/* Update Status */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-3">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              {["New", "Contacted", "In Progress", "Closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus || lead.status === s}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    lead.status === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4">Activity Timeline</h3>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.details}</p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        by {activity.performedByName} · {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right - Assign */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-3">Assign Lead</h3>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-3"
            >
              <option value="">Select Agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!selectedAgent || assigning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}