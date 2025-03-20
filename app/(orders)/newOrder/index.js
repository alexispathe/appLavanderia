import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, TextInput, Button, Card, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from '../../utils/helpers';
import { useRouter } from 'expo-router';

export default function NewOrderScreen() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  // Agrega un ítem al pedido
  const addItemToOrder = () => {
    if (!itemName.trim() || !itemQuantity.trim() || !itemPrice.trim()) {
      Alert.alert('Error', 'Completa todos los campos del ítem.');
      return;
    }
    const newItem = {
      id: generateUniqueId(),
      name: itemName,
      quantity: parseInt(itemQuantity),
      price: parseFloat(itemPrice),
    };
    setSelectedItems([...selectedItems, newItem]);
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
  };

  // Finaliza y guarda el pedido
  const finalizeOrder = async () => {
    if (!clientName.trim() || !clientPhone.trim() || selectedItems.length === 0) {
      Alert.alert('Error', 'Debes completar datos de cliente y agregar al menos un ítem.');
      return;
    }
    const newOrder = {
      id: generateUniqueId(),
      clientName,
      clientPhone,
      items: selectedItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Pendiente',
      totalPrice: selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      paymentStatus: 'Pendiente',
    };

    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));
      Alert.alert('Éxito', 'Orden creada correctamente.');
      router.replace('/(tabs)/orders'); // Redirige a la lista de órdenes
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la orden.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Crear Nuevo Pedido</Title>
      <Card style={styles.card}>
        <Card.Title title="Datos del Cliente" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Nombre del Cliente"
            value={clientName}
            onChangeText={setClientName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Teléfono del Cliente"
            value={clientPhone}
            onChangeText={setClientPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Agregar Ítems" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Nombre del Ítem"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Cantidad"
            value={itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Precio Unitario"
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={addItemToOrder} style={styles.button}>
            Agregar Ítem
          </Button>
        </Card.Content>
      </Card>
      <Title style={styles.subtitle}>Ítems Agregados</Title>
      {selectedItems.map((item, index) => (
        <Card key={index} style={styles.itemCard}>
          <Card.Title title={item.name} subtitle={`Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)}`} />
        </Card>
      ))}
      <Button mode="contained" onPress={finalizeOrder} style={styles.finalButton}>
        Finalizar Pedido
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  subtitle: { textAlign: 'center', marginVertical: 10, fontSize: 18 },
  itemCard: { marginBottom: 10 },
  finalButton: { marginTop: 20 },
});
