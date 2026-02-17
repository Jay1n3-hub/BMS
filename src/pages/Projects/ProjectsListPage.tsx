import { Link } from 'react-router-dom';

export function ProjectsListPage() {
  return (
    <div>
      <div className="space-between"><h1>Projects</h1><div className="row"><button className="btn primary">+ New Project</button><button className="btn">Import ▾</button></div></div>
      <p>Filters: Status ▾ Tool ▾ Owner ▾</p>
      <table className="table card">
        <thead><tr><th>Name</th><th>Status</th><th>Progress</th><th>Sprint</th><th>Blockers</th><th>Risk</th><th>Last Updated</th><th>Actions</th></tr></thead>
        <tbody>
          <tr><td>KasiHub</td><td>At Risk</td><td>34/50</td><td>S3</td><td>3</td><td>High</td><td>Today</td><td><Link to="/projects/kasihub">Open</Link> | Report</td></tr>
        </tbody>
      </table>
    </div>
  );
}
