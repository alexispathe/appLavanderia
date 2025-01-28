// app/items/index.js
import { Link, useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemsScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const parsed = storedItems ? JSON.parse(storedItems) : [];
        setItems(parsed);
      } catch (error) {
        console.log('Error cargando ítems:', error);
      }
    };
    const unsubscribe = router.addListener('focus', loadItems); // Actualizar al volver a la pantalla
    loadItems();
    return unsubscribe;
  }, [router]);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Ítem',
      '¿Estás seguro de que deseas eliminar este ítem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(id) },
      ]
    );
  };

  const confirmDelete = async (id) => {
    try {
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.log('Error eliminando ítem:', error);
      alert('Hubo un error al eliminar el ítem.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`items/editItem?itemId=${item.id}`)}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Precio: ${item.price.toFixed(2)}</Text>
      <Text>Tipo de Medida: {item.measureType}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de Ítems</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay ítems registrados.</Text>}
      />
      <Link href="items/addItem" style={styles.addLink}>
        Agregar Nuevo Ítem
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  deleteText: { color: 'red', marginTop: 5 },
  addLink: { color: 'blue', marginTop: 20, textAlign: 'center' },
});
