"use client";

import { getScoreBadgeColor, getStatusBadgeColor } from "@/lib/scoring";
import { MessageCircle, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default function LeadTable({ leads, onDelete, isAdmin, basePath }) {
  const formatBudget = (budget) => {
    if (budget >= 10000000) return `${(budget / 10000000).toFixed(1)} Cr`;
    if (budget >= 100000) return `${(budget / 100000).toFixed(1)} Lac`;
    return budget.toLocaleString();
  };

  const handleWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-800">
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Property</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Budget</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Priority</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
            {isAdmin && <th className="text-left px-4 py-3 text-gray-400 font-medium">Agent</th>}
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-gray-500">
                No leads found
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id} className="border-b border-gray-800 hover:bg-gray-900/50 transition">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{lead.name}</p>
                    <p className="text-gray-500 text-xs">{lead.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{lead.propertyInterest}</td>
                <td className="px-4 py-3 text-gray-300">{formatBudget(lead.budget)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {lead.assignedTo ? lead.assignedTo.name : "Unassigned"}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWhatsApp(lead.phone)}
                      className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>
                    <Link
                      href={`${basePath}/leads/${lead._id}`}
                      className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                      title="View"
                    >
                      <Eye size={14} />
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}