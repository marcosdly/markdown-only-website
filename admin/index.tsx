import { render } from "preact";

interface PageButtonProps {
  title: string;
  href: string;
}

function PageButton({ title, href }: PageButtonProps) {
  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    if (!event.currentTarget) return;
    const btn = event.currentTarget as HTMLButtonElement;
    btn.innerHTML = "";
    if (!href.endsWith("/")) href + "/";
    render(<span className="spinner-border spinner-border-sm"></span>, btn);
    window.location.pathname = href;
  };

  return (
    <div className="page-button container d-flex justify-content-between align-items-center align-middle border border-primary border-1 rounded">
      <label htmlFor={title} className="">
        {title}
      </label>
      <button className="btn btn-primary" type="submit" name={title} onClick={onClick}>
        Go
      </button>
    </div>
  );
}

function App() {
  return (
    <>
      <PageButton title="Blog Posts Manager" href="/admin/blogposts/" />
    </>
  );
}

const app = document.getElementById("app");

if (app) render(<App />, app);
