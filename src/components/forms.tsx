import { View, Text, TextInput, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Shell from './Shell';
import { ChevronIcon, CheckIcon } from './Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';

/**
 * Shared building blocks for the editable profile sections. Kept in one place
 * so Edit Profile, Addresses, Payment and Settings screens stay declarative.
 */

/** Standard scrolling screen with the shell, heading and back affordance. */
export function FormScreen({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { s, gutter } = useLayout();
  const router = useRouter();

  return (
    <Shell>
      <ScrollView
        contentContainerStyle={{
          padding: gutter,
          paddingTop: insets.top + gutter,
          paddingBottom: insets.bottom + gutter * 2,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          style={({ pressed }) => [
            styles.back,
            {
              width: Math.round(38 * s),
              height: Math.round(38 * s),
              borderRadius: 19,
              marginBottom: Math.round(14 * s),
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ChevronIcon size={Math.round(18 * s)} color={brand.deep} dir="left" />
        </Pressable>

        <Text style={[styles.title, { fontSize: Math.round(24 * s) }]}>{title}</Text>
        {sub ? (
          <Text style={[styles.sub, { fontSize: Math.round(13.5 * s), marginBottom: Math.round(20 * s) }]}>
            {sub}
          </Text>
        ) : (
          <View style={{ height: Math.round(20 * s) }} />
        )}

        {children}
      </ScrollView>
    </Shell>
  );
}

/** Section heading, e.g. "Delivery Location". */
export function SectionLabel({ children }: { children: string }) {
  const { s } = useLayout();
  return (
    <Text style={[styles.section, { fontSize: Math.round(15.5 * s), marginBottom: Math.round(10 * s), marginTop: Math.round(4 * s) }]}>
      {children}
    </Text>
  );
}

/** Labelled text input. */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
  autoCapitalize = 'none',
  invalid,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  invalid?: boolean;
}) {
  const { s } = useLayout();
  return (
    <View style={{ marginBottom: Math.round(14 * s) }}>
      <Text style={[styles.label, { fontSize: Math.round(12.5 * s), marginBottom: 6 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={text.muted}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            fontSize: Math.round(14 * s),
            paddingVertical: Math.round(12 * s),
            paddingHorizontal: 14,
            borderRadius: radius.tile,
            borderColor: invalid ? '#B3261E' : surface.line,
          },
        ]}
      />
      {invalid ? (
        <Text style={[styles.error, { fontSize: Math.round(11.5 * s), marginTop: 5 }]}>
          Please check this field
        </Text>
      ) : null}
    </View>
  );
}

/** Filled pill button. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'solid',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'solid' | 'danger';
}) {
  const { s } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        {
          borderRadius: radius.pill,
          paddingVertical: Math.round(13 * s),
          marginTop: Math.round(18 * s),
          backgroundColor: tone === 'danger' ? surface.subtle : brand.deep,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.btnText, { fontSize: Math.round(15 * s), color: tone === 'danger' ? '#B3261E' : surface.raised }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Outlined secondary button. */
export function GhostButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  const { s } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        {
          borderRadius: radius.pill,
          paddingVertical: Math.round(13 * s),
          marginTop: Math.round(12 * s),
          borderWidth: 1.5,
          borderColor: surface.line,
          backgroundColor: surface.raised,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.btnText, { fontSize: Math.round(15 * s), color: brand.deep }]}>{label}</Text>
    </Pressable>
  );
}

/** A labelled row with a trailing switch. */
export function ToggleRow({
  title,
  sub,
  value,
  onValueChange,
  isLast,
  disabled,
}: {
  title: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
  disabled?: boolean;
}) {
  const { s } = useLayout();
  return (
    <View
      style={[
        styles.row,
        {
          paddingVertical: Math.round(13 * s),
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: surface.line,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[styles.rowTitle, { fontSize: Math.round(14.5 * s) }]}>{title}</Text>
        {sub ? <Text style={[styles.rowSub, { fontSize: Math.round(12 * s), marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        trackColor={{ false: surface.line, true: brand.mid }}
        thumbColor={surface.raised}
        ios_backgroundColor={surface.line}
      />
    </View>
  );
}

/** Selectable card showing a check when chosen. */
export function SelectCard({
  title,
  sub,
  selected,
  onPress,
  action,
}: {
  title: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
  action?: { label: string; onPress: () => void };
}) {
  const { s } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.select,
        {
          padding: Math.round(14 * s),
          borderRadius: radius.card,
          marginBottom: Math.round(10 * s),
          borderColor: selected ? brand.deep : surface.line,
          backgroundColor: surface.raised,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={[styles.rowTitle, { fontSize: Math.round(14.5 * s) }]} numberOfLines={1}>
          {title}
        </Text>
        {sub ? (
          <Text style={[styles.rowSub, { fontSize: Math.round(12 * s), marginTop: 3, lineHeight: Math.round(17 * s) }]}>
            {sub}
          </Text>
        ) : null}
      </View>

      {action ? (
        <Pressable
          onPress={action.onPress}
          hitSlop={8}
          accessibilityRole="button"
          style={({ pressed }) => [styles.remove, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      ) : selected ? (
        <View style={styles.check}>
          <CheckIcon size={13} color={surface.raised} />
        </View>
      ) : (
        <View style={styles.radio} />
      )}
    </Pressable>
  );
}

/** Grouping container for rows / cards. */
export function Card({ children, style }: { children: ReactNode; style?: any }) {
  const { s } = useLayout();
  return (
    <View style={[styles.card, { borderRadius: radius.card, padding: Math.round(14 * s) }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  back: { backgroundColor: surface.raised, alignItems: 'center', justifyContent: 'center' },
  title: { color: brand.deep, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: text.secondary, marginTop: 4 },
  section: { color: brand.deep, fontWeight: '800' },
  label: { color: text.primary, fontWeight: '700' },
  input: { backgroundColor: surface.raised, color: text.primary, borderWidth: 1 },
  error: { color: '#B3261E' },
  btn: { alignItems: 'center' },
  btnText: { fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { color: text.primary, fontWeight: '700' },
  rowSub: { color: text.secondary },
  select: { flexDirection: 'row', alignItems: 'center', borderWidth: 2 },
  remove: { paddingHorizontal: 10, paddingVertical: 6 },
  removeText: { color: '#B3261E', fontWeight: '700', fontSize: 12.5 },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: brand.deep, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: surface.line },
  card: { backgroundColor: surface.raised },
});
