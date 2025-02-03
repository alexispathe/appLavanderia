// app/orders/orderDetails.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, Card } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('Pendiente');
  const [paymentStatus, setPaymentStatus] = useState('Pendiente');
  const [pickupStatus, setPickupStatus] = useState('Pendiente');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const foundOrder = ordersArray.find(o => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
          setStatus(foundOrder.status || 'Pendiente');
          setPaymentStatus(foundOrder.paymentStatus || 'Pendiente');
          setPickupStatus(foundOrder.pickupStatus || 'Pendiente');
        } else {
          alert('Orden no encontrada.');
          router.push('orders/index');
        }
      } catch (error) {
        console.log('Error cargando orden:', error);
        alert('Hubo un error al cargar la orden.');
      }
    };
    loadOrder();
  }, [orderId, router]);

  const handleUpdate = async () => {
    if (!order) return;
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      let ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray = ordersArray.map(o =>
        o.id === orderId
          ? { ...o, status, paymentStatus, pickupStatus, updatedAt: new Date().toISOString() }
          : o
      );
      await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));
      setOrder({ ...order, status, paymentStatus, pickupStatus });
      Alert.alert('Éxito', 'Orden actualizada exitosamente.');
    } catch (error) {
      console.log('Error actualizando orden:', error);
      Alert.alert('Error', 'Hubo un error al actualizar la orden.');
    }
  };

  const renderItem = ({ item }) => {
    const qty = parseFloat(item.quantity || '1');
    const subtotal = item.price * qty;
    return (
      <Card style={styles.orderItem}>
        <Card.Title title={item.name} />
        <Card.Content>
          <Paragraph>Cantidad: {item.quantity} {item.measureType}</Paragraph>
          {item.size && <Paragraph>Tamaño: {item.size}</Paragraph>}
          <Paragraph>Precio Unitario: ${item.price.toFixed(2)}</Paragraph>
          <Paragraph>Subtotal: ${subtotal.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Paragraph>Cargando detalles de la orden...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Detalles de Orden #{order.id}</Title>
      <Paragraph>Cliente: {order.clientName}</Paragraph>
      <Paragraph>Teléfono: {order.clientPhone}</Paragraph>
      <FlatList
        data={order.items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
      />
      <Paragraph style={styles.total}>Total: ${order.totalPrice.toFixed(2)}</Paragraph>
      <Paragraph>Estado de la Orden:</Paragraph>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Lavando" value="Lavando" />
        <Picker.Item label="Terminado" value="Terminado" />
      </Picker>
      <Paragraph>Estado de Pago:</Paragraph>
      <Picker
        selectedValue={paymentStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Pagado" value="Pagado" />
      </Picker>
      <Paragraph>Estado de Recogida:</Paragraph>
      <Picker
        selectedValue={pickupStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPickupStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Recogido" value="Recogido" />
      </Picker>
      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Actualizar Orden
      </Button>
      <Button mode="outlined" onPress={() => router.push('orders/index')} style={styles.button}>
        Regresar a Órdenes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 10 },
  orderItem: { marginBottom: 10, backgroundColor: '#f0f8ff' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  picker: { height: 50, width: '100%', marginVertical: 10 },
  button: { marginVertical: 10 },
});
