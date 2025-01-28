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

  const toggleSelectItem = (item) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: '1' }]);
    }
  };

  const handleNext = () => {
    if (selectedItems.length === 0) {
      alert('Por favor, selecciona al menos un ítem.');
      return;
    }
    // Guardar los ítems seleccionados temporalmente
    AsyncStorage.setItem('selectedItems', JSON.stringify(selectedItems))
      .then(() => {
        router.push(`orders/newOrder/orderSummary?clientId=${client.id}`);
      })
      .catch((error) => {
        console.log('Error guardando ítems seleccionados:', error);
        alert('Hubo un error al seleccionar los ítems.');
      });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.find((i) => i.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => toggleSelectItem(item)}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Precio: ${item.price.toFixed(2)}</Text>
        <Text>Tipo de Medida: {item.measureType}</Text>
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
        extraData={selectedItems}
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
  selectedItem: {
    backgroundColor: '#d0f0c0',
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
});
