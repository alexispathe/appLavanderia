// app/_layout.js
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Evita que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Muestra pantalla en blanco mientras cargan las fuentes
  }

  return (
    <AuthProvider>
      <AppContent colorScheme={colorScheme} />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

function AppContent({ colorScheme }) {
  const { loading } = useAuth();

  if (loading) {
    return null; // Puedes reemplazar esto con una pantalla de carga personalizada
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </ThemeProvider>
  );
}

function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Rutas adicionales fuera de las pestañas */}
          <Stack.Screen name="items/addItem" options={{ title: 'Agregar Ítem' }} />
          <Stack.Screen name="items/editItem" options={{ title: 'Editar Ítem' }} />
          <Stack.Screen name="items/index" options={{ title: 'Listar Ítems' }} />
          <Stack.Screen name="orders/index" options={{ title: 'Gestionar Órdenes' }} />
          <Stack.Screen name="orders/orderDetails" options={{ title: 'Detalles de Orden' }} />
          <Stack.Screen name="orders/updateOrder" options={{ title: 'Actualizar Orden' }} />
          <Stack.Screen name="orders/newOrder/addClient" options={{ title: 'Agregar Cliente' }} />
          <Stack.Screen name="orders/newOrder/chooseItems" options={{ title: 'Elegir Ítems' }} />
          <Stack.Screen name="orders/newOrder/existingClients" options={{ title: 'Clientes Existentes' }} />
          <Stack.Screen name="orders/newOrder/orderSummary" options={{ title: 'Resumen de Orden' }} />
          <Stack.Screen name="+not-found" />
        </>
      ) : (
        <>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/resetPassword" options={{ title: 'Restablecer Contraseña' }} />
          <Stack.Screen name="+not-found" />
        </>
      )}
    </Stack>
  );
}
