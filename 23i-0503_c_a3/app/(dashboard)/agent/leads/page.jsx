"use client";

import { useState, useEffect } from "react";
import LeadTable from "@/components/leads/LeadTable";
import { Search } from "lucide-react";

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);

    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Leads</h2>
          <p className="text-gray-400 text-sm mt-1">{leads.length} assigned leads</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="bg-gray-900 border border-gray-800 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading leads...</div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onDelete={null}
          isAdmin={false}
          basePath="/agent"
        />
      )}
    </div>
  );
}