// app/orders/newOrder/index.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function NewOrderMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Nueva Orden</Title>
      <Button mode="contained" onPress={() => router.push('orders/newOrder/addClient')} style={styles.button}>
        Agregar Nuevo Cliente
      </Button>
      <Button mode="contained" onPress={() => router.push('orders/newOrder/existingClients')} style={styles.button}>
        Clientes Existentes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20 },
  button: { marginBottom: 10 },
});
