"use client";

export function WeeklyReportActions() {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Weekly Reports</h2>
      <p className="mb-3 text-sm text-slate-600">Download server-generated summaries for your weekly Scrum review.</p>
      <div className="flex gap-2">
        <a className="rounded bg-slate-900 px-3 py-2 text-sm text-white" href="/api/reports/weekly?format=pdf">
          Export PDF
        </a>
        <a className="rounded border px-3 py-2 text-sm" href="/api/reports/weekly?format=csv">
          Export CSV
        </a>
      </div>
    </div>
  );
}
