// app/index.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App</Text>

      <Link href="/(auth)/login" style={styles.link}>
        Ir a Login
      </Link>

      <Link href="/(auth)/register" style={styles.link}>
        Crear cuenta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  link: { 
    marginTop: 8, 
    color: 'blue', 
    textAlign: 'center' 
  },
});
