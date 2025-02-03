// app/orders/updateOrder.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function UpdateOrderScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    const loadOrderStatus = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const foundOrder = ordersArray.find(o => o.id === orderId);
        if (foundOrder) {
          setStatus(foundOrder.status || 'Pendiente');
        }
      } catch (error) {
        console.log('Error cargando estado de la orden:', error);
      }
    };
    loadOrderStatus();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      let ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray = ordersArray.map(o =>
        o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      );
      await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));
      setStatus(newStatus);
      Alert.alert('Éxito', 'Estado de la orden actualizado.');
    } catch (error) {
      console.log('Error actualizando estado de la orden:', error);
      Alert.alert('Error', 'Hubo un error al actualizar el estado.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Actualizar Orden #{orderId}</Title>
      <Paragraph>Estado actual: {status}</Paragraph>
      <Button mode="contained" onPress={() => handleUpdateStatus('Lavando')} style={styles.button}>
        Marcar Lavando
      </Button>
      <Button mode="contained" onPress={() => handleUpdateStatus('Terminado')} style={styles.button}>
        Marcar Terminado
      </Button>
      <Button mode="outlined" onPress={() => router.push('orders/index')} style={styles.button}>
        Regresar a Órdenes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 10 },
  button: { marginVertical: 10 },
});
