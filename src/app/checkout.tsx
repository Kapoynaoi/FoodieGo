import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import { SumRow } from '../components/TwoPane';
import { PinIcon, ChevronIcon } from '../components/Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { address, peso } from '../data';
import { useCart } from '../store/cart';
import { useOrders } from '../store/orders';

/**
 * Secure Checkout.
 *
 * Landscape keeps the Figma two-pane shape: form on the left, fixed summary on
 * the right separated by a hairline. Portrait stacks them and scrolls, because
 * the form plus the summary is taller than a phone screen - without a
 * ScrollView the payment options were unreachable.
 */
export default function Checkout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait, railWidth } = useLayout();
  const cart = useCart();
  const { placeOrder: createOrder } = useOrders();

  // Only now - after the user confirms - does an order come into existence.
  const placeOrder = () => {
    const created = createOrder({
      lines: cart.lines,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      payment: cart.payment,
    });
    if (!created) return;
    // Empty the basket now that the order exists - not later on a button press.
    cart.clear();
    router.push('/order-confirmed');
  };

  const contentW = isPortrait ? width : width - railWidth;
  const paneW = isPortrait ? undefined : Math.round(clamp(contentW * 0.34, 250, 320));

  // Stack the payment options whenever the row would be cramped, which also
  // covers short landscape phones rather than relying on orientation alone.
  const stackPay = isPortrait || contentW < 480;

  const form = (
    <>
      <Text style={[styles.title, { fontSize: Math.round(24 * s) }]}>Secure Checkout</Text>
      <Text style={[styles.sub, { fontSize: Math.round(13.5 * s), marginBottom: Math.round(22 * s) }]}>
        Please verify your location details and payment options.
      </Text>

      <Text style={[styles.section, { fontSize: Math.round(15.5 * s), marginBottom: Math.round(10 * s) }]}>
        Delivery Location
      </Text>
      <View
        style={[
          styles.addr,
          {
            padding: Math.round(15 * s),
            borderRadius: radius.card,
            marginBottom: Math.round(22 * s),
          },
        ]}
      >
        <View
          style={[
            styles.addrIcon,
            { width: Math.round(42 * s), height: Math.round(42 * s), borderRadius: Math.round(21 * s) },
          ]}
        >
          <PinIcon size={Math.round(19 * s)} color={brand.soft} />
        </View>
        <View style={{ flex: 1, marginLeft: Math.round(13 * s), marginRight: 6 }}>
          <Text style={[styles.addrTitle, { fontSize: Math.round(14.5 * s) }]} numberOfLines={2}>
            {address.label}
          </Text>
          <Text
            style={[
              styles.addrLine,
              { fontSize: Math.round(12.5 * s), lineHeight: Math.round(17.5 * s), marginTop: 3 },
            ]}
          >
            {address.line}
          </Text>
        </View>
        <ChevronIcon size={Math.round(17 * s)} color={brand.soft} dir="right" />
      </View>

      <Text style={[styles.section, { fontSize: Math.round(15.5 * s), marginBottom: Math.round(10 * s) }]}>
        Payment Options
      </Text>
      <View style={[styles.payRow, stackPay && { flexDirection: 'column' }]}>
        <PayCard
          title="Cash on Delivery"
          sub="Pay securely at your doorstep"
          selected={cart.payment === 'cod'}
          onPress={() => cart.setPayment('cod')}
          s={s}
        />
        <PayCard
          title="Credit/Debit Card"
          sub="Visa / Mastercard / Cash"
          selected={cart.payment === 'card'}
          onPress={() => cart.setPayment('card')}
          s={s}
        />
      </View>
    </>
  );

  const summary = (
    <View
      style={[
        styles.summary,
        paneW
          ? {
              width: paneW,
              borderLeftWidth: 1,
              borderLeftColor: surface.line,
              paddingTop: insets.top + gutter,
            }
          : { padding: gutter },
      ]}
    >
      <Text style={[styles.sumTitle, { fontSize: Math.round(17 * s), marginBottom: Math.round(14 * s) }]}>
        Order Summary
      </Text>

      <View>
        {cart.lines.map((l) => (
          <SumRow key={l.dish.id} label={`${l.qty}x ${l.dish.name}`} value={peso(l.qty * l.dish.price)} s={s} />
        ))}
      </View>

      <View style={styles.divider} />
      <SumRow label="Subtotal" value={peso(cart.subtotal)} s={s} />
      <SumRow label="Delivery" value={peso(cart.deliveryFee)} s={s} />
      <View style={styles.divider} />
      <SumRow label="Total" value={peso(cart.total)} s={s} strong />

      <Pressable
        disabled={cart.lines.length === 0}
        onPress={placeOrder}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.cta,
          {
            borderRadius: radius.pill,
            paddingVertical: Math.round(13 * s),
            marginTop: Math.round(18 * s),
            opacity: cart.lines.length === 0 ? 0.5 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>Place Order</Text>
      </Pressable>
    </View>
  );

  if (isPortrait) {
    return (
      <Shell>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + gutter * 2 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ padding: gutter, paddingTop: insets.top + gutter }}>{form}</View>
          {summary}
        </ScrollView>
      </Shell>
    );
  }

  return (
    <Shell>
      <View style={styles.row}>
        <ScrollView
          contentContainerStyle={{
            padding: gutter,
            paddingTop: insets.top + gutter,
            paddingBottom: insets.bottom + gutter,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {form}
        </ScrollView>
        {summary}
      </View>
    </Shell>
  );
}

function PayCard({
  title, sub, selected, onPress, s,
}: { title: string; sub: string; selected: boolean; onPress: () => void; s: number }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.pay,
        {
          padding: Math.round(14 * s),
          borderRadius: radius.card,
          borderWidth: 2,
          borderColor: selected ? brand.deep : surface.line,
          backgroundColor: surface.raised,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={[styles.payTitle, { fontSize: Math.round(14 * s) }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.paySub, { fontSize: Math.round(12 * s), lineHeight: Math.round(16 * s), marginTop: 2 }]}
          numberOfLines={2}
        >
          {sub}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          {
            width: Math.round(18 * s),
            height: Math.round(18 * s),
            borderRadius: Math.round(9 * s),
            borderWidth: 2,
            borderColor: selected ? brand.deep : surface.line,
          },
        ]}
      >
        {selected ? (
          <View
            style={{
              width: Math.round(9 * s),
              height: Math.round(9 * s),
              borderRadius: Math.round(5 * s),
              backgroundColor: brand.deep,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row' },
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: text.secondary, marginTop: 4 },
  section: { color: brand.deep, fontWeight: '800' },
  addr: { backgroundColor: surface.raised, flexDirection: 'row', alignItems: 'center' },
  addrIcon: { backgroundColor: surface.subtle, alignItems: 'center', justifyContent: 'center' },
  addrTitle: { color: text.primary, fontWeight: '700' },
  addrLine: { color: text.secondary },
  payRow: { flexDirection: 'row', gap: 12 },
  pay: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  payTitle: { color: text.primary, fontWeight: '700' },
  paySub: { color: text.muted },
  radio: { alignItems: 'center', justifyContent: 'center' },
  summary: { backgroundColor: surface.raised, padding: 24 },
  sumTitle: { color: brand.deep, fontWeight: '800' },
  divider: { height: 1, backgroundColor: surface.line, marginVertical: Math.round(10 * 1) },
  cta: { backgroundColor: brand.deep, alignItems: 'center' },
  ctaText: { color: text.onDark, fontWeight: '700' },
});
