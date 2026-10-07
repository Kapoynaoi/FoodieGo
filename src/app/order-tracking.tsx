import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import { CheckIcon, UtensilsIcon } from '../components/Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { rider, address, peso } from '../data';
import { useOrders } from '../store/orders';

const STEPS = [
  { label: 'Confirmed', sub: 'Order received' },
  { label: 'Preparing', sub: 'In Progress' },
  { label: 'Out for Delivery', sub: 'Pending' },
  { label: 'Delivered', sub: 'Pending' },
] as const;

const STATUS_INDEX: Record<string, number> = {
  Confirmed: 0,
  Preparing: 1,
  'Out for Delivery': 2,
  Delivered: 3,
  Pending: 0,
};

export default function OrderTracking() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { s, gutter, isPortrait, railWidth } = useLayout();
  const { orders } = useOrders();

  // Track the user's real order - the most recent one they placed.
  const order = orders.length ? orders[orders.length - 1] : null;
  const currentIndex = order ? STATUS_INDEX[order.status] ?? 0 : 0;
  const steps = STEPS.map((st, i) => ({
    ...st,
    state: i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo',
  }));

  const contentW = isPortrait ? width : width - railWidth;
  const mapH = Math.round(clamp(isPortrait ? contentW * 0.5 : contentW * 0.34, 190, 280));

  return (
    <Shell>
      <ScrollView
        contentContainerStyle={{
          padding: gutter,
          paddingTop: insets.top + gutter,
          paddingBottom: insets.bottom + gutter,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { fontSize: Math.round(26 * s) }]}>Live Order Tracking</Text>
        <Text style={[styles.sub, { fontSize: Math.round(14 * s), marginBottom: Math.round(20 * s) }]}>
          {order
            ? `Tracking Order ID ${order.id} • ${order.status}`
            : 'No active order to track yet.'}
        </Text>

        <View style={[styles.map, { height: mapH, borderRadius: radius.card, marginBottom: Math.round(20 * s) }]}>
          <View style={[styles.riderCard, { padding: Math.round(12 * s), borderRadius: radius.tile }]}>
            <View style={[styles.riderAvatar, { width: 44, height: 44, borderRadius: 22 }]}>
              <UtensilsIcon size={20} color={surface.raised} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.riderName, { fontSize: Math.round(14 * s) }]} numberOfLines={1}>
                {rider.name}
              </Text>
              <Text style={[styles.riderNote, { fontSize: Math.round(12.5 * s) }]} numberOfLines={2}>
                {rider.note}
              </Text>
            </View>
          </View>
        </View>

        {/* The three status steps sit side by side in landscape, and become a
            vertical timeline in portrait where a row would be too cramped. */}
        <View style={[styles.timeline, isPortrait ? { flexDirection: 'column' } : { flexDirection: 'row' }]}>
          {steps.map((step, i) => (
            <View key={step.label} style={[styles.step, isPortrait ? styles.stepRow : styles.stepCol]}>
              <View style={isPortrait ? styles.stepLeftRow : styles.stepLeftCol}>
                {step.state === 'done' ? (
                  <View style={[styles.stepCircle, { backgroundColor: surface.subtle }]}>
                    <CheckIcon size={15} color={brand.soft} />
                  </View>
                ) : step.state === 'active' ? (
                  <View style={[styles.stepCircle, { backgroundColor: brand.deep }]}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                ) : (
                  <View style={[styles.stepCircle, { backgroundColor: surface.subtle }]}>
                    <Text style={styles.stepNumMuted}>{i + 1}</Text>
                  </View>
                )}
                {i < steps.length - 1 ? (
                  <View style={isPortrait ? [styles.connectorV, { height: Math.round(20 * s) }] : styles.connectorH} />
                ) : null}
              </View>
              <View style={isPortrait ? { flex: 1, marginLeft: 12, marginBottom: 10 } : { flex: 1, marginTop: 8 }}>
                <Text style={[styles.stepLabel, { fontSize: Math.round(15 * s) }, step.state === 'todo' && styles.muted]}>
                  {step.label}
                </Text>
                <Text style={[styles.stepSub, { fontSize: Math.round(12.5 * s) }]}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { padding: Math.round(18 * s), borderRadius: radius.card, marginBottom: Math.round(14 * s) }]}>
          <Text style={[styles.cardTitle, { fontSize: Math.round(16 * s) }]}>Delivery to Home</Text>
          <Text style={[styles.cardSub, { fontSize: Math.round(13 * s), lineHeight: Math.round(18 * s) }]}>{address.line}</Text>
        </View>

        {order && order.lines.length > 0 ? (
          <View style={[styles.card, { padding: Math.round(18 * s), borderRadius: radius.card }]}>
            <Text style={[styles.cardTitle, { fontSize: Math.round(16 * s), marginBottom: 10 }]}>Order Items</Text>
            {order.lines.map((l) => (
              <View key={l.dish.id} style={styles.itemRow}>
                <Text style={[styles.itemName, { fontSize: Math.round(13 * s) }]} numberOfLines={1}>
                  {l.qty}x {l.dish.name}
                </Text>
                <Text style={[styles.itemPrice, { fontSize: Math.round(13 * s) }]}>{peso(l.qty * l.dish.price)}</Text>
              </View>
            ))}
            <View style={[styles.itemRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: surface.line }]}>
              <Text style={[styles.itemName, { fontSize: Math.round(13 * s), fontWeight: '800' }]}>Total</Text>
              <Text style={[styles.itemPrice, { fontSize: Math.round(13 * s), fontWeight: '800' }]}>{peso(order.total)}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Shell>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const styles = StyleSheet.create({
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  sub: { color: text.secondary },
  map: { backgroundColor: '#E6E0CE', overflow: 'hidden', justifyContent: 'flex-start' },
  riderCard: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    backgroundColor: surface.raised,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  riderAvatar: { backgroundColor: brand.deep, alignItems: 'center', justifyContent: 'center' },
  riderName: { color: text.primary, fontWeight: '700' },
  riderNote: { color: text.secondary, marginTop: 1 },
  timeline: { backgroundColor: surface.raised, borderRadius: 18, padding: 18, marginBottom: 18, gap: 4 },
  step: { flexDirection: 'row' },
  stepCol: { flex: 1, flexDirection: 'column' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepLeftCol: { alignItems: 'flex-start' },
  stepLeftRow: { alignItems: 'center' },
  stepCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: surface.raised, fontWeight: '800', fontSize: 14 },
  stepNumMuted: { color: text.muted, fontWeight: '800', fontSize: 14 },
  connectorH: { width: '100%', height: 2, backgroundColor: surface.line, marginVertical: 8 },
  connectorV: { width: 2, backgroundColor: surface.line, marginVertical: 4 },
  stepLabel: { color: text.primary, fontWeight: '700' },
  stepSub: { color: text.secondary, marginTop: 1 },
  muted: { color: text.muted },
  card: { backgroundColor: surface.raised },
  cardTitle: { color: brand.deep, fontWeight: '800' },
  cardSub: { color: text.secondary, marginTop: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { color: text.primary, flex: 1, marginRight: 10 },
  itemPrice: { color: brand.mid, fontWeight: '700' },
});
