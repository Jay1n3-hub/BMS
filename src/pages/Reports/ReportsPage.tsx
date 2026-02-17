export function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      <div className="card">
        <p>Report Type: Daily / Weekly / Sprint Health / Project Health</p>
        <p>Project: All Projects • Date Range: Last 7 days</p>
        <div className="row"><button className="btn primary">Generate</button><button className="btn">Download PDF</button><button className="btn">Download CSV</button><button className="btn">Share Link</button></div>
      </div>
      <div className="card"><h3>Report Preview</h3><ul><li>Summary KPIs</li><li>Top blockers by category</li><li>Projects at risk + why</li><li>ETA impact estimate</li></ul></div>
    </div>
  );
}
