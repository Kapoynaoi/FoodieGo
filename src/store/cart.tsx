import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { CartLine, Dish } from '../data';
import { useAuth } from './auth';

/**
 * Basket contents and payment choice.
 *
 * Starts EMPTY - nothing is seeded. A line only exists once the user actually
 * adds a dish.
 *
 * Keyed by account id so each signed-in user gets their own basket; without
 * this, a second user saw the first user's items.
 *
 * In-memory only, so it clears when the app restarts.
 */

export type Payment = 'cod' | 'card';

type AccountCart = { lines: CartLine[]; payment: Payment };

const store = new Map<string, AccountCart>();

function cartFor(accountId: string | null): AccountCart {
  if (!accountId) return { lines: [], payment: 'cod' };
  let entry = store.get(accountId);
  if (!entry) {
    entry = { lines: [], payment: 'cod' };
    store.set(accountId, entry);
  }
  return entry;
}

type Ctx = {
  lines: CartLine[];
  add: (dish: Dish, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: Payment;
  setPayment: (p: Payment) => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { account } = useAuth();
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const accountId = account?.id ?? null;
  const cart = cartFor(accountId);

  const value = useMemo<Ctx>(() => {
    const lines = cart.lines;

    const mutate = (fn: (c: AccountCart) => void) => {
      if (!accountId) return;
      fn(cartFor(accountId));
      bump();
    };

    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.dish.price, 0);
    const deliveryFee = subtotal > 0 ? 50 : 0;

    return {
      lines,
      add: (dish, qty = 1) =>
        mutate((c) => {
          const found = c.lines.find((l) => l.dish.id === dish.id);
          if (found) {
            c.lines = c.lines.map((l) => (l.dish.id === dish.id ? { ...l, qty: l.qty + qty } : l));
          } else {
            c.lines = [...c.lines, { dish, qty }];
          }
        }),
      setQty: (id, qty) =>
        mutate((c) => {
          c.lines =
            qty <= 0
              ? c.lines.filter((l) => l.dish.id !== id)
              : c.lines.map((l) => (l.dish.id === id ? { ...l, qty } : l));
        }),
      remove: (id) => mutate((c) => void (c.lines = c.lines.filter((l) => l.dish.id !== id))),
      clear: () => mutate((c) => void (c.lines = [])),
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      payment: cart.payment,
      setPayment: (p) => mutate((c) => void (c.payment = p)),
    };
    // version is the change signal for the module-level store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, accountId, cart, bump]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}