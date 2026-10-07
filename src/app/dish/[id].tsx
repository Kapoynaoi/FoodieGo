import { View, Text, ScrollView, Pressable, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import Shell from '../../components/Shell';
import { ChevronIcon, StarIcon, PlusIcon, MinusIcon } from '../../components/Icons';
import { brand, surface, text, radius } from '../../theme';
import { useLayout } from '../../responsive';
import { dishById, peso } from '../../data';
import { useCart } from '../../store/cart';

export default function DishDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait, railWidth } = useLayout();
  const dish = dishById(id ?? 'angus-burger');
  const cart = useCart();
  const [qty, setQty] = useState(1);

  const contentW = isPortrait ? width : width - railWidth;
  // Portrait stacks the hero above the copy; landscape keeps them side by side
  // exactly as the Figma frame does.
  const heroW = isPortrait ? contentW - gutter * 2 : Math.min(475 * s, contentW * 0.52);
  const heroH = isPortrait ? Math.round(clamp(contentW * 0.62, 190, 320)) : undefined;

  return (
    <Shell>
      <View style={[styles.root, isPortrait && styles.columnStack]}>
        {!isPortrait ? (
          <View style={{ width: heroW, padding: gutter }}>
            <View style={[styles.hero, { flex: 1, borderRadius: radius.card }]}>
              <BackButton s={s} onPress={() => router.back()} offset={gutter} />
              <Image source={dish.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
          </View>
        ) : null}

        <ScrollView
          style={isPortrait ? undefined : styles.info}
          contentContainerStyle={{
            padding: gutter,
            paddingTop: isPortrait ? insets.top + gutter : insets.top + gutter * 1.1,
            paddingBottom: insets.bottom + gutter,
          }}
          showsVerticalScrollIndicator={false}
        >
          {isPortrait ? (
            <View style={[styles.hero, { width: '100%', height: heroH, borderRadius: radius.card, marginBottom: gutter }]}>
              <BackButton s={s} onPress={() => router.back()} offset={gutter} />
              <Image source={dish.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
          ) : null}

          {dish.badge ? <Text style={[styles.badge, { fontSize: Math.round(10 * s), letterSpacing: 1 }]}>{dish.badge}</Text> : null}
          <Text style={[styles.name, { fontSize: Math.round((isPortrait ? 24 : 28) * s), marginTop: 8 }]}>{dish.name}</Text>

          <View style={styles.ratingRow}>
            <StarIcon size={Math.round(16 * s)} />
            <Text style={[styles.rating, { fontSize: Math.round(14 * s) }]}>{dish.rating.toFixed(1)}</Text>
            <Text style={[styles.reviews, { fontSize: Math.round(13 * s) }]}>({dish.reviews})</Text>
          </View>

          <Text style={[styles.desc, { fontSize: Math.round(14 * s), lineHeight: Math.round(21 * s) }]}>
            {dish.description}
          </Text>

          <View style={styles.qtyRow}>
            <Text style={[styles.qtyLabel, { fontSize: Math.round(13 * s) }]}>Quantity</Text>
            <View style={[styles.stepper, { borderRadius: radius.pill, padding: 4 }]}>
              <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} hitSlop={8} style={styles.stepBtn}>
                <MinusIcon size={13} color={brand.soft} />
              </Pressable>
              <Text style={[styles.qtyValue, { fontSize: Math.round(14 * s) }]}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => q + 1)} hitSlop={8} style={styles.stepBtn}>
                <PlusIcon size={13} color={brand.soft} />
              </Pressable>
            </View>
          </View>

          <Text style={[styles.totalLabel, { fontSize: Math.round(13 * s) }]}>Total Price</Text>
          <Text style={[styles.total, { fontSize: Math.round(30 * s) }]}>{peso(dish.price * qty)}</Text>

          <Pressable
            onPress={() => {
              cart.add(dish, qty);
              router.push('/basket');
            }}
            style={({ pressed }) => [
              styles.cta,
              { borderRadius: radius.pill, paddingVertical: Math.round(14 * s), marginTop: Math.round(22 * s), opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>Add to Basket</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Shell>
  );
}

function BackButton({ s, onPress, offset }: { s: number; onPress: () => void; offset: number }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.back,
        {
          width: Math.round(38 * s),
          height: Math.round(38 * s),
          borderRadius: 19,
          top: Math.round(offset * 0.7),
          left: Math.round(offset * 0.7),
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <ChevronIcon size={Math.round(18 * s)} color={brand.deep} dir="left" />
    </Pressable>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  columnStack: { flexDirection: 'column' },
  hero: { overflow: 'hidden', backgroundColor: surface.subtle },
  back: { position: 'absolute', backgroundColor: surface.raised, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  info: { flex: 1 },
  badge: { color: brand.mid, fontWeight: '800' },
  name: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { color: brand.deep, fontWeight: '800', marginLeft: 6 },
  reviews: { color: text.muted, marginLeft: 4 },
  desc: { color: text.secondary, marginTop: 18 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 },
  qtyLabel: { color: text.primary, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: surface.subtle, gap: 14 },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { color: brand.deep, fontWeight: '800', minWidth: 14, textAlign: 'center' },
  totalLabel: { color: text.secondary, marginTop: 22 },
  total: { color: brand.mid, fontWeight: '800', marginTop: 2 },
  cta: { backgroundColor: brand.deep, alignItems: 'center' },
  ctaText: { color: text.onDark, fontWeight: '700' },
});
