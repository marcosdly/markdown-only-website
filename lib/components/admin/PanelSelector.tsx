import { type VNode } from "preact";
import PostManager from "./PostManager";

interface PageButtonProps {
  title: string;
  setState: Function;
  component: VNode;
}

interface PanelSelectorProps {
  setState: Function;
}

function PageButton({ title, setState, component }: PageButtonProps) {
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

export default function PanelSelector({ setState }: PanelSelectorProps) {
  return (
    <>
      <PageButton
        title="Blog Posts Manager"
        setState={setState}
        component={<PostManager />}
      />
    </>
  );
}
