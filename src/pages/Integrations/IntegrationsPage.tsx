export function IntegrationsPage() {
  return (
    <div>
      <h1>Integrations</h1>
      <div className="card">
        <h3>Jira: Connected ✔</h3>
        <p>Site: example.atlassian.net</p>
        <p>Sync: Import Projects, Sprints, Issues</p>
        <p>Writeback: Post Blocker comments</p>
        <div className="row"><button className="btn">Manage</button><button className="btn">Disconnect</button><button className="btn primary">Run Sync Now</button></div>
      </div>
      <div className="card"><h3>Trello: Not connected</h3><button className="btn">Connect</button></div>
    </div>
  );
}
