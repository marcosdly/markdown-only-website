import { type VNode } from "preact";
import { useContext } from "preact/hooks";
import MainContext from "../../admin/MainContext";
import { LogOutButton } from "./MiscButtons";
import PostManager from "./PostManager";

interface PageButtonProps {
  title: string;
  component: VNode;
}

function PageButton({ title, component }: PageButtonProps) {
  const setState = useContext(MainContext);

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    setState(component);
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

export default function PanelSelector() {
  return (
    <>
      <LogOutButton />
      <PageButton title="Blog Posts Manager" component={<PostManager />} />
    </>
  );
}
