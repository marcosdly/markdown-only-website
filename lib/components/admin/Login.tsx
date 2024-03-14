function verify(ev: MouseEvent) {
  ev.preventDefault();
}

export default function Login() {
  return (
    <div className="local-login-container">
      <form action="login" method="post">
        <label htmlFor="email">Enter authorized email</label>
        <input type="text" name="email" />
        <label htmlFor="passwd">Password</label>
        <input type="text" name="passwd" />
        <input type="submit" value="Try" onClick={verify} />
      </form>
    </div>
  );
}
