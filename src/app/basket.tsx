import { View, Text, StyleSheet } from 'react-native';
import Shell from '../components/Shell';
import { TwoPane, CartLineRow, ScreenHeading } from '../components/TwoPane';
import { text, radius } from '../theme';
import { useLayout } from '../responsive';
import { useCart } from '../store/cart';

export default function Basket() {
  const { s } = useLayout();
  const cart = useCart();

  return (
    <Shell>
      <TwoPane ctaLabel="Proceed to Checkout">
        <ScreenHeading title="My Basket" sub="Review your culinary selections before completing checkout." />

        {cart.lines.length === 0 ? (
          <Text style={[styles.empty, { fontSize: Math.round(14 * s) }]}>Your basket is empty.</Text>
        ) : (
          cart.lines.map((line) => <CartLineRow key={line.dish.id} line={line} />)
        )}
      </TwoPane>
    </Shell>
  );
}

const styles = StyleSheet.create({
  empty: { color: text.muted },
});
