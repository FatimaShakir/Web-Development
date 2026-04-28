"use client";

import { useState, useEffect, useCallback } from "react";

export function useLeads(filters = {}) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.score) params.append("score", filters.score);

    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }, [filters.status, filters.score]);

  useEffect(() => {
    fetchLeads();

    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchLeads, 10000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  return { leads, loading, refetch: fetchLeads };
}