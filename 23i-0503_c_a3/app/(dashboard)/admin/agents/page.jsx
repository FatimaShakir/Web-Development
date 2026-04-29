"use client";

import { useState, useEffect } from "react";
import { UserCheck, Mail } from "lucide-react";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/agents").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
    ]).then(([agentsData, analyticsData]) => {
      setAgents(agentsData.agents || []);
      setPerformance(analyticsData.agentPerformance || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Agents</h2>
        <p className="text-gray-400 text-sm mt-1">{agents.length} registered agents</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {agents.map((agent) => {
          const perf = performance.find((p) => p.agentEmail === agent.email);
          return (
            <div key={agent._id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{agent.name}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Mail size={12} /> {agent.email}
                    </p>
                  </div>
                </div>
                {perf && (
                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{perf.totalLeads}</p>
                      <p className="text-gray-500 text-xs">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">{perf.closedLeads}</p>
                      <p className="text-gray-500 text-xs">Closed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-400">{perf.highPriority}</p>
                      <p className="text-gray-500 text-xs">High Priority</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">
                        {perf.totalLeads > 0
                          ? Math.round((perf.closedLeads / perf.totalLeads) * 100)
                          : 0}%
                      </p>
                      <p className="text-gray-500 text-xs">Close Rate</p>
                    </div>
                  </div>
                )}
                {!perf && (
                  <p className="text-gray-500 text-sm">No leads assigned yet</p>
                )}
              </div>
            </div>
          );
        })}
        {agents.length === 0 && (
          <div className="text-center py-20 text-gray-500">No agents registered yet</div>
        )}
      </div>
    </div>
  );
}