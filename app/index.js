// app/index.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bienvenido a la App</Title>
      <Button mode="contained" onPress={() => router.push('/(auth)/login')} style={styles.button}>
        Ir a Login
      </Button>
      <Button mode="contained" onPress={() => router.push('/(auth)/register')} style={styles.button}>
        Crear Cuenta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 20 },
  button: { marginVertical: 5 },
});
