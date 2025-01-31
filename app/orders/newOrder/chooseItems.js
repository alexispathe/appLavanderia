// app/orders/newOrder/chooseItems.js
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const foundClient = clientsArray.find((c) => c.id === clientId);
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
    // Ir a pantalla de detalles para ese ítem (peso, talla, cantidad, etc.)
    router.push(`orders/newOrder/chooseItemDetails?itemId=${item.id}&clientId=${clientId}`);
  };

  // Cargamos del AsyncStorage si ya hay ítems seleccionados, etc.
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

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleSelectItem(item)}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Precio base: ${item.price.toFixed(2)}</Text>
        <Text>Tipo de Medida: {item.measureType}</Text>
        {item.category && <Text>Categoría: {item.category}</Text>}
      </TouchableOpacity>
    );
  };

  if (!client) {
    return (
      <View style={styles.container}>
        <Text>Cargando cliente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar Ítems para {client.name}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay ítems disponibles. Agrega nuevos ítems.</Text>}
      />
      <Button title="Siguiente" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 16, textAlign: 'center' },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
});
