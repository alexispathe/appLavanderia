// app/orders/newOrder/chooseItems.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Card, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChooseItemsScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const [client, setClient] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar cliente
        const storedClients = await AsyncStorage.getItem('clients');
        const clientsArray = storedClients ? JSON.parse(storedClients) : [];
        const foundClient = clientsArray.find(c => c.id === clientId);
        setClient(foundClient);
        // Cargar ítems
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        setItems(itemsArray);
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    loadData();
  }, [clientId]);

  const handleSelectItem = (item) => {
    router.push(`orders/newOrder/chooseItemDetails?itemId=${item.id}&clientId=${clientId}`);
  };

  useEffect(() => {
    const loadSelected = async () => {
      try {
        const storedSelectedItems = await AsyncStorage.getItem('selectedItems');
        if (storedSelectedItems) {
          setSelectedItems(JSON.parse(storedSelectedItems));
        }
      } catch (error) {
        console.log('Error cargando ítems seleccionados:', error);
      }
    };
    loadSelected();
  }, []);

  const handleNext = () => {
    if (selectedItems.length === 0) {
      alert('Por favor, selecciona al menos un ítem.');
      return;
    }
    router.push(`orders/newOrder/orderSummary?clientId=${client.id}`);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => handleSelectItem(item)}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Paragraph>Precio base: ${item.price.toFixed(2)}</Paragraph>
        <Paragraph>Tipo de Medida: {item.measureType}</Paragraph>
        {item.category && <Paragraph>Categoría: {item.category}</Paragraph>}
      </Card.Content>
    </Card>
  );

  if (!client) {
    return (
      <View style={styles.container}>
        <Paragraph>Cargando cliente...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Seleccionar Ítems para {client.name}</Title>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Paragraph>No hay ítems disponibles. Agrega nuevos ítems.</Paragraph>}
      />
      <Button mode="contained" onPress={handleNext} style={styles.button}>
        Siguiente
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 10 },
  button: { marginTop: 20 },
});
