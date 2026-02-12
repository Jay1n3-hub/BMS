export function LoginPage() {
  return (
    <div className="auth-wrap card">
      <h1>BMS</h1>
      <button className="btn">Sign in with Email</button>
      <label>Email</label>
      <input className="input" />
      <label>Pass</label>
      <input className="input" type="password" />
      <button className="btn primary">Sign In</button>
      <hr />
      <p>Or connect tools first:</p>
      <div className="row">
        <button className="btn">Connect Jira</button>
        <button className="btn">Connect Trello</button>
      </div>
      <small>(You can skip and use manual projects)</small>
    </div>
  );
}
