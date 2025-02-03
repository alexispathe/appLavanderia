// app/orders/newOrder/orderSummary.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Button, TextInput, Card } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const { user } = useAuth();

  const [client, setClient] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('Pendiente');
  const [totalPrice, setTotalPrice] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [cambio, setCambio] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedClients = await AsyncStorage.getItem('clients');
        const clientsArray = storedClients ? JSON.parse(storedClients) : [];
        const foundClient = clientsArray.find(c => c.id === clientId);
        setClient(foundClient);

        const storedSelectedItems = await AsyncStorage.getItem('selectedItems');
        const selectedItems = storedSelectedItems ? JSON.parse(storedSelectedItems) : [];
        let total = 0;
        selectedItems.forEach(itm => {
          const qty = parseFloat(itm.quantity || '1');
          total += itm.price * qty;
        });
        setTotalPrice(total);
        setOrderItems(selectedItems);
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    loadData();
  }, [clientId]);

  useEffect(() => {
    const numRecibido = parseFloat(montoRecibido || '0');
    if (numRecibido >= totalPrice) {
      setCambio(numRecibido - totalPrice);
      setPaymentStatus('Pagado');
    } else {
      setCambio(0);
      setPaymentStatus('Pendiente');
    }
  }, [montoRecibido, totalPrice]);

  const handleSaveOrder = async () => {
    if (!client) {
      Alert.alert('Error', 'Cliente no encontrado.');
      return;
    }
    if (orderItems.length === 0) {
      Alert.alert('Error', 'No has seleccionado ítems.');
      return;
    }
    try {
      const newOrder = {
        id: Date.now().toString(),
        clientId: client.id,
        clientName: client.name,
        clientPhone: client.phone,
        items: orderItems,
        totalPrice,
        paymentStatus,
        pickupStatus: 'Pendiente',
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.email,
        updatedBy: user.email,
        montoRecibido: parseFloat(montoRecibido || '0'),
        cambio,
      };

      const storedOrders = await AsyncStorage.getItem('orders');
      const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));

      await AsyncStorage.removeItem('selectedItems');

      Alert.alert('Éxito', 'Orden creada exitosamente.');
      router.push('(tabs)/orders/index');
    } catch (error) {
      console.log('Error guardando orden:', error);
      Alert.alert('Error', 'Hubo un error al guardar la orden.');
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

  if (!client || orderItems.length === 0) {
    return (
      <View style={styles.container}>
        <Paragraph>Cargando resumen de la orden...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Resumen de la Orden</Title>
      <Paragraph>Cliente: {client.name}</Paragraph>
      <Paragraph>Teléfono: {client.phone}</Paragraph>
      <FlatList
        data={orderItems}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
      />
      <Paragraph style={styles.total}>Total: ${totalPrice.toFixed(2)}</Paragraph>
      <Paragraph style={styles.label}>Monto Recibido:</Paragraph>
      <TextInput
        mode="outlined"
        value={montoRecibido}
        onChangeText={setMontoRecibido}
        keyboardType="numeric"
        placeholder="Ej: 100"
        style={styles.input}
      />
      <Paragraph>Cambio: ${cambio.toFixed(2)}</Paragraph>
      <Paragraph style={styles.label}>Estado de Pago:</Paragraph>
      <Picker
        selectedValue={paymentStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Pagado" value="Pagado" />
      </Picker>
      <Button mode="contained" onPress={handleSaveOrder} style={styles.button}>
        Guardar Orden
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 16 },
  orderItem: { marginBottom: 10, backgroundColor: '#f0f8ff' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  label: { marginTop: 10, marginBottom: 5, fontSize: 16 },
  input: { marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  button: { marginTop: 10 },
});
