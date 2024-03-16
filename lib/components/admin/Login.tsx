import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { VNode } from "preact";
import { StateUpdater, useContext, useEffect } from "preact/hooks";
import MainContext from "../../admin/MainContext";
import { auth, isLogged } from "../../firebase/app";
import PanelSelector from "./PanelSelector";

class AnonymousError extends Error {}
const postLoginComponent = <PanelSelector />;

function getUserVerifyEvent(setState: StateUpdater<VNode>) {
  return (ev: MouseEvent) => {
    ev.preventDefault();
    if (!ev.currentTarget) return;
    const button = ev.currentTarget as HTMLInputElement;
    const form = button.parentElement,
      email = (form?.querySelector("[name=email]") as HTMLInputElement)?.value,
      password = (form?.querySelector("[name=passwd]") as HTMLInputElement)?.value;

    if (!(email && password)) return;

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        if (cred.user.isAnonymous) throw new AnonymousError();
        button.classList.remove("btn-danger");
        button.classList.add("btn-primary");
        button.value = "Logged!";

        setState(postLoginComponent);
      })
      .catch((err: AuthError | AnonymousError) => {
        if (err instanceof AnonymousError) button.value = "Cannot login as anonymous";
        else
          switch (err.code) {
            case "auth/too-many-requests":
              button.value = "Too many attempts";
              break;
            case "auth/invalid-email":
            case "auth/invalid-credential":
              button.value = "Invalid credentials";
              break;
            default:
              console.error(err);
              break;
          }

        button.classList.remove("btn-primary");
        button.classList.add("btn-danger");
      });
  };
}

async function checkUserLogin(setState: StateUpdater<VNode>) {
  while (true) {
    if (isLogged()) {
      setState(postLoginComponent);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export default function Login() {
  const setState = useContext(MainContext);

  useEffect(() => {
    checkUserLogin(setState);
  }, []);

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
        <input type="password" name="passwd" className={inputClasses} />
        <input
          type="submit"
          value="Try"
          onClick={getUserVerifyEvent(setState)}
          className="btn btn-primary"
        />
      </form>
    </div>
  );
}
