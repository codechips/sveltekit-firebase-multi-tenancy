import { writable } from 'svelte/store';
import { browser } from '$app/env';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getIdTokenResult,
  signOut
} from 'firebase/auth';

import type { User } from 'firebase/auth';
import type { Employee, Company } from './types';

export interface AuthState {
  user: Employee | null;
  company?: Company;
  loading: boolean;
}

const createAuth = () => {
  const { subscribe, set } = writable<AuthState>({ user: null, loading: true });

  const setUser = async (user: User) => {
    const firebase = await import('./firebase');
    const { db } = firebase;

    const firestore = await import('firebase/firestore');
    const { doc, getDoc } = firestore;

    try {
      // fetch claims from user's id_token
      const { claims } = await getIdTokenResult(user, true);

      // map user entirely from claims since they contain all info needed
      const employee: Employee = {
        id: <string>claims.user_id,
        name: <string>claims.name,
        email: <string>claims.email,
        companyId: <string>claims.companyId,
        admin: claims.admin,
        roles: claims.roles
      };

      // fetch user's company from Firestore and add it to auth state
      const docRef = doc(db, 'companies', employee.companyId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Company;
      const company: Company = { id: docSnap.id, ...data };

      console.log('auth:set_user');
      set({ user: employee, company, loading: false });
    } catch (err) {
      console.log(err);
      set({ user: null, company: null, loading: false });
    }
  };

  async function listen() {
    const firebase = await import('./firebase');
    const { app } = firebase;

    const auth = getAuth(app);
    onAuthStateChanged(
      auth,
      (user) => (user ? setUser(user) : set({ user: null, loading: false })),
      (err) => console.error(err.message)
    );
  }

  if (browser) {
    // only fetch auth state in the browser
    console.log('auth:web');
    listen();
  } else {
    console.log('auth:ssr');
    set({ user: null, loading: true });
  }

  async function login(email: string, password: string) {
    const firebase = await import('./firebase');
    const { app } = firebase;

    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    const firebase = await import('./firebase');
    const { app } = firebase;

    const auth = getAuth(app);
    await signOut(auth);
  }

  return {
    subscribe,
    login,
    logout
  };
};

export const auth = createAuth();
