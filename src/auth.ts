import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  connectAuthEmulator,
  User,
} from "firebase/auth";

initializeApp(JSON.parse(process.env.FIREBASE_CONFIG || ""));

const auth = getAuth();

if (process.env.NODE_ENV !== "production") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export function useAnonymousLogin(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (!user) {
        signInAnonymously(auth).catch(console.error);
        return;
      }
    });
  }, []);

  return user;
}

export const UserContext = createContext<User | null | undefined>(null);

export const useUser = (): User | null | undefined => useContext(UserContext);
