export function UpperNav() {
  return (
    <div id="upper-nav">
      <nav className="lexend-font">
        <ol>
          <li>
            <a href="/about">about</a>
          </li>
          <li>
            <a href="/resume">resume</a>
          </li>
        </ol>
        <a href="/" className="title">
          <h1>marcos bião</h1>
        </a>
        <ol>
          <li>
            <a href="/blog">blog</a>
          </li>
          <li>
            <a href="/social">social</a>
          </li>
        </ol>
      </nav>
    </div>
  );
}
