import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, TextInput, Button, Card, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from '../../utils/helpers';
import { useRouter } from 'expo-router';

export default function NewOrderScreen() {
  const router = useRouter();

  // Estados para el cliente
  const [clientQuery, setClientQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // Estados para los ítems
  const [itemQuery, setItemQuery] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Cargar clientes e ítems desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadClients = async () => {
      try {
        const storedClients = await AsyncStorage.getItem('clients');
        const parsed = storedClients ? JSON.parse(storedClients) : [];
        setClients(parsed);
      } catch (error) {
        console.log('Error cargando clientes:', error);
      }
    };

    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const parsed = storedItems ? JSON.parse(storedItems) : [];
        setItems(parsed);
      } catch (error) {
        console.log('Error cargando ítems:', error);
      }
    };

    loadClients();
    loadItems();
  }, []);

  // Filtrar clientes en función de la consulta (nombre o teléfono)
  const filteredClients = clients.filter(client => {
    const query = clientQuery.toLowerCase();
    return client.name.toLowerCase().includes(query) || client.phone.includes(query);
  });

  // Filtrar ítems en función de la consulta (nombre)
  const filteredItems = items.filter(item => {
    const query = itemQuery.toLowerCase();
    return item.name.toLowerCase().includes(query);
  });

  // Seleccionar un cliente y limpiar el input de búsqueda
  const selectClient = (client) => {
    setSelectedClient(client);
    setClientQuery('');
  };

  // Agregar un ítem seleccionado al pedido; en este ejemplo se asume cantidad = 1 por defecto
  const addItemToOrder = (item) => {
    // Puedes ampliar esta función para pedir cantidad o validar si el ítem ya fue agregado
    const newItem = { ...item, quantity: 1 };
    setSelectedItems([...selectedItems, newItem]);
  };

  // Finalizar y guardar el pedido en AsyncStorage
  const finalizeOrder = async () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Debes seleccionar un cliente.');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Agrega al menos un ítem al pedido.');
      return;
    }

    const newOrder = {
      id: generateUniqueId(),
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
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
      router.replace('/(orders)/'); // Redirige a la lista de órdenes
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la orden.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Crear Nuevo Pedido</Title>

      {/* Sección para seleccionar cliente */}
      <Card style={styles.card}>
        <Card.Title title="Seleccionar Cliente" />
        <Card.Content>
          {selectedClient ? (
            <View>
              <Paragraph>Nombre: {selectedClient.name}</Paragraph>
              <Paragraph>Teléfono: {selectedClient.phone}</Paragraph>
              <Button mode="text" onPress={() => setSelectedClient(null)}>
                Cambiar Cliente
              </Button>
            </View>
          ) : (
            <>
              <TextInput
                mode="outlined"
                label="Buscar Cliente (nombre o teléfono)"
                value={clientQuery}
                onChangeText={setClientQuery}
                style={styles.input}
              />
              {filteredClients.map(client => (
                <Card key={client.id} style={styles.resultCard}>
                  <Card.Title title={client.name} subtitle={client.phone} />
                  <Card.Content>
                    <Paragraph>Email: {client.email}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => selectClient(client)}>Seleccionar</Button>
                  </Card.Actions>
                </Card>
              ))}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Sección para seleccionar ítems */}
      <Card style={styles.card}>
        <Card.Title title="Seleccionar Ítems" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Buscar Ítem"
            value={itemQuery}
            onChangeText={setItemQuery}
            style={styles.input}
          />
          {filteredItems.map(item => (
            <Card key={item.id} style={styles.resultCard}>
              <Card.Title title={item.name} />
              <Card.Content>
                <Paragraph>Precio: ${item.price.toFixed(2)}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => addItemToOrder(item)}>Agregar</Button>
              </Card.Actions>
            </Card>
          ))}
        </Card.Content>
      </Card>

      {/* Mostrar ítems seleccionados */}
      <Title style={styles.subtitle}>Ítems Agregados</Title>
      {selectedItems.map((item, index) => (
        <Card key={index} style={styles.itemCard}>
          <Card.Title
            title={item.name}
            subtitle={`Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)}`}
          />
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
  resultCard: { marginBottom: 10 },
  subtitle: { textAlign: 'center', marginVertical: 10, fontSize: 18 },
  itemCard: { marginBottom: 10 },
  finalButton: { marginTop: 20 },
});
