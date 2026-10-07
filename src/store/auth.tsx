import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';

/**
 * Accounts and the current session.
 *
 * Single source of truth for "who is using the app" - no screen may hardcode a
 * name.
 *
 * Accounts start EMPTY: a visitor who has not signed up or logged in must not
 * see a default identity.
 *
 * The records live in a module-level store rather than React state on purpose.
 * Navigating on web re-renders (and can re-create) the provider, which was
 * silently discarding setState calls made by the screen that triggered the
 * navigation - sign-up reported success but the account never appeared. A
 * module singleton survives that; `version` is only used to re-render.
 *
 * In-memory only, and passwords are stored verbatim: acceptable for this
 * prototype, but a real app must hash server-side and never keep credentials
 * on the device.
 */

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  tier: string;
  createdAt: number;
};

export type Credentials = { name: string; email: string; phone: string; password: string };
export type AuthResult = { ok: true } | { ok: false; error: string };

type Store = { accounts: Account[]; account: Account | null };

const store: Store = { accounts: [], account: null };

let seq = 0;
const makeId = () => `acc-${Date.now().toString(36)}-${++seq}`;

const normalise = (s: string) => s.trim().toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Ctx = {
  account: Account | null;
  accounts: Account[];
  isAuthed: boolean;
  signUp: (input: Credentials) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateAccount: (patch: Partial<Pick<Account, 'name' | 'email' | 'phone'>>) => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const signUp = useCallback<Ctx['signUp']>(
    (input) => {
      const name = input.name.trim();
      const email = normalise(input.email);
      const phone = input.phone.trim();
      const password = input.password;

      if (name.length < 2) return { ok: false, error: 'Please enter your name.' };
      if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
      if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
      if (phone && phone.replace(/\D/g, '').length < 7) {
        return { ok: false, error: 'Please enter a valid phone number.' };
      }
      if (store.accounts.some((a) => normalise(a.email) === email)) {
        return { ok: false, error: 'An account with that email already exists.' };
      }

      const created: Account = {
        id: makeId(),
        name,
        email,
        phone,
        password,
        tier: 'CLASSIC',
        createdAt: Date.now(),
      };

      store.accounts = [...store.accounts, created];
      store.account = created;
      bump();
      return { ok: true };
    },
    [bump]
  );

  const login = useCallback<Ctx['login']>(
    (email, password) => {
      const wanted = normalise(email);
      if (!wanted) return { ok: false, error: 'Please enter your email address.' };

      const found = store.accounts.find((a) => normalise(a.email) === wanted);
      if (!found) return { ok: false, error: 'No account found for that email.' };
      if (found.password !== password) return { ok: false, error: 'Incorrect password.' };

      store.account = found;
      bump();
      return { ok: true };
    },
    [bump]
  );

  const logout = useCallback(() => {
    store.account = null;
    bump();
  }, [bump]);

  const updateAccount = useCallback<Ctx['updateAccount']>(
    (patch) => {
      const current = store.account;
      if (!current) return;
      store.account = { ...current, ...patch };
      store.accounts = store.accounts.map((a) => (a.id === current.id ? { ...a, ...patch } : a));
      bump();
    },
    [bump]
  );

  const value = useMemo<Ctx>(
    () => ({
      account: store.account,
      accounts: store.accounts,
      isAuthed: store.account !== null,
      signUp,
      login,
      logout,
      updateAccount,
    }),
    // version is the change signal for the module-level store
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, signUp, login, logout, updateAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
