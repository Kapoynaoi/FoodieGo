import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../store/cart';
import { OrdersProvider } from '../store/orders';
import { AuthProvider, useAuth } from '../store/auth';
import { ProfileProvider } from '../store/profile';
import { brand } from '../theme';

/**
 * Routes reachable without an account.
 *
 * Compared against the pathname directly: useSegments() yields ['/'] at the
 * root, and naively prefixing it with '/' yields '//', which never matches -
 * that sent the gate into a redirect loop.
 */
const isPublicPath = (pathname: string) => pathname === '/' || pathname === '/signup';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = isPublicPath(pathname);
  const shouldRedirect = !isAuthed ? !isPublic : isPublic;

  // Navigate from an effect rather than rendering <Redirect>. Redirecting
  // during render re-enters the navigator and can loop.
  useEffect(() => {
    if (!shouldRedirect) return;
    router.replace(isAuthed ? '/home' : '/');
  }, [shouldRedirect, isAuthed, pathname, router]);

  // Hold the screen back until the navigation lands, so protected content is
  // never briefly visible while signed out.
  if (shouldRedirect) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <ProfileProvider>
            <StatusBar style="light" />
            <AuthGate>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: brand.deep },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="home" />
                <Stack.Screen name="dish/[id]" />
                <Stack.Screen name="basket" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="order-confirmed" />
                <Stack.Screen name="order-tracking" />
                <Stack.Screen name="orders" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="addresses" />
                <Stack.Screen name="payment-settings" />
                <Stack.Screen name="app-settings" />
              </Stack>
            </AuthGate>
            </ProfileProvider>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
