import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkIsAdmin } from "@/lib/firestore";
import type { User as RettoUser } from "@/types";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle(): Promise<RettoUser> {
  const result = await signInWithPopup(auth, provider);
  const fbUser = result.user;
  const isAdmin = await checkIsAdmin(fbUser.email ?? "");
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? "",
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    isAdmin,
  };
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
