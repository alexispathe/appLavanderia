import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Card, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchParams, useRouter } from 'expo-router';

export default function OrderDetailsScreen() {
  const { orderId } = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const foundOrder = ordersArray.find(o => o.id === orderId);
        setOrder(foundOrder);
      } catch (error) {
        console.log('Error al cargar la orden:', error);
      }
    };
    loadOrder();
  }, [orderId]);

  if (!order) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Detalles de la Orden #{order.id}</Title>
      <Card style={styles.card}>
        <Card.Title title="Datos del Cliente" />
        <Card.Content>
          <Paragraph>Nombre: {order.clientName}</Paragraph>
          <Paragraph>Teléfono: {order.clientPhone}</Paragraph>
          <Paragraph>Fecha: {new Date(order.createdAt).toLocaleString()}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Ítems del Pedido" />
        <Card.Content>
          {order.items && order.items.map((item, index) => (
            <Card key={index} style={styles.itemCard}>
              <Card.Title title={item.name} subtitle={`Cantidad: ${item.quantity}`} />
              <Card.Content>
                <Paragraph>Precio Unitario: ${item.price.toFixed(2)}</Paragraph>
                <Paragraph>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Total: ${order.totalPrice.toFixed(2)}</Paragraph>
          <Paragraph>Estado: {order.status}</Paragraph>
          <Paragraph>Pago: {order.paymentStatus}</Paragraph>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => router.goBack()} style={styles.button}>
        Volver
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 20, padding: 10 },
  itemCard: { marginBottom: 10 },
  button: { marginTop: 20 },
});
