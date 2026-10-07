import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import { UserIcon, ListIcon, PinIcon, CardIcon, SlidersIcon, ChevronIcon } from '../components/Icons';
import { Avatar } from '../components/ProfilePhoto';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { settings } from '../data';
import { useProfile } from '../store/profile';
import { useAuth } from '../store/auth';

const ICONS: Record<string, (p: { size: number; color: string }) => React.ReactElement> = {
  person: UserIcon,
  list: ListIcon,
  pin: PinIcon,
  card: CardIcon,
  sliders: SlidersIcon,
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { s, gutter, isPortrait } = useLayout();
  const router = useRouter();
  const { user, addresses, payments } = useProfile();
  const { logout } = useAuth();

  const go = (id: string) => {
    if (id === 'profile') router.push('/edit-profile');
    else if (id === 'orders') router.push('/orders');
    else if (id === 'address') router.push('/addresses');
    else if (id === 'payment') router.push('/payment-settings');
    else if (id === 'config') router.push('/app-settings');
  };

  // Live counts so the menu reflects what is actually saved.
  const counts: Record<string, string> = {
    address: `${addresses.length} saved`,
    payment: `${payments.length} linked`,
  };

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
        <View style={[styles.header, { padding: Math.round(22 * s), borderRadius: radius.card, marginBottom: Math.round(18 * s) }]}>
          <Avatar size={Math.round(84 * s)} />
          {/* Identity block sits beside the avatar in landscape, below it in
              portrait so the name is never squeezed into a sliver. */}
          <View style={[styles.ident, isPortrait ? { marginTop: Math.round(16 * s) } : { flex: 1, marginLeft: Math.round(22 * s) }]}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { fontSize: Math.round(24 * s) }]} numberOfLines={1}>
                {user.name}
              </Text>
              <View style={[styles.tier, { backgroundColor: surface.subtle, borderRadius: radius.pill, paddingHorizontal: Math.round(10 * s), paddingVertical: Math.round(3 * s) }]}>
                <Text style={[styles.tierText, { fontSize: Math.round(11 * s) }]}>{user.tier}</Text>
              </View>
            </View>
            <Text style={[styles.contact, { fontSize: Math.round(13 * s) }]}>
              {user.email} • {user.phone}
            </Text>
          </View>
        </View>

        <View style={[styles.list, { borderRadius: radius.card, overflow: 'hidden' }]}>
          {settings.map((row, i) => {
            const Icon = ICONS[row.icon] ?? UserIcon;
            return (
              <Pressable
                key={row.id}
                onPress={() => go(row.id)}
                style={({ pressed }) => [
                  styles.row,
                  {
                    padding: Math.round(16 * s),
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: surface.line,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={[styles.chip, { width: 44, height: 44, borderRadius: 12 }]}>
                  <Icon size={19} color={brand.soft} />
                </View>
                <View style={{ flex: 1, marginLeft: Math.round(16 * s) }}>
                  <Text style={[styles.rowTitle, { fontSize: Math.round(15 * s) }]}>{row.title}</Text>
                  <Text style={[styles.rowSub, { fontSize: Math.round(12.5 * s), lineHeight: Math.round(17 * s) }]}>
                    {counts[row.id] ? `${counts[row.id]} • ` : ''}
                    {row.sub}
                  </Text>
                </View>
                <ChevronIcon size={16} color={text.muted} dir="right" />
              </Pressable>
            );
          })}
        </View>

        {/* Sign out sits below the settings card, not inside it - inside it
            inherited the card's white background and read as another row. */}
        <Pressable
          onPress={logout}
          accessibilityRole="button"
          accessibilityLabel="Sign Out"
          style={({ pressed }) => [
            styles.signOut,
            {
              marginTop: Math.round(16 * s),
              paddingVertical: Math.round(14 * s),
              borderRadius: radius.card,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.signOutText, { fontSize: Math.round(14.5 * s) }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: surface.raised, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  avatar: { backgroundColor: brand.deep, alignItems: 'center', justifyContent: 'center' },
  ident: { flexBasis: '70%' },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tier: { alignSelf: 'flex-start' },
  name: { color: brand.deep, fontWeight: '800', letterSpacing: -0.4, marginRight: 10 },
  tierText: { color: brand.soft, fontWeight: '800', letterSpacing: 0.6 },
  contact: { color: text.secondary, marginTop: 4 },
  list: { backgroundColor: surface.raised },
  signOut: { alignItems: 'center', borderWidth: 1.5, borderColor: surface.line, backgroundColor: surface.raised },
  signOutText: { color: '#B3261E', fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center' },
  chip: { backgroundColor: surface.subtle, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: text.primary, fontWeight: '700' },
  rowSub: { color: text.secondary, marginTop: 2 },
});
