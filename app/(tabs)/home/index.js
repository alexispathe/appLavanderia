// app/(tabs)/home/index.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const menuOptions = [
    {
      title: 'Listar Ítems',
      description: 'Ver y gestionar los ítems existentes',
      navigateTo: '/items/index',
    },
    {
      title: 'Gestionar Órdenes',
      description: 'Crear y gestionar órdenes de lavado',
      navigateTo: '/(tabs)/orders', // Si prefieres ir directo a la pantalla de Órdenes
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      {menuOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => router.push(option.navigateTo)}
        >
          <Text style={styles.menuTitle}>{option.title}</Text>
          <Text style={styles.menuDescription}>{option.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  menuItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#e6f7ff',
  },
  menuTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  menuDescription: { 
    fontSize: 14, 
    color: '#666' 
  },
});
