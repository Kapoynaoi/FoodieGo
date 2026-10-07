import { View, Text, ScrollView, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { peso } from '../data';
import { useCart } from '../store/cart';
import { Pressable } from 'react-native';
import { PlusIcon, MinusIcon } from '../components/Icons';
import { useRouter } from 'expo-router';

/**
 * Basket and checkout share the same two-pane shape: a scrolling list beside a
 * fixed summary. In portrait there is no room for a side pane, so the summary
 * drops below the list and the whole screen scrolls.
 */
export function TwoPane({
  children,
  ctaLabel,
}: {
  children: React.ReactNode;
  ctaLabel: string;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait, railWidth } = useLayout();
  const cart = useCart();

  const contentW = isPortrait ? width : width - railWidth;
  const paneW = isPortrait ? undefined : Math.round(clamp(contentW * 0.34, 250, 320));

  const summary = (
    <View
      style={[
        styles.summary,
        paneW ? { width: paneW, paddingTop: insets.top + gutter } : { paddingTop: gutter },
      ]}
    >
      <Text style={[styles.sumTitle, { fontSize: Math.round(18 * s) }]}>Order Summary</Text>

      {!isPortrait ? <SummaryLines s={s} /> : null}

      <View style={styles.divider} />
      <SumRow label="Subtotal" value={peso(cart.subtotal)} s={s} />
      <SumRow label="Delivery" value={peso(cart.deliveryFee)} s={s} />
      <View style={styles.divider} />
      <SumRow label="Total" value={peso(cart.total)} s={s} strong />

      <Pressable
        disabled={cart.lines.length === 0}
        onPress={() => router.push('/checkout')}
        style={({ pressed }) => [
          styles.cta,
          {
            borderRadius: radius.pill,
            paddingVertical: Math.round(13 * s),
            marginTop: Math.round(20 * s),
            opacity: cart.lines.length === 0 ? 0.5 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );

  const pane = (
    <ScrollView
      style={isPortrait ? undefined : { flex: 1 }}
      contentContainerStyle={{
        padding: gutter,
        paddingTop: insets.top + gutter,
        paddingBottom: insets.bottom + gutter,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );

  if (isPortrait) {
    return (
      <View style={styles.stack}>
        {pane}
        {summary}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {pane}
      {summary}
    </View>
  );
}

function SummaryLines({ s }: { s: number }) {
  const cart = useCart();
  return (
    <View style={{ flex: 1 }}>
      {cart.lines.map((l) => (
        <SumRow key={l.dish.id} label={`${l.qty}x ${l.dish.name}`} value={peso(l.qty * l.dish.price)} s={s} />
      ))}
    </View>
  );
}

export function SumRow({ label, value, s, strong }: { label: string; value: string; s: number; strong?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text numberOfLines={2} style={[styles.sumLabel, { fontSize: Math.round((strong ? 15 : 13) * s) }, strong && styles.strong]}>
        {label}
      </Text>
      <Text style={[styles.sumValue, { fontSize: Math.round((strong ? 17 : 13) * s) }, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

/** A single cart line, used by the basket list. */
export function CartLineRow({ line }: { line: { dish: (typeof import('../data'))['dishes'][number]; qty: number } }) {
  const { s, gutter } = useLayout();
  const cart = useCart();
  const { isPortrait } = useLayout();
  const img = isPortrait ? 72 : 77;

  return (
    <View style={[styles.line, { padding: Math.round(12 * s), borderRadius: radius.card, marginBottom: Math.round(12 * s) }]}>
      <Image source={line.dish.image} style={{ width: img, height: img - 2, borderRadius: 8 }} />
      <View style={{ flex: 1, marginLeft: Math.round(14 * s) }}>
        <Text numberOfLines={2} style={[styles.itemName, { fontSize: Math.round(15 * s) }]}>
          {line.dish.name}
        </Text>
        <Text style={[styles.itemPrice, { fontSize: Math.round(13 * s) }]}>{peso(line.dish.price)}</Text>
      </View>
      <View style={[styles.stepper, { borderRadius: radius.pill, padding: 5 }]}>
        <Pressable onPress={() => cart.setQty(line.dish.id, line.qty - 1)} hitSlop={8} style={styles.stepBtn}>
          <MinusIcon size={12} color={brand.soft} />
        </Pressable>
        <Text style={[styles.qty, { fontSize: Math.round(13 * s) }]}>{line.qty}</Text>
        <Pressable onPress={() => cart.setQty(line.dish.id, line.qty + 1)} hitSlop={8} style={styles.stepBtn}>
          <PlusIcon size={12} color={brand.soft} />
        </Pressable>
      </View>
    </View>
  );
}

export function ScreenHeading({ title, sub }: { title: string; sub: string }) {
  const { s, gutter } = useLayout();
  return (
    <>
      <Text style={[styles.title, { fontSize: Math.round(26 * s) }]}>{title}</Text>
      <Text style={[styles.sub, { fontSize: Math.round(14 * s), marginBottom: Math.round(22 * s) }]}>{sub}</Text>
    </>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row' },
  stack: { flex: 1 },
  summary: { backgroundColor: surface.raised, borderLeftWidth: 1, borderLeftColor: surface.line, padding: 24 },
  sumTitle: { color: brand.deep, fontWeight: '800', marginBottom: 16 },
  sumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sumLabel: { color: text.secondary, flex: 1, marginRight: 10 },
  sumValue: { color: text.primary, fontWeight: '600' },
  strong: { color: brand.deep, fontWeight: '800' },
  divider: { height: 1, backgroundColor: surface.line, marginVertical: 10 },
  cta: { backgroundColor: brand.deep, alignItems: 'center' },
  ctaText: { color: text.onDark, fontWeight: '700' },

  line: { backgroundColor: surface.raised, flexDirection: 'row', alignItems: 'center' },
  itemName: { color: brand.deep, fontWeight: '700' },
  itemPrice: { color: text.muted, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: surface.subtle, gap: 12 },
  stepBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  qty: { color: brand.deep, fontWeight: '800', minWidth: 12, textAlign: 'center' },

  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  sub: { color: text.secondary },
});
