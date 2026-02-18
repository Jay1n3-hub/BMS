"use client";

import { FormEvent, useState } from "react";

type Props = {
  onCreated: () => Promise<void>;
};

export function BlockerForm({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/blockers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setResult(data.error || "Failed to create blocker");
      setLoading(false);
      return;
    }

    setResult(
      `Category: ${data.classification.category} (${Math.round(data.classification.confidence * 100)}%). Jira: ${data.blocker.jiraKey || "Not synced"}`
    );
    event.currentTarget.reset();
    setLoading(false);
    await onCreated();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Submit Blocker</h2>
      <textarea name="text" required className="w-full rounded border p-2" rows={4} placeholder="Describe blocker..." />
      <div className="grid grid-cols-3 gap-2">
        <input name="team" required placeholder="Team" className="rounded border p-2" />
        <input name="sprint" required placeholder="Sprint" className="rounded border p-2" />
        <select name="urgency" className="rounded border p-2" defaultValue="Medium">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>
      <button disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
        {loading ? "Submitting..." : "Submit"}
      </button>
      {result && <p className="text-sm text-slate-700">{result}</p>}
    </form>
  );
}
