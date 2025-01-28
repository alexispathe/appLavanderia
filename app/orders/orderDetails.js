// app/orders/orderDetails.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, FlatList, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

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
        const foundOrder = ordersArray.find((o) => o.id === orderId);
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
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      let ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
      ordersArray = ordersArray.map((o) =>
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

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Cantidad: {item.quantity} {item.measureType}</Text>
      <Text>Precio Unitario: ${item.price.toFixed(2)}</Text>
      <Text>Subtotal: ${(item.price * parseFloat(item.quantity)).toFixed(2)}</Text>
    </View>
  );

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles de la orden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de Orden #{order.id}</Text>
      <Text>Cliente: {order.clientName}</Text>
      <Text>Teléfono: {order.clientPhone}</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
      />
      <Text style={styles.total}>Total: ${order.totalPrice.toFixed(2)}</Text>
      <Text style={styles.label}>Estado de la Orden:</Text>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Lavando" value="Lavando" />
        <Picker.Item label="Terminado" value="Terminado" />
      </Picker>
      <Text style={styles.label}>Estado de Pago:</Text>
      <Picker
        selectedValue={paymentStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Pagado" value="Pagado" />
      </Picker>
      <Text style={styles.label}>Estado de Recogida:</Text>
      <Picker
        selectedValue={pickupStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setPickupStatus(itemValue)}
      >
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Recogido" value="Recogido" />
      </Picker>
      <Button title="Actualizar Orden" onPress={handleUpdate} />
      <Button title="Regresar a Órdenes" onPress={() => router.push('orders/index')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
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
