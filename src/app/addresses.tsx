import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { FormScreen, Field, PrimaryButton, GhostButton, SelectCard, SectionLabel } from '../components/forms';
import { useProfile } from '../store/profile';
import { useLayout } from '../responsive';
import { text } from '../theme';

/** Add / remove delivery addresses and choose which one is primary. */
export default function Addresses() {
  const { addresses, addAddress, removeAddress, setPrimaryAddress } = useProfile();
  const { s } = useLayout();

  const [label, setLabel] = useState('');
  const [line, setLine] = useState('');
  const [touched, setTouched] = useState(false);

  const labelOk = label.trim().length >= 2;
  const lineOk = line.trim().length >= 8;
  const canAdd = labelOk && lineOk;

  const submit = () => {
    setTouched(true);
    if (!canAdd) return;
    addAddress({ label: label.trim(), line: line.trim(), isPrimary: false });
    setLabel('');
    setLine('');
    setTouched(false);
  };

  return (
    <FormScreen
      title="Delivery Addresses"
      sub="Configure shipping details for home, work or alternative hubs."
    >
      <SectionLabel>Saved Addresses</SectionLabel>
      {addresses.length === 0 ? (
        <Text style={[styles.empty, { fontSize: Math.round(13.5 * s) }]}>
          No addresses saved yet. Add one below.
        </Text>
      ) : (
        addresses.map((a) => (
          <SelectCard
            key={a.id}
            title={a.isPrimary ? `${a.label} • Primary` : a.label}
            sub={a.line}
            selected={a.isPrimary}
            onPress={() => setPrimaryAddress(a.id)}
            action={
              addresses.length > 1 || !a.isPrimary
                ? { label: 'Remove', onPress: () => removeAddress(a.id) }
                : undefined
            }
          />
        ))
      )}

      <SectionLabel>Add a New Address</SectionLabel>
      <Field
        label="Label"
        value={label}
        onChangeText={setLabel}
        placeholder="Home, Work, ..."
        autoCapitalize="words"
        invalid={touched && !labelOk}
      />
      <Field
        label="Full Address"
        value={line}
        onChangeText={setLine}
        placeholder="Street, barangay, city, postal code"
        autoCapitalize="words"
        invalid={touched && !lineOk}
      />

      <PrimaryButton label="Add Address" onPress={submit} disabled={!canAdd} />
      <GhostButton label="Clear Form" onPress={() => { setLabel(''); setLine(''); setTouched(false); }} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  empty: { color: text.muted, marginBottom: 8 },
});
