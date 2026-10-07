/**
 * Design tokens sampled directly from the FoodieGo Figma prototype frames.
 * Every hex value below was read off a captured frame with a pixel probe,
 * not eyeballed.
 */

/** The deep forest green used for the sidebar, headings and primary buttons. */
export const brand = {
  /** Sidebar background, primary buttons, logo disc. */
  deep: '#073306',
  /** Mid green - prices, active accents, icon glyphs. */
  mid: '#3E613C',
  /** Muted green - secondary icon strokes, selected pill text. */
  soft: '#597958',
} as const;

/** Surfaces. */
export const surface = {
  /** App background behind the content column. */
  canvas: '#D3DED0',
  /** Cards, sidebar active pill, input fields. */
  raised: '#FFFFFF',
  /** Inset panels - order summary blocks, CLASSIC badge, success card. */
  subtle: '#E3ECE0',
  /** Hairline dividers. */
  line: '#C6D2C1',
} as const;

/** Text. */
export const text = {
  primary: '#1A2E18',
  secondary: '#5E6B5C',
  muted: '#879684',
  onDark: '#FFFFFF',
  onDarkMuted: '#A9BBA6',
} as const;

/** Status pill colours used across orders, tracking and tracking timeline. */
export const status = {
  preparing: { bg: '#E3ECE0', fg: '#3E613C' },
  delivering: { bg: '#FDF3D6', fg: '#8A6A12' },
  confirmed: { bg: '#E3ECE0', fg: '#3E613C' },
  pending: { bg: '#EDEFEA', fg: '#879684' },
} as const;

/** Corner radii, read from the card corners in the frames. */
export const radius = {
  card: 18,
  pill: 999,
  tile: 12,
  cardLarge: 22,
} as const;

/**
 * The design is authored at 886x574. Values scale from that reference so the
 * layout holds together on both phone-sized and tablet-sized landscape windows.
 */
export const REF = { width: 886, height: 574 } as const;

/** Sidebar width in the design. */
export const SIDEBAR_W = 260;

/** Scale a design-space value against the live window width. */
export function scaleWidth(width: number) {
  return Math.min(1.35, Math.max(0.78, width / REF.width));
}
