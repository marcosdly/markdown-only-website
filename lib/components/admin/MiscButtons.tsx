import { type VNode } from "preact";
import { useContext } from "preact/hooks";
import MainContext from "../../admin/MainContext";
import Login from "./Login";

interface ButtonProps {
  title: string;
  component: VNode;
}

interface MiscButtonProps {
  previousComponent: VNode;
}

function Button({ title, component }: ButtonProps) {
  const setState = useContext(MainContext);

  const onClick = (ev: MouseEvent) => {
    ev.preventDefault();
    setState(component);
  };

  return (
    <button className="local-misc-button btn btn-warning" onClick={onClick}>
      {title}
    </button>
  );
}

export function ReturnButton({ previousComponent }: MiscButtonProps) {
  return <Button title="<-" component={previousComponent} />;
}

export function LogOutButton() {
  return <Button title="Log Out" component={<Login />} />;
}
