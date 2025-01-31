// app/(tabs)/orders/index.js
import { Link } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        try {
          const storedOrders = await AsyncStorage.getItem('orders');
          const parsed = storedOrders ? JSON.parse(storedOrders) : [];
          // Ordenar por fecha de creación descendente
          parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(parsed);
        } catch (error) {
          console.log('Error cargando órdenes:', error);
        }
      };
      loadOrders();
    }, [])
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push(`orders/orderDetails?orderId=${item.id}`)}
    >
      <Text style={styles.orderTitle}>Orden #{item.id}</Text>
      <Text>Cliente: {item.clientName}</Text>
      <Text>Estado: {item.status || 'Pendiente'}</Text>
      <Text>Pago: {item.paymentStatus || 'Pendiente'}</Text>
      <Text>Recogida: {item.pickupStatus || 'Pendiente'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Órdenes</Text>
      <Link href="orders/newOrder" style={styles.link}>
        Crear Nueva Orden
      </Link>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por cliente o teléfono"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.label}>Filtrar por Estado:</Text>
      <Picker
        selectedValue={filterStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setFilterStatus(itemValue)}
      >
        <Picker.Item label="Todos" value="Todos" />
        <Picker.Item label="Pendiente" value="Pendiente" />
        <Picker.Item label="Lavando" value="Lavando" />
        <Picker.Item label="Terminado" value="Terminado" />
      </Picker>
      {filteredOrders.length === 0 ? (
        <Text>No hay órdenes que coincidan con los criterios.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  link: { color: 'blue', marginBottom: 16, textAlign: 'center' },
  orderItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#e6f7ff',
  },
  orderTitle: { fontSize: 18, fontWeight: 'bold' },
  searchInput: { borderWidth: 1, padding: 8, borderRadius: 4, marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
