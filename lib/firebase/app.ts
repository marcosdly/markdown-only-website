import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth } from "firebase/auth";

const app = initializeApp();

export const auth = getAuth(app);

(async function () {
  await auth.setPersistence(browserSessionPersistence);
  auth.languageCode = "en";
})();

export function isLogged(): boolean {
  return Boolean(auth.currentUser);
}
