// app/(orders)/index.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, TextInput, Card, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
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
          parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(parsed);
        } catch (error) {
          console.log('Error cargando órdenes:', error);
        }
      };
      loadOrders();
    }, [])
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderOrder = ({ item }) => (
    <Card style={styles.card} onPress={() => router.push(`(orders)/orderDetails?orderId=${item.id}`)}>
      <Card.Title title={`Orden #${item.id}`} />
      <Card.Content>
        <Paragraph>Cliente: {item.clientName}</Paragraph>
        <Paragraph>Estado: {item.status || 'Pendiente'}</Paragraph>
        <Paragraph>Pago: {item.paymentStatus || 'Pendiente'}</Paragraph>
        <Paragraph>Recogida: {item.pickupStatus || 'Pendiente'}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Gestión de Órdenes</Title>
      <Button mode="contained" onPress={() => router.push('(orders)/newOrder')} style={styles.link}>
        Crear Nueva Orden
      </Button>
      <TextInput
        mode="outlined"
        placeholder="Buscar por cliente o teléfono"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <Paragraph style={styles.label}>Filtrar por Estado:</Paragraph>
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
        <Paragraph>No hay órdenes que coincidan con los criterios.</Paragraph>
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
  title: { textAlign: 'center', marginBottom: 16 },
  link: { marginBottom: 16 },
  card: { marginBottom: 10, backgroundColor: '#e6f7ff' },
  searchInput: { marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
