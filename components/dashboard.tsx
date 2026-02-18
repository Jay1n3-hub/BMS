"use client";

import { useEffect, useState } from "react";

type Blocker = {
  id: number;
  text: string;
  team: string;
  sprint: string;
  urgency: string;
  category: string;
  status: string;
  jiraKey?: string;
  followUpAt?: string;
};

const statuses = ["", "OPEN", "IN_PROGRESS", "RESOLVED"];

export function Dashboard({ refreshToken }: { refreshToken: number }) {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [filters, setFilters] = useState({ status: "", category: "", sprint: "" });

  const fetchBlockers = async () => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/blockers?${query}`);
    const data = await response.json();
    setBlockers(data.blockers || []);
  };

  useEffect(() => {
    fetchBlockers();
  }, [refreshToken]);

  const patchBlocker = async (id: number, payload: Record<string, string>) => {
    await fetch(`/api/blockers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchBlockers();
  };

  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="grid grid-cols-3 gap-2">
        <select className="rounded border p-2" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status || "All statuses"}
            </option>
          ))}
        </select>
        <input className="rounded border p-2" placeholder="Category" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Sprint" value={filters.sprint} onChange={(e) => setFilters((f) => ({ ...f, sprint: e.target.value }))} />
      </div>
      <button onClick={fetchBlockers} className="rounded border px-3 py-1 text-sm">
        Apply filters
      </button>

      <div className="space-y-2">
        {blockers.map((blocker) => (
          <div key={blocker.id} className="rounded border p-3">
            <p className="font-medium">#{blocker.id} {blocker.text}</p>
            <p className="text-sm text-slate-600">{blocker.team} · {blocker.sprint} · {blocker.category} · {blocker.status} · Jira: {blocker.jiraKey || "n/a"}</p>
            <div className="mt-2 flex gap-2">
              <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white" onClick={() => patchBlocker(blocker.id, { status: "IN_PROGRESS" })}>In Progress</button>
              <button className="rounded bg-green-700 px-2 py-1 text-xs text-white" onClick={() => patchBlocker(blocker.id, { status: "RESOLVED" })}>Resolve</button>
              <button
                className="rounded bg-slate-700 px-2 py-1 text-xs text-white"
                onClick={() => {
                  const comment = prompt("Comment to add (also synced to Jira when configured)");
                  if (comment) patchBlocker(blocker.id, { comment });
                }}
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
        {blockers.length === 0 && <p className="text-sm text-slate-500">No blockers found.</p>}
      </div>
    </div>
  );
}
