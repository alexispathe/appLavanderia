// app/orders/newOrder/orderSummary.js
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, StyleSheet, Button, Picker, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const [client, setClient] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('Pendiente');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar cliente
        const storedClients = await AsyncStorage.getItem('clients');
        const clientsArray = storedClients ? JSON.parse(storedClients) : [];
        const foundClient = clientsArray.find((c) => c.id === clientId);
        setClient(foundClient);

        // Cargar ítems seleccionados
        const storedSelectedItems = await AsyncStorage.getItem('selectedItems');
        const selectedItems = storedSelectedItems ? JSON.parse(storedSelectedItems) : [];
        setOrderItems(selectedItems);

        // Calcular precio total
        const total = selectedItems.reduce((sum, item) => sum + item.price * parseFloat(item.quantity), 0);
        setTotalPrice(total);
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    loadData();
  }, [clientId]);

  const handleSaveOrder = async () => {
    try {
      if (!client) {
        Alert.alert('Error', 'Cliente no encontrado.');
        return;
      }

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
      };

      const storedOrders = await AsyncStorage.getItem('orders');
      const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(ordersArray));

      // Limpiar ítems seleccionados
      await AsyncStorage.removeItem('selectedItems');

      Alert.alert('Éxito', 'Orden creada exitosamente.');
      router.push('(tabs)/orders/index');
    } catch (error) {
      console.log('Error guardando orden:', error);
      Alert.alert('Error', 'Hubo un error al guardar la orden.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Cantidad: {item.quantity} {item.measureType}</Text>
      <Text>Precio Unitario: ${item.price.toFixed(2)}</Text>
      <Text>Subtotal: ${(item.price * parseFloat(item.quantity)).toFixed(2)}</Text>
    </View>
  );

  if (!client || orderItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Cargando resumen de la orden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de la Orden</Text>
      <Text>Cliente: {client.name}</Text>
      <Text>Teléfono: {client.phone}</Text>
      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
      <Text style={styles.label}>Estado de Pago:</Text>
      <Picker
        selectedValue={paymentStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Pagado" value="Pagado" />
      </Picker>
      <Button title="Guardar Orden" onPress={handleSaveOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 16, textAlign: 'center' },
  orderItem: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
  },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  label: { marginTop: 10, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
