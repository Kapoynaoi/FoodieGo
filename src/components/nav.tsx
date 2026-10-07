import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { HomeIcon, BagIcon, CartIcon, UserIcon, UtensilsIcon } from './Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';

const NAV = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/orders', label: 'Orders', Icon: BagIcon },
  { href: '/basket', label: 'Cart', Icon: CartIcon },
  { href: '/profile', label: 'Profile', Icon: UserIcon },
] as const;

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    pathname === href ||
    (href === '/orders' && (pathname.startsWith('/order') || pathname === '/checkout'));
}

/** Landscape: the dark left rail exactly as drawn in the Figma frames. */
export function NavRail() {
  const { s, railWidth } = useLayout();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isActive = useActive();

  return (
    <View
      style={[
        styles.rail,
        { width: railWidth, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 10 },
      ]}
    >
      <View style={styles.brand}>
        <View style={[styles.disc, { width: Math.round(44 * s), height: Math.round(44 * s), borderRadius: 22 }]}>
          <UtensilsIcon size={Math.round(21 * s)} color={surface.raised} />
        </View>
        <View style={{ marginLeft: 9 }}>
          <Text style={[styles.wordmark, { fontSize: Math.round(20 * s) }]} numberOfLines={1}>
            FoodieGo
          </Text>
          <Text style={[styles.tagline, { fontSize: Math.max(8, Math.round(9.5 * s)) }]}>PREMIUM DELIVERY</Text>
        </View>
      </View>

      <View style={styles.navList}>
        {NAV.map(({ href, label, Icon }) => {
          const on = isActive(href);
          return (
            <Pressable
              key={href}
              onPress={() => router.push(href as never)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={({ pressed }) => [
                styles.railItem,
                {
                  paddingVertical: Math.round(11 * s),
                  paddingHorizontal: 11,
                  borderRadius: radius.tile,
                  backgroundColor: on ? surface.raised : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={{ marginRight: 11 }}>
                <Icon size={Math.round(19 * s)} color={on ? brand.soft : text.onDarkMuted} />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.railLabel,
                  { fontSize: Math.round(15 * s) },
                  { color: on ? brand.deep : text.onDarkMuted, fontWeight: on ? '700' : '500' },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Portrait: a bottom tab bar, since a 260pt rail would eat the whole width. */
export function NavBar() {
  const { s, barHeight, gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isActive = useActive();

  return (
    <View
      style={[
        styles.bar,
        { height: barHeight + insets.bottom, paddingBottom: insets.bottom, paddingHorizontal: gutter },
      ]}
    >
      {NAV.map(({ href, label, Icon }) => {
        const on = isActive(href);
        return (
          <Pressable
            key={href}
            onPress={() => router.push(href as never)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={({ pressed }) => [styles.barItem, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.barIcon, on && { backgroundColor: surface.subtle, borderRadius: radius.pill }]}>
              <Icon size={Math.round(21 * s)} color={on ? brand.deep : text.muted} />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.barLabel, { fontSize: Math.max(9, Math.round(10.5 * s)) }, { color: on ? brand.deep : text.muted, fontWeight: on ? '800' : '600' }]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { backgroundColor: brand.deep, paddingHorizontal: 18, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center' },
  disc: { backgroundColor: brand.mid, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: surface.raised, fontWeight: '800', letterSpacing: -0.3 },
  tagline: { color: text.onDarkMuted, fontWeight: '600', letterSpacing: 0.9, marginTop: 2 },
  navList: { flex: 1, justifyContent: 'center' },
  railItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  railLabel: { flexShrink: 1 },

  bar: {
    backgroundColor: surface.raised,
    borderTopWidth: 1,
    borderTopColor: surface.line,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  barIcon: { paddingHorizontal: 16, paddingVertical: 3 },
  barLabel: {},
});
