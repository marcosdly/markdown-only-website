function verify(ev: MouseEvent) {
  ev.preventDefault();
}

export default function Login() {
  const inputClasses = "p-1 rounded bg-dark border border-primary text-white";
  return (
    <div className="local-login-container">
      <form
        action="login"
        method="post"
        className="d-grid gap-2 border rounded border-primary p-3"
      >
        <label htmlFor="email" className="p-1">
          Email
        </label>
        <input type="text" name="email" className={inputClasses} />
        <label htmlFor="passwd">Password</label>
        <input type="text" name="passwd" className={inputClasses} />
        <input type="submit" value="Try" onClick={verify} className="btn btn-primary" />
      </form>
    </div>
  );
}
