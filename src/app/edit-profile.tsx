import { useState } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import { FormScreen, Field, PrimaryButton, Card } from '../components/forms';
import { PhotoPicker } from '../components/ProfilePhoto';
import { useProfile } from '../store/profile';
import { useLayout } from '../responsive';
import { text, radius } from '../theme';

export default function EditProfile() {
  const { user, updateUser } = useProfile();
  const { s } = useLayout();

  // Local draft so typing never mutates shared state before Save.
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [touched, setTouched] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, '').length >= 7;
  const valid = emailOk && nameOk && phoneOk;

  const save = () => {
    setTouched(true);
    if (!valid) return;
    updateUser({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    Alert.alert('Profile updated', 'Your details have been saved.');
  };

  return (
    <FormScreen title="Edit Profile" sub="Change your username, email and default phone number.">
      <Card style={{ marginBottom: 8 }}>
        <PhotoPicker />

        <View style={[styles.divider, { marginVertical: Math.round(16 * s) }]} />

        <Field
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          invalid={touched && !nameOk}
        />
        <Field
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          keyboardType="email-address"
          invalid={touched && !emailOk}
        />
        <Field
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+63 917 123 4567"
          keyboardType="phone-pad"
          invalid={touched && !phoneOk}
        />

        <View style={[styles.tierRow, { marginTop: Math.round(4 * s) }]}>
          <Text style={[styles.tierLabel, { fontSize: Math.round(12.5 * s) }]}>Membership Tier</Text>
          <View style={[styles.tier, { backgroundColor: '#E3ECE0', borderRadius: radius.pill, paddingHorizontal: Math.round(10 * s), paddingVertical: Math.round(4 * s) }]}>
            <Text style={[styles.tierText, { fontSize: Math.round(11 * s) }]}>{user.tier}</Text>
          </View>
        </View>
      </Card>

      <PrimaryButton label="Save Changes" onPress={save} disabled={!valid} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: '#C6D2C1' },
  tierRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tierLabel: { color: text.secondary, fontWeight: '600' },
  tier: { alignSelf: 'flex-start' },
  tierText: { color: '#3E613C', fontWeight: '800', letterSpacing: 0.6 },
});
