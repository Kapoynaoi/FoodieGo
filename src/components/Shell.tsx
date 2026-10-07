import { View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { NavRail, NavBar } from './nav';
import { useLayout } from '../responsive';
import { surface } from '../theme';

/**
 * Screen shell that adapts to orientation:
 *  - landscape: fixed dark rail on the left, content fills the rest
 *  - portrait:  content on top, tab bar pinned to the bottom
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { navMode, railWidth } = useLayout();

  if (navMode === 'bar') {
    return (
      <View style={styles.stack}>
        <View style={styles.content}>{children}</View>
        <NavBar />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={{ width: railWidth }} />
      <NavRail />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: surface.canvas },
  // Portrait stacks the content above the tab bar. This has to be a column:
  // sharing the landscape row root placed the tab bar beside the content at
  // x = contentWidth, which pushed it off-screen on a phone.
  stack: { flex: 1, flexDirection: 'column', backgroundColor: surface.canvas },
  content: { flex: 1, backgroundColor: surface.canvas },
});