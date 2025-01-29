import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useColorScheme } from '../hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Mientras no carguen las fuentes, no mostramos la UI.
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthOrAppStack />
      </ThemeProvider>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

function AuthOrAppStack() {
  const { loading, user } = useAuth();

  // Mientras no sepamos si hay user en AsyncStorage, muestra un “loading”.
  if (loading) {
    return null; // O algún splash/loading en lugar de null.
  }

  // Si NO hay usuario logueado, mostramos el stack de autenticación.
  if (!user) {
    return (
      <Stack>
        <Stack.Screen
          name="(auth)/welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/resetPassword"
          options={{ title: 'Restablecer Contraseña' }}
        />
      </Stack>
    );
  }

  // Si SÍ hay usuario logueado, mostramos las pantallas de la app.
  return (
    <Stack>
      {/* Grupo de tabs (home, profile, etc.) */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Rutas extras fuera de las pestañas */}
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
    </Stack>
  );
}
