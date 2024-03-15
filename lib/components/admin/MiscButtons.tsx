import { type VNode } from "preact";
import { useContext } from "preact/hooks";
import MainContext from "../../admin/MainContext";
import Login from "./Login";

interface ButtonProps {
  icon: string;
  component: VNode;
}

interface MiscButtonProps {
  previousComponent: VNode;
}

function Button({ icon, component }: ButtonProps) {
  const setState = useContext(MainContext);

  const onClick = (ev: MouseEvent) => {
    ev.preventDefault();
    setState(component);
  };

  return (
    <button className="local-misc-button btn btn-warning" onClick={onClick}>
      <i className={"bi " + icon}></i>
    </button>
  );
}

export function ReturnButton({ previousComponent }: MiscButtonProps) {
  return <Button icon="bi-arrow-return-left" component={previousComponent} />;
}

export function LogOutButton() {
  return <Button icon="bi-box-arrow-left" component={<Login />} />;
}
