export function BlockersPage() {
  return (
    <div>
      <div className="space-between"><h1>Blockers</h1><div className="row"><button className="btn primary">+ New Blocker</button><button className="btn">Export CSV</button></div></div>
      <p>Filters: Project ▾ Category ▾ Severity ▾ External Age Status</p>
      <table className="table card">
        <thead><tr><th>Blocker</th><th>Project</th><th>Task</th><th>Category</th><th>Sev</th><th>Age</th><th>Risk(+days)</th><th>Owner</th><th>Actions</th></tr></thead>
        <tbody><tr><td>Waiting payment API keys</td><td>KasiHub</td><td>Order Tracking</td><td>External</td><td>High</td><td>4d</td><td>+2</td><td>Vendor/Team X</td><td>Open Resolve Follow-up Escalate</td></tr></tbody>
      </table>
    </div>
  );
}
