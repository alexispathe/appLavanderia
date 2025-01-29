// app/home/index.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const menuOptions = [
    {
      title: 'Agregar Nuevo Ítem',
      description: 'Añadir diferentes tipos de prendas (e.g., chamarras, toallas, cobijas, peluches, etc.)',
      navigateTo: '/items/addItem', 
    },
    {
      title: 'Listar Ítems',
      description: 'Ver y gestionar los ítems existentes',
      navigateTo: '/items/index', 
    },
    {
      title: 'Gestionar Órdenes',
      description: 'Crear y gestionar órdenes de lavado',
      navigateTo: '/orders/index', 
    },
    {
      title: 'Perfil',
      description: 'Ver y editar tu perfil',
      navigateTo: '/profile/index', 
    },
    // Puedes agregar más opciones aquí según tus necesidades
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
