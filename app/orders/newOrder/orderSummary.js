// app/orders/newOrder/orderSummary.js
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../contexts/AuthContext';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const { user } = useAuth(); // Para obtener info del usuario

  const [client, setClient] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('Pendiente');
  const [totalPrice, setTotalPrice] = useState(0);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [cambio, setCambio] = useState(0);

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

        // Calcular precio total (si measureType == kilo, multiplica precio * quantity)
        let total = 0;
        selectedItems.forEach((itm) => {
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

  // Actualizar cambio cuando el monto recibido cambie
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
        createdBy: user.email, // ID del usuario que crea la orden
        updatedBy: user.email,
        // Podrías guardar también montoRecibido y cambio si deseas
        montoRecibido: parseFloat(montoRecibido || '0'),
        cambio,
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

  const renderItem = ({ item }) => {
    const qty = parseFloat(item.quantity || '1');
    const subtotal = item.price * qty;
    return (
      <View style={styles.orderItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Cantidad: {item.quantity} {item.measureType}</Text>
        {item.size && <Text>Tamaño: {item.size}</Text>}
        <Text>Precio Unitario: ${item.price.toFixed(2)}</Text>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>
    );
  };

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
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>

      <Text style={styles.label}>Monto Recibido:</Text>
      <TextInput
        style={styles.input}
        value={montoRecibido}
        onChangeText={setMontoRecibido}
        keyboardType="numeric"
        placeholder="Ej: 100"
      />
      <Text>Cambio: ${cambio.toFixed(2)}</Text>

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
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
