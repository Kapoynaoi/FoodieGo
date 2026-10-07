import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon } from '../components/Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { useCart } from '../store/cart';
import { useOrders } from '../store/orders';

export default function OrderConfirmed() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait } = useLayout();
  const cart = useCart();
  const { orders } = useOrders();

  // The order the user just placed - not a hardcoded id.
  const order = orders.length ? orders[orders.length - 1] : null;

  const cardW = Math.min(width - gutter * 2, 470 * s);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: gutter },
      ]}
    >
      <View style={[styles.card, { width: cardW, padding: Math.round((isPortrait ? 26 : 34) * s), borderRadius: radius.cardLarge }]}>
        <View style={[styles.checkDisc, { width: Math.round(68 * s), height: Math.round(68 * s), borderRadius: 34, marginBottom: Math.round(20 * s) }]}>
          <CheckIcon size={Math.round(32 * s)} color={brand.deep} />
        </View>

        <Text style={[styles.title, { fontSize: Math.round(28 * s) }]}>Order Confirmed!</Text>
        <Text style={[styles.sub, { fontSize: Math.round(14 * s), marginBottom: Math.round(24 * s) }]}>
          Your culinary masterpiece is being prepared.
        </Text>

        <View style={[styles.summary, { padding: Math.round(18 * s), borderRadius: radius.card, marginBottom: 8 }]}>
          <Line label="Order Number" value={order?.id ?? '—'} s={s} />
          <Divider s={s} />
          <Line label="Estimated Delivery" value={order?.eta ?? '30 - 45 Minutes'} s={s} />
          <Divider s={s} />
          <Line
            label="Payment Method"
            value={(order?.payment ?? cart.payment) === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
            s={s}
          />
        </View>

        <Pressable
          onPress={() => {
            router.replace('/order-tracking');
          }}
          style={({ pressed }) => [
            styles.cta,
            { borderRadius: radius.pill, paddingVertical: Math.round(14 * s), marginTop: Math.round(20 * s), opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>Track My Order</Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/home')} style={styles.link}>
          <Text style={[styles.linkText, { fontSize: Math.round(14 * s) }]}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Line({ label, value, s }: { label: string; value: string; s: number }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.lineLabel, { fontSize: Math.round(13 * s) }]}>{label}</Text>
      <Text style={[styles.lineValue, { fontSize: Math.round(14 * s) }]}>{value}</Text>
    </View>
  );
}

function Divider({ s }: { s: number }) {
  return <View style={{ height: 1, backgroundColor: surface.line, marginVertical: Math.round(12 * s) }} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: surface.canvas, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: surface.raised, alignItems: 'center' },
  checkDisc: { backgroundColor: surface.subtle, alignItems: 'center', justifyContent: 'center' },
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  sub: { color: text.secondary, textAlign: 'center' },
  summary: { backgroundColor: surface.subtle, width: '100%' },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lineLabel: { color: text.secondary },
  lineValue: { color: text.primary, fontWeight: '700' },
  cta: { backgroundColor: brand.deep, alignItems: 'center', width: '100%' },
  ctaText: { color: text.onDark, fontWeight: '700' },
  link: { marginTop: 14 },
  linkText: { color: brand.soft, fontWeight: '700' },
});
