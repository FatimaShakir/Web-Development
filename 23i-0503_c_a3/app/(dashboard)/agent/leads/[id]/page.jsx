"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getScoreBadgeColor, getStatusBadgeColor } from "@/lib/scoring";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AgentLeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data.lead);
        setActivities(data.activities || []);
        setLoading(false);
      });
  }, []);

  const handleWhatsApp = () => {
    const cleaned = lead.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;
  if (!lead) return <div className="text-gray-400 text-center py-20">Lead not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/agent/leads" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-start justify-between">
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
          <div className="pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-sm">Notes</p>
            <p className="text-gray-300 text-sm mt-1">{lead.notes}</p>
          </div>
        )}

        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </button>

        {/* Activity Timeline */}
        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-white font-semibold mb-3">Activity Timeline</h3>
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