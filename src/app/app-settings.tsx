import { Text, View } from 'react-native';
import { FormScreen, ToggleRow, GhostButton, Card, SectionLabel } from '../components/forms';
import { useProfile, PrefKey } from '../store/profile';
import { useLayout } from '../responsive';
import { text } from '../theme';

type Row = { key: PrefKey; title: string; sub: string };

const NOTIFICATIONS: Row[] = [
  { key: 'pushEnabled', title: 'Push Notifications', sub: 'Master switch for every alert' },
  { key: 'orderUpdates', title: 'Order Updates', sub: 'Status changes from confirmed to delivered' },
  { key: 'promos', title: 'Promotions & Offers', sub: 'New dishes and limited-time discounts' },
  { key: 'smsReceipts', title: 'SMS Receipts', sub: 'Text a receipt after every delivery' },
];

const CONFIGURATION: Row[] = [
  { key: 'bedtimeTracker', title: 'Bedtime Tracker', sub: 'Remind you to order before closing time' },
  { key: 'highQualityImages', title: 'High Quality Images', sub: 'Load menu photos at full resolution' },
  { key: 'analytics', title: 'Usage Analytics', sub: 'Share anonymous usage data to improve the app' },
];

/** App configuration + notification preferences. */
export default function AppSettings() {
  const { prefs, setPref, resetPrefs } = useProfile();
  const { s } = useLayout();

  const on = NOTIFICATIONS.filter((r) => prefs[r.key]).length;
  const masterOff = !prefs.pushEnabled;

  // Notification sub-toggles are inert while the master switch is off.
  const rows = (list: Row[]) =>
    list.map((r, i) => {
      const locked = r.key !== 'pushEnabled' && masterOff;
      return (
        <ToggleRow
          key={r.key}
          title={r.title}
          sub={locked ? 'Turn on push notifications to change this' : r.sub}
          value={prefs[r.key]}
          disabled={locked}
          onValueChange={(v) => setPref(r.key, v)}
          isLast={i === list.length - 1}
        />
      );
    });

  return (
    <FormScreen
      title="App Configuration"
      sub="Manage alarms, bedtime trackers and push updates."
    >
      <SectionLabel>Notifications</SectionLabel>
      <Card style={{ paddingVertical: 2 }}>
        {rows(NOTIFICATIONS)}
        <View style={styles.count}>
          <Text style={[styles.countText, { fontSize: Math.round(12 * s) }]}>
            {on} of {NOTIFICATIONS.length} notification channels active
          </Text>
        </View>
      </Card>

      <SectionLabel>Configuration</SectionLabel>
      <Card style={{ paddingVertical: 2 }}>
        {rows(CONFIGURATION)}
      </Card>

      <GhostButton label="Reset to Defaults" onPress={resetPrefs} />
    </FormScreen>
  );
}

const styles = {
  count: { paddingVertical: 10 },
  countText: { color: text.muted, fontWeight: '600' },
} as const;
