import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { CartLine } from '../data';
import { useAuth } from './auth';
import type { Payment } from './cart';

/**
 * Order history.
 *
 * Starts EMPTY. An order is created only by completing checkout, never seeded.
 * Keyed by account id so users do not see each other's history.
 */

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Pending' | 'Delivered';

export type PlacedOrder = {
  id: string;
  lines: CartLine[];
  totalQty: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: Payment;
  status: OrderStatus;
  placedAt: number;
  eta: string;
};

const store = new Map<string, PlacedOrder[]>();

function ordersFor(accountId: string | null): PlacedOrder[] {
  if (!accountId) return [];
  let entry = store.get(accountId);
  if (!entry) {
    entry = [];
    store.set(accountId, entry);
  }
  return entry;
}

type Ctx = {
  orders: PlacedOrder[];
  /** Id of the most recently placed order, for the confirmation screen. */
  lastPlacedId: string | null;
  placeOrder: (input: {
    lines: CartLine[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    payment: Payment;
  }) => PlacedOrder | null;
  advance: (id: string) => void;
};

const OrdersContext = createContext<Ctx | null>(null);

let seq = 0;

/** #FG-YYYYMMDD-nnn, matching the prototype's order-id shape. */
function makeOrderId(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  seq += 1;
  return `#FG-${ymd}-${String(seq).padStart(3, '0')}`;
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Confirmed: 'Preparing',
  Preparing: 'Out for Delivery',
  'Out for Delivery': 'Delivered',
};

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { account } = useAuth();
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const accountId = account?.id ?? null;

  const value = useMemo<Ctx>(() => {
    const orders = ordersFor(accountId);

    return {
      orders,
      lastPlacedId: orders.length ? orders[orders.length - 1].id : null,
      placeOrder: (input) => {
        if (!accountId || input.lines.length === 0) return null;

        const order: PlacedOrder = {
          id: makeOrderId(),
          lines: input.lines,
          totalQty: input.lines.reduce((n, l) => n + l.qty, 0),
          subtotal: input.subtotal,
          deliveryFee: input.deliveryFee,
          total: input.total,
          payment: input.payment,
          status: 'Confirmed',
          placedAt: Date.now(),
          eta: '30 - 45 Minutes',
        };

        const list = ordersFor(accountId);
        list.push(order);
        bump();
        return order;
      },
      advance: (id) => {
        const list = ordersFor(accountId);
        const i = list.findIndex((o) => o.id === id);
        if (i < 0) return;
        const next = NEXT_STATUS[list[i].status];
        if (!next) return;
        list[i] = { ...list[i], status: next };
        bump();
      },
    };
    // version is the change signal for the module-level store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, accountId, bump]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}