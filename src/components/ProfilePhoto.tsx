import { useRef } from 'react';
import { View, Text, Image, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserIcon } from './Icons';
import { brand, surface, text, radius } from '../theme';
import { useLayout } from '../responsive';
import { useProfile } from '../store/profile';

/**
 * Profile picture display + picker.
 *
 * Native uses expo-image-picker (bundled with Expo Go, so no dev build needed)
 * to reach the device gallery. Web falls back to a hidden <input type="file">.
 */

/** True when a gallery / file picker is available on this platform. */
export const canPickFromDevice = Platform.OS === 'web' || !!ImagePicker.launchImageLibraryAsync;

/** Opens the platform picker and resolves with a URI, or null if cancelled. */
async function pickFromDevice(): Promise<string | null> {
  if (Platform.OS === 'web') return pickFromDeviceWeb();

  // Ask for permission first so the picker never opens just to fail.
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert(
      'Permission needed',
      'Allow access to your photos in Settings to choose a profile picture.'
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

function pickFromDeviceWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    // Covers the user dismissing the native file dialog.
    input.oncancel = () => resolve(null);

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

/** Round avatar that falls back to the person glyph when nothing is chosen. */
export function Avatar({ size, onPress, showHint }: { size: number; onPress?: () => void; showHint?: boolean }) {
  const { avatar, user } = useProfile();

  const inner = avatar ? (
    <Image
      source={{ uri: avatar }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
      accessibilityLabel={`${user.name} profile picture`}
    />
  ) : (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <UserIcon size={Math.round(size * 0.48)} color={surface.raised} />
    </View>
  );

  if (!onPress) return inner;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={showHint ? 'Choose profile picture' : 'Change profile picture'}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.8 : 1 }]}
    >
      {inner}
      <View style={[styles.badge, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, right: -2, bottom: -2 }]}>
        <Text style={[styles.badgeGlyph, { fontSize: Math.round(size * 0.2) }]}>+</Text>
      </View>
    </Pressable>
  );
}

/** Avatar plus the change/remove controls used on the Edit Profile screen. */
export function PhotoPicker() {
  const { s } = useLayout();
  const { avatar, setAvatar } = useProfile();
  const busy = useRef(false);

  const choose = async () => {
    if (busy.current) return;
    busy.current = true;

    if (!canPickFromDevice) {
      Alert.alert(
        'Photo picker unavailable',
        'This build cannot open the photo library. Restart the dev server and reload Expo Go.'
      );
      busy.current = false;
      return;
    }

    const uri = await pickFromDevice();
    if (uri) setAvatar(uri);
    busy.current = false;
  };

  return (
    <View style={[styles.row, { paddingVertical: Math.round(6 * s) }]}>
      <Avatar size={Math.round(76 * s)} onPress={choose} showHint={!avatar} />

      <View style={{ flex: 1, marginLeft: Math.round(16 * s) }}>
        <Text style={[styles.title, { fontSize: Math.round(15 * s) }]}>Profile Picture</Text>
        <Text style={[styles.sub, { fontSize: Math.round(12.5 * s), marginTop: 3, lineHeight: Math.round(17 * s) }]}>
          {canPickFromDevice
            ? 'Tap the photo to choose an image from your device.'
            : 'Photo picking is not available on this platform.'}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: Math.round(10 * s) }}>
          <Pressable
            onPress={choose}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.btn,
              {
                borderRadius: radius.pill,
                paddingHorizontal: Math.round(14 * s),
                paddingVertical: Math.round(8 * s),
                backgroundColor: brand.deep,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.btnText, { fontSize: Math.round(12.5 * s) }]}>
              {avatar ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </Pressable>

          {avatar ? (
            <Pressable
              onPress={() => setAvatar(null)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.btn,
                {
                  borderRadius: radius.pill,
                  paddingHorizontal: Math.round(14 * s),
                  paddingVertical: Math.round(8 * s),
                  marginLeft: 8,
                  borderWidth: 1.5,
                  borderColor: surface.line,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.btnText, { fontSize: Math.round(12.5 * s), color: brand.deep }]}>Remove</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  fallback: { backgroundColor: brand.deep, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    backgroundColor: brand.mid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: surface.raised,
  },
  badgeGlyph: { color: surface.raised, fontWeight: '800', marginTop: -1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { color: text.primary, fontWeight: '700' },
  sub: { color: text.secondary },
  btn: { alignItems: 'center' },
  btnText: { color: surface.raised, fontWeight: '700' },
});
