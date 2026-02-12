export function ProjectDetailPage() {
  return (
    <div>
      <div className="space-between"><h1>Project: KasiHub</h1><button className="btn primary">Generate Health Report</button></div>
      <p>Status: <strong>AT RISK</strong> • Timeline: Target 2026-03-15 • Confidence: Medium</p>
      <p>Progress: 34/50 • Blockers: 3 (External 2) • Est Delay: +3 days</p>
      <div className="tabs">Backlog | Sprints | Board | Blockers | Timeline | Settings</div>
      <section className="card">
        <h3>Sprint 3 • Day 6/10 • Sprint Goal: “Checkout + Feed”</h3>
        <div className="kanban">
          {['To Do', 'In Progress', 'Blocked', 'Done'].map((col) => (
            <div key={col} className="kanban-col"><h4>{col}</h4><div className="task-card">Implement Order Tracking<br/>SP: 5 • Assignee: Dev A</div></div>
          ))}
        </div>
      </section>
    </div>
  );
}
