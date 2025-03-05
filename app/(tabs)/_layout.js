// app/(tabs)/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders/index"  // Ajustado para que coincida con la estructura de carpetas
        options={{
          title: 'Órdenes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="items/index"  // Ajustado para que coincida con la estructura de carpetas
        options={{
          title: 'Ítems',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="boxes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance/index"  // Ajustado para que coincida con la estructura de carpetas
        options={{
          title: 'Finanzas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="finance" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
        
      />
      <Tabs.Screen
        name="finance/closeCash"
        options={{
          title: 'Cierre caja',
          tabBarIcon: ({ color, size }) => <Ionicons name="lock-closed-outline" size={size} color={color} />,
        }}
        
      />
    </Tabs>
  );
}
