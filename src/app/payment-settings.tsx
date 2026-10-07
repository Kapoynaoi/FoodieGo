import { useState } from 'react';
import { Text } from 'react-native';
import { FormScreen, Field, PrimaryButton, GhostButton, SelectCard, SectionLabel } from '../components/forms';
import { useProfile } from '../store/profile';
import { useLayout } from '../responsive';
import { text } from '../theme';

/** Manage saved payment methods and pick the default. */
export default function PaymentSettings() {
  const { payments, addPayment, removePayment, setDefaultPayment } = useProfile();
  const { s } = useLayout();

  const [label, setLabel] = useState('');
  const [sub, setSub] = useState('');
  const [touched, setTouched] = useState(false);

  const labelOk = label.trim().length >= 2;
  const subOk = sub.replace(/\D/g, '').length >= 4;
  const canAdd = labelOk && subOk;

  const submit = () => {
    setTouched(true);
    if (!canAdd) return;
    addPayment({ label: label.trim(), sub: sub.trim(), kind: 'card', isDefault: false });
    setLabel('');
    setSub('');
    setTouched(false);
  };

  return (
    <FormScreen title="Payment Settings" sub="Visa, Mastercard and digital wallet link options.">
      <SectionLabel>Saved Methods</SectionLabel>
      {payments.map((p) => (
        <SelectCard
          key={p.id}
          title={p.isDefault ? `${p.label} • Default` : p.label}
          sub={p.sub}
          selected={p.isDefault}
          onPress={() => setDefaultPayment(p.id)}
          action={payments.length > 1 ? { label: 'Remove', onPress: () => removePayment(p.id) } : undefined}
        />
      ))}

      <SectionLabel>Link a New Card</SectionLabel>
      <Field
        label="Card Nickname"
        value={label}
        onChangeText={setLabel}
        placeholder="Visa, GCash, Maya ..."
        autoCapitalize="words"
        invalid={touched && !labelOk}
      />
      <Field
        label="Card Number"
        value={sub}
        onChangeText={setSub}
        placeholder="4242 4242 4242 4242"
        keyboardType="phone-pad"
        invalid={touched && !subOk}
      />

      <Text style={[styles.note, { fontSize: Math.round(12 * s) }]}>
        Card details are stored on-device for this prototype only.
      </Text>

      <PrimaryButton label="Link Card" onPress={submit} disabled={!canAdd} />
      <GhostButton label="Clear Form" onPress={() => { setLabel(''); setSub(''); setTouched(false); }} />
    </FormScreen>
  );
}

const styles = {
  note: { color: text.muted, marginTop: 2 },
} as const;
