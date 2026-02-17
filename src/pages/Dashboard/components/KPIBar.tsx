const kpis = ['Projects: 6', 'On Track: 3', 'At Risk: 2', 'Off Track: 1', 'Active Blockers: 9'];

export function KPIBar() {
  return (
    <section className="kpi-row">
      {kpis.map((k) => (
        <article className="pill" key={k}>{k}</article>
      ))}
    </section>
  );
}
