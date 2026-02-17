const cards = [
  { name: 'KasiHub', status: 'AT RISK', progress: '34/50', sprint: 'S3 Day 6/10', blockers: '3 (Ext:2)', risk: 'High (+3 days)' },
  { name: 'WhatsHire', status: 'ON TRACK', progress: '18/20', sprint: 'S1 Day 2/10', blockers: '1 (Ext:0)', risk: 'Low (0 days)' },
  { name: 'App Revamp', status: 'OFF TRACK', progress: '10/60', sprint: 'S5 Day 8/10', blockers: '5', risk: 'High (+7 days)' },
];

export function ProjectHealthGrid() {
  return (
    <section className="grid-3">
      {cards.map((card) => (
        <article className="card" key={card.name}>
          <h3>Project: {card.name}</h3>
          <p>Status: <strong>{card.status}</strong></p>
          <p>Progress: {card.progress}</p>
          <p>Sprint: {card.sprint}</p>
          <p>Blockers: {card.blockers}</p>
          <p>Risk: {card.risk}</p>
          <div className="row"><button className="btn">View Project</button><button className="btn">Report</button></div>
        </article>
      ))}
    </section>
  );
}
