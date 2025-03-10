// app/_layout.js
import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useColorScheme } from '../hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

// Definición de tema personalizado para react-native-paper
const customTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#4A90E2',     // Azul calmado
    accent: '#50E3C2',      // Verde agua
    background: '#F5F5F5',  // Fondo claro
    surface: '#FFFFFF',
    text: '#333333',
  },
};

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PaperProvider theme={customTheme}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : NavigationDefaultTheme}>
          <AuthOrAppStack />
        </ThemeProvider>
      </PaperProvider>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

function AuthOrAppStack() {
  const { loading, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Stack>
        <Stack.Screen name="/index.js" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/resetPassword" options={{ title: 'Restablecer Contraseña' }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Otras pantallas extras */}
      <Stack.Screen name="(items)/addItem" options={{ title: 'Agregar Ítem' }} />
      <Stack.Screen name="(items)/editItem" options={{ title: 'Editar Ítem' }} />
      <Stack.Screen name="orders/orderDetails" options={{ title: 'Detalles de Orden' }} />
      <Stack.Screen name="orders/updateOrder" options={{ title: 'Actualizar Orden' }} />
      <Stack.Screen name="orders/newOrder/addClient" options={{ title: 'Agregar Cliente' }} />
      <Stack.Screen name="orders/newOrder/chooseItems" options={{ title: 'Elegir Ítems' }} />
      <Stack.Screen name="orders/newOrder/chooseItemDetails" options={{ title: 'Detalles del Ítem' }} />
      <Stack.Screen name="orders/newOrder/existingClients" options={{ title: 'Clientes Existentes' }} />
      <Stack.Screen name="orders/newOrder/orderSummary" options={{ title: 'Resumen de Orden' }} />
    </Stack>
  );
}
