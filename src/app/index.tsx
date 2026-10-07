import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { UtensilsIcon } from '../components/Icons';
import { useAuth } from '../store/auth';

/**
 * Sign in. Fields start empty on purpose - no default identity is shown to a
 * visitor who has not registered. A real credential check runs against the
 * accounts created through Sign Up.
 */
export default function Login() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait } = useLayout();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const cardW = Math.min(width - gutter * 2, 470 * s);

  const submit = () => {
    if (busy) return;
    setBusy(true);
    const res = login(email, password);
    setBusy(false);

    if (res.ok) {
      setError(null);
      router.replace('/home');
    } else {
      setError(res.error);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + gutter,
        paddingBottom: insets.bottom + gutter,
        paddingHorizontal: gutter,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.card, { width: cardW, padding: Math.round((isPortrait ? 24 : 30) * s), borderRadius: radius.cardLarge }]}>
        <View
          style={[
            styles.logo,
            {
              width: Math.round(62 * s),
              height: Math.round(62 * s),
              borderRadius: Math.round(31 * s),
              marginBottom: Math.round(14 * s),
            },
          ]}
        >
          <UtensilsIcon size={Math.round(30 * s)} color={brand.deep} />
        </View>

        <Text style={[styles.title, { fontSize: Math.round(28 * s) }]}>FoodieGo</Text>
        <Text style={[styles.tagline, { fontSize: Math.round(13 * s), marginBottom: Math.round(22 * s) }]}>
          Fresh premium culinary delivered directly to your doorstep.
        </Text>

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
          style={[
            styles.input,
            {
              fontSize: Math.round(14 * s),
              paddingVertical: Math.round(12 * s),
              borderRadius: radius.tile,
              marginBottom: Math.round(14 * s),
            },
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@email.com"
          placeholderTextColor={text.muted}
          accessibilityLabel="Email Address"
          editable={!busy}
        />

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) setError(null);
          }}
          style={[
            styles.input,
            {
              fontSize: Math.round(14 * s),
              paddingVertical: Math.round(12 * s),
              borderRadius: radius.tile,
            },
          ]}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••••••"
          placeholderTextColor={text.muted}
          accessibilityLabel="Password"
          editable={!busy}
        />

        {error ? (
          <Text style={[styles.error, { fontSize: Math.round(12.5 * s), marginTop: Math.round(10 * s) }]}>
            {error}
          </Text>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            {
              borderRadius: radius.pill,
              paddingVertical: Math.round(13 * s),
              marginTop: Math.round(20 * s),
              opacity: busy ? 0.6 : pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>Login to Account</Text>
        </Pressable>

        <View style={[styles.switchRow, { marginTop: Math.round(16 * s) }]}>
          <Text style={[styles.switchText, { fontSize: Math.round(13 * s) }]}>New to FoodieGo?</Text>
          <Pressable
            onPress={() => router.push('/signup')}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={[styles.switchLink, { fontSize: Math.round(13 * s) }]}>Create an account</Text>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.deep },
  card: { backgroundColor: surface.raised, alignSelf: 'center' },
  logo: { backgroundColor: surface.subtle, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.6 },
  tagline: { color: text.secondary, marginTop: 4 },
  label: { color: text.primary, fontWeight: '700' },
  input: { backgroundColor: surface.subtle, color: text.primary, borderWidth: 1, borderColor: surface.line, paddingHorizontal: 14 },
  error: { color: '#B3261E', fontWeight: '600' },
  cta: { backgroundColor: brand.deep, alignItems: 'center' },
  ctaText: { color: text.onDark, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' },
  switchText: { color: text.secondary },
  switchLink: { color: brand.mid, fontWeight: '800' },
});
