"use client";

import { useState } from "react";
import { BlockerForm } from "@/components/blocker-form";
import { Dashboard } from "@/components/dashboard";
import { WeeklyReportActions } from "@/components/weekly-report";

export default function HomePage() {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-4 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">BlockerPilot MVP</h1>
        <p className="text-sm text-slate-600">Capture blockers, classify with Codex, sync to Jira, and generate weekly reports.</p>
        <BlockerForm onCreated={async () => setRefreshToken((v) => v + 1)} />
        <WeeklyReportActions />
      </div>
      <Dashboard refreshToken={refreshToken} />
    </main>
  );
}
