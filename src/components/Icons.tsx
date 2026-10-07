import { View, Text } from 'react-native';
import { brand, text } from '../theme';

/**
 * Minimal line-icon set drawn with plain Views so the prototype needs no icon
 * font dependency (keeps it compatible with Expo Go without a dev build).
 * Each icon is a 2px-stroked glyph approximating the Figma outline icons.
 */

const stroke = 2;
const dim = 20;

type Props = { size?: number; color?: string };

function Box({ size, style }: { size: number; style: any }) {
  return <View style={[{ width: size, height: size }, style]} />;
}

export function HomeIcon({ size = dim, color = 'currentColor' }: Props & { color?: string }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'flex-end', alignItems: 'center' }}>
      {/* roof */}
      <View
        style={{
          width: 0, height: 0,
          borderLeftWidth: size * 0.42, borderRightWidth: size * 0.42, borderBottomWidth: size * 0.28,
          borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
        }}
      />
      {/* body */}
      <View
        style={{
          width: size * 0.6, height: size * 0.4, borderWidth: stroke, borderTopWidth: 0,
          borderColor: color, backgroundColor: 'transparent',
        }}
      />
      {/* door */}
      <View style={{ position: 'absolute', bottom: 0, width: size * 0.2, height: size * 0.24, backgroundColor: color }} />
    </View>
  );
}

export function BagIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={{
          width: size * 0.32, height: size * 0.2, borderWidth: stroke, borderBottomWidth: 0,
          borderTopLeftRadius: size * 0.16, borderTopRightRadius: size * 0.16, borderColor: color,
        }}
      />
      <View style={{ width: size * 0.66, height: size * 0.5, borderWidth: stroke, borderColor: color, borderBottomLeftRadius: size * 0.1, borderBottomRightRadius: size * 0.1, marginTop: -size * 0.02 }} />
    </View>
  );
}

