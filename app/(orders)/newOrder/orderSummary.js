import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Paragraph, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      const orderStr = await AsyncStorage.getItem('currentOrder');
      const currentOrder = orderStr ? JSON.parse(orderStr) : {};
      setOrder(currentOrder);
    };
    loadOrder();
  }, []);

  const handleFinalizeOrder = async () => {
    if (!order || !order.clientName || !order.items || order.items.length === 0) {
      Alert.alert('Error', 'El pedido debe tener cliente e ítems.');
      return;
    }
    const storedOrders = await AsyncStorage.getItem('orders');
    const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
    order.id = Date.now().toString();
    order.updatedAt = new Date().toISOString();
    ordersArray.push(order);
    await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));
    await AsyncStorage.removeItem('currentOrder');
    Alert.alert('Éxito', 'Pedido registrado.');
    router.replace('/(tabs)/orders');
  };

  if (!order) return null;

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Resumen del Pedido</Title>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Cliente: {order.clientName}</Paragraph>
          <Paragraph>Teléfono: {order.clientPhone}</Paragraph>
          <Paragraph>Fecha: {order.createdAt}</Paragraph>
        </Card.Content>
      </Card>
      {order.items && order.items.map((item, index) => (
        <Card key={index} style={styles.card}>
          <Card.Title title={item.name} subtitle={`Cantidad: ${item.quantity}`} />
          <Card.Content>
            <Paragraph>Precio Unitario: ${item.price.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>
      ))}
      <Button mode="contained" onPress={handleFinalizeOrder} style={styles.button}>
        Finalizar Pedido
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 10 },
  button: { marginTop: 20 },
});
