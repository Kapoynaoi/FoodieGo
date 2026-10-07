import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { ChevronIcon } from '../components/Icons';
import { useAuth } from '../store/auth';

/** Creates a local account and signs the new user straight in. */
export default function SignUp() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { s, gutter, isPortrait } = useLayout();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const cardW = Math.min(width - gutter * 2, 470 * s);

  const mismatch = confirm.length > 0 && confirm !== password;

  const submit = () => {
    if (busy) return;
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const res = signUp({ name, email, phone, password });
    setBusy(false);

    if (res.ok) {
      setError(null);
      router.replace('/home');
    } else {
      setError(res.error);
    }
  };

  const input = {
    fontSize: Math.round(14 * s),
    paddingVertical: Math.round(12 * s),
    borderRadius: radius.tile,
    marginBottom: Math.round(13 * s),
  } as const;

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
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        accessibilityRole="button"
        accessibilityLabel="Back to login"
        hitSlop={10}
        style={({ pressed }) => [
          styles.back,
          {
            width: Math.round(38 * s),
            height: Math.round(38 * s),
            borderRadius: Math.round(19 * s),
            marginBottom: Math.round(12 * s),
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <ChevronIcon size={Math.round(18 * s)} color={brand.deep} dir="left" />
      </Pressable>

      <View style={[styles.card, { width: cardW, padding: Math.round((isPortrait ? 24 : 30) * s), borderRadius: radius.cardLarge }]}>
        <Text style={[styles.title, { fontSize: Math.round(24 * s) }]}>Create Account</Text>
        <Text style={[styles.tagline, { fontSize: Math.round(13 * s), marginBottom: Math.round(20 * s) }]}>
          Register to start ordering premium meals.
        </Text>

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={clear(setName, setError)}
          style={[styles.input, input]}
          placeholder="Your full name"
          placeholderTextColor={text.muted}
          autoCapitalize="words"
          accessibilityLabel="Full Name"
          editable={!busy}
        />

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={clear(setEmail, setError)}
          style={[styles.input, input]}
          placeholder="you@email.com"
          placeholderTextColor={text.muted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          accessibilityLabel="Email Address"
          editable={!busy}
        />

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={clear(setPhone, setError)}
          style={[styles.input, input]}
          placeholder="+63 917 123 4567"
          placeholderTextColor={text.muted}
          keyboardType="phone-pad"
          accessibilityLabel="Phone Number"
          editable={!busy}
        />

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={clear(setPassword, setError)}
          style={[styles.input, input]}
          placeholder="At least 6 characters"
          placeholderTextColor={text.muted}
          secureTextEntry
          autoCapitalize="none"
          accessibilityLabel="Password"
          editable={!busy}
        />

        <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>Confirm Password</Text>
        <TextInput
          value={confirm}
          onChangeText={clear(setConfirm, setError)}
          style={[
            styles.input,
            { ...input, borderColor: mismatch ? '#B3261E' : surface.line, marginBottom: 0 },
          ]}
          placeholder="Re-enter your password"
          placeholderTextColor={text.muted}
          secureTextEntry
          autoCapitalize="none"
          accessibilityLabel="Confirm Password"
          editable={!busy}
        />

        {mismatch ? (
          <Text style={[styles.error, { fontSize: Math.round(12 * s), marginTop: Math.round(8 * s) }]}>
            Passwords do not match.
          </Text>
        ) : error ? (
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
          <Text style={[styles.ctaText, { fontSize: Math.round(15 * s) }]}>Create Account</Text>
        </Pressable>

        <View style={[styles.switchRow, { marginTop: Math.round(16 * s) }]}>
          <Text style={[styles.switchText, { fontSize: Math.round(13 * s) }]}>Already registered?</Text>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityRole="button" hitSlop={8}>
            <Text style={[styles.switchLink, { fontSize: Math.round(13 * s) }]}>Login instead</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/** Wraps a setter so editing a field also clears a stale error message. */
function clear(setter: (v: string) => void, setError: (e: string | null) => void) {
  return (v: string) => {
    setter(v);
    setError(null);
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.deep },
  back: { backgroundColor: surface.raised, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  card: { backgroundColor: surface.raised, alignSelf: 'center' },
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.5 },
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
