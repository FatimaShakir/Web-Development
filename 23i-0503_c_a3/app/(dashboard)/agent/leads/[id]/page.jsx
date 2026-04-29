"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getScoreBadgeColor, getStatusBadgeColor } from "@/lib/scoring";
import { MessageCircle, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function AgentLeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpDate, setFollowUpDate] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data.lead);
        setActivities(data.activities || []);
        if (data.lead?.followUpDate) {
          setFollowUpDate(data.lead.followUpDate.split("T")[0]);
        }
        setLoading(false);
      });
  }, []);

  const handleWhatsApp = () => {
    let cleaned = lead.phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) cleaned = "92" + cleaned.slice(1);
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  const handleFollowUp = async () => {
    if (!followUpDate) return;
    setSavingFollowUp(true);
    await fetch(`/api/leads/${id}/followup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpDate }),
    });
    const res = await fetch(`/api/leads/${id}`);
    const data = await res.json();
    setLead(data.lead);
    setActivities(data.activities || []);
    setSavingFollowUp(false);
  };

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;
  if (!lead) return <div className="text-gray-400 text-center py-20">Lead not found</div>;

  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/agent/leads" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="space-y-4">
        {/* Lead Info */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <p className="text-gray-400 text-sm">{lead.email}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(lead.score)}`}>
                {lead.score}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Phone</p><p className="text-white">{lead.phone}</p></div>
            <div><p className="text-gray-500">Budget</p><p className="text-white">PKR {lead.budget?.toLocaleString()}</p></div>
            <div><p className="text-gray-500">Property</p><p className="text-white">{lead.propertyInterest}</p></div>
            <div><p className="text-gray-500">Source</p><p className="text-white">{lead.source}</p></div>
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
            <MessageCircle size={16} /> Chat on WhatsApp
          </button>
        </div>

        {/* Follow-up */}
        <div className={`rounded-xl p-6 border ${isOverdue ? "bg-red-500/10 border-red-500/30" : "bg-gray-900 border-gray-800"}`}>
          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isOverdue ? "text-red-400" : "text-white"}`}>
            <Calendar size={16} />
            {isOverdue ? "⚠ Overdue Follow-up" : "Schedule Follow-up"}
          </h3>
          {lead.followUpDate && (
            <p className={`text-sm mb-3 ${isOverdue ? "text-red-400" : "text-gray-400"}`}>
              Current: {new Date(lead.followUpDate).toLocaleDateString()}
              {isOverdue && " (Overdue!)"}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleFollowUp}
              disabled={!followUpDate || savingFollowUp}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              {savingFollowUp ? "Saving..." : "Save"}
            </button>
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
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}