export function AtRiskTasksTable() {
  return (
    <section className="card">
      <h3>At-Risk Tasks</h3>
      <table className="table">
        <thead><tr><th>Task</th><th>Project</th><th>Sprint</th><th>Status</th><th>Days Stuck</th><th>Risk</th><th>Suggested Next Action</th></tr></thead>
        <tbody>
          <tr><td>Implement Order Tracking</td><td>KasiHub</td><td>S3</td><td>Blocked</td><td>4</td><td>High</td><td>Escalate vendor API key delay</td></tr>
        </tbody>
      </table>
    </section>
  );
}
