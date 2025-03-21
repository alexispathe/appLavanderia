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

const customTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#4A90E2',
    accent: '#50E3C2',
    background: '#F5F5F5',
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/resetPassword" options={{ headerShown: false}} />
      </Stack>
    );
  }

  return (
    <Stack>

      <Stack.Screen name="(items)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(items)/editItem" options={{ headerShown: false }} />
      <Stack.Screen name="(items)/addItem" options={{ headerShown: false }} />

      {/* Pantallas de clientes */}

      <Stack.Screen name="(clients)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(clients)/clientDetail" options={{ headerShown: false }} />
      <Stack.Screen name="(clients)/clientEdit" options={{ headerShown: false }} />


      {/* Pantallas de órdenes */}

      <Stack.Screen name="(orders)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(orders)/newOrder/index" options={{ headerShown: false }} />
      <Stack.Screen name="(orders)/orderDetails" options={{ headerShown: false }} />

      <Stack.Screen name="(reports)/index" options={{ headerShown: false }} />

      {/* Pantallas de personal */}
      <Stack.Screen name="(staff)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(staff)/addEmployee" options={{ headerShown: false }} />

    </Stack>
  );
}
