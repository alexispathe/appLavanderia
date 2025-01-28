// app/orders/updateOrder.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function UpdateOrderScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    const loadOrderStatus = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const foundOrder = ordersArray.find((o) => o.id === orderId);
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
      ordersArray = ordersArray.map((o) =>
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
      <Text style={styles.title}>Actualizar Orden #{orderId}</Text>
      <Text>Estado actual: {status}</Text>
      <Button title="Marcar Lavando" onPress={() => handleUpdateStatus('Lavando')} />
      <Button title="Marcar Terminado" onPress={() => handleUpdateStatus('Terminado')} />
      <Button title="Regresar a Órdenes" onPress={() => router.push('orders/index')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
});
