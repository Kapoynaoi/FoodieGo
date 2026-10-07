import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import { BagIcon } from '../components/Icons';
import { brand, surface, text, radius, status } from '../theme';
import { useLayout } from '../responsive';
import { useOrders, PlacedOrder, OrderStatus } from '../store/orders';

const PILL: Partial<Record<OrderStatus, { bg: string; fg: string }>> = {
  Confirmed: status.confirmed,
  Preparing: status.preparing,
  'Out for Delivery': status.delivering,
  Delivered: status.confirmed,
  Pending: status.pending,
};

/**
 * Order history for the signed-in user. Empty until they complete a checkout -
 * nothing is seeded.
 */
export default function Orders() {
  const insets = useSafeAreaInsets();
  const { s, gutter } = useLayout();
  const router = useRouter();
  const { orders } = useOrders();

  return (
    <Shell>
      <ScrollView
        contentContainerStyle={{
          padding: gutter,
          paddingTop: insets.top + gutter,
          paddingBottom: insets.bottom + gutter,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { fontSize: Math.round(26 * s) }]}>My Orders</Text>
        <Text style={[styles.sub, { fontSize: Math.round(14 * s), marginBottom: Math.round(22 * s) }]}>
          Track current orders and manage your premium culinary history.
        </Text>

        {orders.length === 0 ? (
          <View style={[styles.empty, { paddingVertical: Math.round(40 * s) }]}>
            <View style={[styles.emptyIcon, { width: Math.round(64 * s), height: Math.round(64 * s), borderRadius: Math.round(32 * s), marginBottom: Math.round(16 * s) }]}>
              <BagIcon size={Math.round(28 * s)} color={brand.soft} />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: Math.round(16 * s) }]}>No orders yet</Text>
            <Text style={[styles.emptyText, { fontSize: Math.round(13.5 * s), marginTop: Math.round(6 * s) }]}>
              When you place an order it will appear here with live status updates.
            </Text>
            <Pressable
              onPress={() => router.push('/home')}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.emptyCta,
                {
                  marginTop: Math.round(20 * s),
                  paddingHorizontal: Math.round(20 * s),
                  paddingVertical: Math.round(12 * s),
                  borderRadius: radius.pill,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.emptyCtaText, { fontSize: Math.round(14 * s) }]}>Browse Dishes</Text>
            </Pressable>
          </View>
        ) : (
          orders
            .slice()
            .reverse()
            .map((o) => (
              <OrderCard key={o.id} order={o} s={s} onPress={() => router.push('/order-tracking')} />
            ))
        )}
      </ScrollView>
    </Shell>
  );
}

function OrderCard({ order, s, onPress }: { order: PlacedOrder; s: number; onPress: () => void }) {
  const p = PILL[order.status] ?? status.pending;
  const first = order.lines[0].dish;
  const extra = order.lines.length - 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.id}, ${order.status}`}
      style={({ pressed }) => [
        styles.card,
        {
          padding: Math.round(14 * s),
          borderRadius: radius.card,
          marginBottom: Math.round(14 * s),
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Image source={first.image} style={{ width: 92, height: 92, borderRadius: 10 }} />
      <View style={{ flex: 1, marginLeft: Math.round(16 * s) }}>
        <View style={styles.pillRow}>
          <View
            style={[
              styles.pill,
              { backgroundColor: p.bg, borderRadius: radius.pill, paddingHorizontal: Math.round(10 * s), paddingVertical: Math.round(4 * s) },
            ]}
          >
            <Text style={{ color: p.fg, fontWeight: '800', fontSize: Math.round(12 * s) }}>{order.status}</Text>
          </View>
          <Text style={[styles.orderId, { fontSize: Math.round(12.5 * s) }]} numberOfLines={1}>
            {order.id}
          </Text>
        </View>
        <Text style={[styles.name, { fontSize: Math.round(16 * s), marginTop: 8 }]} numberOfLines={2}>
          {first.name}
          {extra > 0 ? ` +${extra} more` : ''}
        </Text>
        <Text style={[styles.note, { fontSize: Math.round(13 * s) }]} numberOfLines={2}>
          Qty: {order.totalQty} item{order.totalQty === 1 ? '' : 's'} • {order.payment === 'cod' ? 'Cash on Delivery' : 'Card'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  sub: { color: text.secondary },
  card: { backgroundColor: surface.raised, flexDirection: 'row', alignItems: 'center' },
  pillRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  pill: { alignSelf: 'flex-start' },
  orderId: { color: text.muted, marginLeft: 12 },
  name: { color: brand.deep, fontWeight: '800', letterSpacing: -0.2 },
  note: { color: text.secondary, marginTop: 3 },
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { backgroundColor: surface.subtle, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: brand.deep, fontWeight: '800' },
  emptyText: { color: text.secondary, textAlign: 'center', maxWidth: 280 },
  emptyCta: { backgroundColor: brand.deep },
  emptyCtaText: { color: text.onDark, fontWeight: '700' },
});