export function CartIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      {/* handle */}
      <View style={{ position: 'absolute', top: size * 0.14, left: size * 0.08, width: size * 0.26, height: stroke, backgroundColor: color }} />
      <View style={{ position: 'absolute', top: size * 0.14, left: size * 0.08, width: stroke, height: size * 0.16, backgroundColor: color }} />
      {/* basket */}
      <View style={{ marginTop: size * 0.12, width: size * 0.66, height: size * 0.4, borderWidth: stroke, borderTopWidth: 0, borderColor: color, borderBottomLeftRadius: size * 0.08, borderBottomRightRadius: size * 0.08 }} />
      {/* wheels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.48, marginTop: size * 0.05, paddingHorizontal: size * 0.05 }}>
        <View style={{ width: stroke * 1.6, height: stroke * 1.6, borderRadius: 4, backgroundColor: color }} />
        <View style={{ width: stroke * 1.6, height: stroke * 1.6, borderRadius: 4, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function UserIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View style={{ width: size * 0.38, height: size * 0.38, borderRadius: size, borderWidth: stroke, borderColor: color, marginTop: size * 0.1 }} />
      <View style={{ width: size * 0.72, height: size * 0.36, borderWidth: stroke, borderColor: color, borderBottomWidth: 0, borderTopLeftRadius: size, borderTopRightRadius: size, marginTop: size * 0.06 }} />
    </View>
  );
}

export function PlusIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size * 0.66, height: stroke, backgroundColor: color }} />
      <View style={{ position: 'absolute', width: stroke, height: size * 0.66, backgroundColor: color }} />
    </View>
  );
}

export function MinusIcon({ size = dim, color = 'currentColor' }: Props) {
  return <View style={{ width: size * 0.66, height: stroke, backgroundColor: color }} />;
}

export function ChevronIcon({ size = dim, color = 'currentColor', dir = 'right' }: Props & { dir?: 'left' | 'right' }) {
  return (
    <View
      style={{
        width: size * 0.42, height: size * 0.42,
        borderTopWidth: stroke, borderRightWidth: stroke, borderColor: color,
        transform: [{ rotate: dir === 'right' ? '45deg' : '-135deg' }],
      }}
    />
  );
}

export function PinIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View style={{ width: size * 0.7, height: size * 0.7, borderRadius: size, borderWidth: stroke, borderColor: color, marginTop: size * 0.1 }} />
      <View style={{ position: 'absolute', top: size * 0.4, width: stroke * 1.6, height: stroke * 1.6, borderRadius: 4, backgroundColor: color }} />
    </View>
  );
}

export function CardIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      <View style={{ width: size, height: size * 0.72, borderWidth: stroke, borderColor: color, borderRadius: 3 }} />
      <View style={{ position: 'absolute', top: size * 0.3, width: size, height: stroke, backgroundColor: color }} />
    </View>
  );
}

export function ListIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: size * 0.08 }}>
          <View style={{ width: size * 0.12, height: stroke, backgroundColor: color, marginRight: size * 0.2 }} />
          <View style={{ width: size * 0.6, height: stroke, backgroundColor: color }} />
        </View>
      ))}
    </View>
  );
}

export function SlidersIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      {[0.25, 0.55, 0.85].map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: size * 0.1 }}>
          <View style={{ width: size, height: stroke, backgroundColor: color }} />
          <View
            style={{
              position: 'absolute', left: size * t - stroke * 1.5, width: stroke * 3, height: stroke * 3,
              borderRadius: 4, backgroundColor: color,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export function CheckIcon({ size = dim, color = 'currentColor' }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.46, height: size * 0.78, borderRightWidth: stroke + 0.5, borderBottomWidth: stroke + 0.5,
          borderColor: color, transform: [{ rotate: '45deg' }], marginTop: -size * 0.1,
        }}
      />
    </View>
  );
}

export function StarIcon({ size = dim, color = '#E8A317' }: Props) {
  return <Text style={{ fontSize: size * 0.8, color }}>★</Text>;
}

/**
 * FoodieGo mark: a fork and knife crossed into an X, as drawn in the Figma
 * logo. Previously this drew two upright bars, which read as "||" rather than
 * crossed cutlery.
 */
export function UtensilsIcon({ size = dim, color = 'currentColor' }: Props) {
  const bar = Math.max(1.5, size * 0.09);
  const len = size * 0.74;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* knife blade, leaning one way */}
      <View
        style={{
          position: 'absolute',
          width: len,
          height: bar,
          borderRadius: bar,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      {/* fork handle, leaning the other */}
      <View
        style={{
          position: 'absolute',
          width: len,
          height: bar,
          borderRadius: bar,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* fork tines at the lower-left tip */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.06,
          left: size * 0.06,
          width: bar,
          height: size * 0.3,
          borderRadius: bar,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      {/* knife tip at the upper-right */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.06,
          right: size * 0.06,
          width: bar * 1.4,
          height: size * 0.26,
          borderRadius: bar,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

/**
 * Category glyphs. Every case renders inside an identical `size x size` box so
 * the pills line up on one optical baseline - previously the glyphs had
 * different intrinsic sizes (the rotated pizza overflowed its wrapper by 6px)
 * which made the row look ragged.
 */
export function CategoryIcon({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const frame = { width: size, height: size, alignItems: 'center' as const, justifyContent: 'center' as const };

  switch (name) {
    // stacked bun / patty / bun
    case 'Burgers':
      return (
        <View style={[frame, { justifyContent: 'center' }]}>
          <View style={{ width: size * 0.78, height: size * 0.2, borderTopLeftRadius: size * 0.13, borderTopRightRadius: size * 0.13, backgroundColor: color }} />
          <View style={{ width: size * 0.82, height: size * 0.15, borderRadius: size * 0.06, backgroundColor: color, marginTop: size * 0.07 }} />
          <View style={{ width: size * 0.78, height: size * 0.2, borderBottomLeftRadius: size * 0.13, borderBottomRightRadius: size * 0.13, backgroundColor: color, marginTop: size * 0.07 }} />
        </View>
      );
    // slice pointing down, with a crust band across the top
    case 'Pizza':
      return (
        <View style={frame}>
          <View style={{ width: size * 0.7, height: size * 0.15, borderRadius: size * 0.07, backgroundColor: color, marginBottom: -size * 0.02 }} />
          <View
            style={{
              width: 0, height: 0,
              borderLeftWidth: size * 0.33, borderRightWidth: size * 0.33, borderTopWidth: size * 0.6,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color,
            }}
          />
        </View>
      );
    // maki roll: outer ring with a filling
    case 'Sushi':
      return (
        <View style={frame}>
          <View style={{ width: size * 0.82, height: size * 0.82, borderRadius: size * 0.41, borderWidth: Math.max(1.5, size * 0.09), borderColor: color }} />
          <View style={{ position: 'absolute', width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color }} />
        </View>
      );
    // layered cake slice with a cherry on top
    case 'Desserts':
      return (
        <View style={[frame, { justifyContent: 'flex-end' }]}>
          <View style={{ width: size * 0.14, height: size * 0.14, borderRadius: size * 0.07, backgroundColor: color, marginBottom: -size * 0.03 }} />
          <View style={{ width: size * 0.66, height: size * 0.42, borderBottomLeftRadius: size * 0.07, borderBottomRightRadius: size * 0.07, backgroundColor: color }} />
          <View style={{ width: size * 0.82, height: size * 0.16, borderRadius: size * 0.05, backgroundColor: color, marginTop: size * 0.06 }} />
        </View>
      );
    // cup with a lid and a straw
    default:
      return (
        <View style={[frame, { justifyContent: 'flex-end' }]}>
          <View style={{ position: 'absolute', top: size * 0.04, right: size * 0.28, width: Math.max(1.5, size * 0.08), height: size * 0.34, backgroundColor: color, transform: [{ rotate: '18deg' }] }} />
          <View style={{ width: size * 0.5, height: Math.max(1.5, size * 0.08), backgroundColor: color, marginBottom: size * 0.03 }} />
          <View style={{ width: size * 0.4, height: size * 0.5, borderWidth: Math.max(1.5, size * 0.09), borderTopWidth: 0, borderColor: color, borderBottomLeftRadius: size * 0.07, borderBottomRightRadius: size * 0.07 }} />
        </View>
      );
  }
}

export const iconColorDefault = text.onDark;
export const iconColorActive = brand.deep;
