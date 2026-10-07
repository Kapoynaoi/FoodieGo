import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Orientation-aware layout metrics.
 *
 * The Figma design is a 886x574 landscape frame with a fixed left rail. That
 * does not survive rotation, so this hook derives everything from the live
 * window instead: in portrait the rail is replaced by a bottom tab bar and
 * side-by-side panes stack.
 */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** How the primary navigation is presented. */
export type NavMode = 'rail' | 'bar';

export type Layout = {
  width: number;
  height: number;
  isPortrait: boolean;
  /** Small phone in either orientation. */
  isCompact: boolean;
  /** Tablet / desktop-sized window. */
  isExpanded: boolean;
  navMode: NavMode;
  /** Type + spacing scale multiplier. */
  s: number;
  /** Standard screen padding. */
  gutter: number;
  /** Sidebar width. 0 when using the bottom bar. */
  railWidth: number;
  /** Bottom tab bar height, excluding the home-indicator inset. */
  barHeight: number;
  /** Columns for a card grid given the measured content width. */
  columnsFor: (contentWidth: number) => number;
};

export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isPortrait = height > width;
  const isCompact = Math.min(width, height) < 380;
  const isExpanded = Math.min(width, height) >= 700;

  // Scale against the reference in the orientation we are actually in, so a
  // rotated phone lands on roughly the same visual size rather than a tiny
  // layout stretched across a wide window.
  const base = isPortrait ? 480 : 886;
  const lo = isPortrait ? 0.9 : 0.74;
  const hi = isPortrait ? 1.7 : 1.28;
  const s = clamp(width / base, lo, hi);

  const gutter = Math.round(clamp(width * 0.032, 16, 34));
  const railWidth = isPortrait ? 0 : Math.round(clamp(width * 0.22, 190, 268));
  const barHeight = isPortrait ? Math.round(clamp(height * 0.075, 54, 76)) : 0;

  const columnsFor = (contentWidth: number) => {
    const minCard = isPortrait ? 280 : 250;
    const gap = gutter;
    const fit = Math.floor((contentWidth + gap) / (minCard + gap));
    if (isPortrait) return clamp(fit, 1, isExpanded ? 2 : 2);
    return clamp(fit, 2, 4);
  };

  return {
    width,
    height,
    isPortrait,
    isCompact,
    isExpanded,
    navMode: isPortrait ? 'bar' : 'rail',
    s,
    gutter,
    railWidth,
    barHeight,
    columnsFor,
  };
}
