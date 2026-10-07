import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { address as seedAddress } from '../data';
import { useAuth } from './auth';

/**
 * Editable per-account data: avatar, delivery addresses, payment methods and
 * notification preferences.
 *
 * Stored in a module-level map keyed by account id, for two reasons:
 *  - Navigation on web re-renders (and can re-create) providers, which was
 *    discarding setState made by the screen that triggered it.
 *  - Data must be per-user. With a single global blob, signing in as a second
 *    account showed the first user's addresses and payment methods.
 *
 * In-memory only - persisting across restarts needs AsyncStorage.
 */

export type Address = {
  id: string;
  label: string;
  line: string;
  isPrimary: boolean;
};

export type PaymentMethod = {
  id: string;
  label: string;
  sub: string;
  kind: 'cod' | 'card';
  isDefault: boolean;
};

export type PrefKey =
  | 'pushEnabled'
  | 'orderUpdates'
  | 'promos'
  | 'smsReceipts'
  | 'bedtimeTracker'
  | 'highQualityImages'
  | 'analytics';

export type Prefs = Record<PrefKey, boolean>;

type ProfileData = {
  avatar: string | null;
  addresses: Address[];
  payments: PaymentMethod[];
  prefs: Prefs;
};

type Ctx = {
  /** Empty strings when signed out; the gate normally prevents that. */
  user: { name: string; email: string; phone: string; tier: string };
  updateUser: (patch: Partial<{ name: string; email: string; phone: string }>) => void;

  avatar: string | null;
  setAvatar: (uri: string | null) => void;

  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, patch: Partial<Omit<Address, 'id'>>) => void;
  removeAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;

  payments: PaymentMethod[];
  addPayment: (p: Omit<PaymentMethod, 'id'>) => void;
  removePayment: (id: string) => void;
  setDefaultPayment: (id: string) => void;

  prefs: Prefs;
  setPref: (key: PrefKey, value: boolean) => void;
  resetPrefs: () => void;
};

const ProfileContext = createContext<Ctx | null>(null);

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++seq}`;

const seedPrefs: Prefs = {
  pushEnabled: true,
  orderUpdates: true,
  promos: false,
  smsReceipts: true,
  bedtimeTracker: false,
  highQualityImages: true,
  analytics: false,
};

function freshData(): ProfileData {
  return {
    avatar: null,
    addresses: [{ id: 'addr-home', label: seedAddress.label, line: seedAddress.line, isPrimary: true }],
    payments: [
      { id: 'pay-cod', label: 'Cash on Delivery', sub: 'Pay at your doorstep', kind: 'cod', isDefault: true },
      { id: 'pay-card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Cash', kind: 'card', isDefault: false },
    ],
    prefs: { ...seedPrefs },
  };
}

/** accountId -> data. Only ever read/written through the signed-in account. */
const store = new Map<string, ProfileData>();

function dataFor(accountId: string | null): ProfileData {
  if (!accountId) return freshData();
  let entry = store.get(accountId);
  if (!entry) {
    entry = freshData();
    store.set(accountId, entry);
  }
  return entry;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { account, updateAccount } = useAuth();
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const accountId = account?.id ?? null;
  const data = dataFor(accountId);

  const setUser = useCallback(
    (patch: Partial<{ name: string; email: string; phone: string }>) => updateAccount(patch),
    [updateAccount]
  );

  const value = useMemo<Ctx>(() => {
    // Mutate in place, then signal React. Safe because this is a plain module
    // object, not React state.
    const patchData = (fn: (d: ProfileData) => void) => {
      if (!accountId) return;
      fn(dataFor(accountId));
      bump();
    };

    return {
      user: {
        name: account?.name ?? '',
        email: account?.email ?? '',
        phone: account?.phone ?? '',
        tier: account?.tier ?? 'CLASSIC',
      },
      updateUser: setUser,

      avatar: data.avatar,
      setAvatar: (uri) => patchData((d) => void (d.avatar = uri)),

      addresses: data.addresses,
      addAddress: (a) =>
        patchData((d) => {
          // The first address is always the primary one.
          if (d.addresses.length === 0) d.addresses = [{ ...a, id: nextId('addr'), isPrimary: true }];
          else d.addresses = [...d.addresses, { ...a, id: nextId('addr'), isPrimary: false }];
        }),
      updateAddress: (id, patch) =>
        patchData((d) => void (d.addresses = d.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)))),
      removeAddress: (id) =>
        patchData((d) => {
          const next = d.addresses.filter((a) => a.id !== id);
          // Never leave the list without a primary address.
          if (next.length && !next.some((a) => a.isPrimary)) next[0] = { ...next[0], isPrimary: true };
          d.addresses = next;
        }),
      setPrimaryAddress: (id) =>
        patchData((d) => void (d.addresses = d.addresses.map((a) => ({ ...a, isPrimary: a.id === id })))),

      payments: data.payments,
      addPayment: (p) =>
        patchData((d) => {
          d.payments = [...d.payments, { ...p, id: nextId('pay'), isDefault: d.payments.length === 0 }];
        }),
      removePayment: (id) =>
        patchData((d) => {
          const next = d.payments.filter((p) => p.id !== id);
          if (next.length && !next.some((p) => p.isDefault)) next[0] = { ...next[0], isDefault: true };
          d.payments = next;
        }),
      setDefaultPayment: (id) =>
        patchData((d) => void (d.payments = d.payments.map((p) => ({ ...p, isDefault: p.id === id })))),

      prefs: data.prefs,
      setPref: (key, v) => patchData((d) => void (d.prefs = { ...d.prefs, [key]: v })),
      resetPrefs: () => patchData((d) => void (d.prefs = { ...seedPrefs })),
    };
    // version is the change signal for the module-level store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, account, accountId, data, setUser, bump]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
