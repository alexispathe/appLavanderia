import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchParams, useRouter } from 'expo-router';

export default function ChooseItemDetailsScreen() {
  const { itemId } = useSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState('1');
  const [item, setItem] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        const foundItem = itemsArray.find(i => i.id === itemId);
        setItem(foundItem);
      } catch (error) {
        console.log('Error cargando ítem:', error);
      }
    };
    loadItem();
  }, [itemId]);

  const handleAddItemToOrder = async () => {
    if (!item) return;
    const currentOrderStr = await AsyncStorage.getItem('currentOrder');
    const currentOrder = currentOrderStr ? JSON.parse(currentOrderStr) : { items: [] };
    currentOrder.items = currentOrder.items || [];
    currentOrder.items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: parseInt(quantity),
    });
    await AsyncStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    router.push('chooseItems'); // Permite agregar más ítems o continuar
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Detalles del Ítem: {item.name}</Title>
      <TextInput
        mode="outlined"
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddItemToOrder} style={styles.button}>
        Agregar al Pedido
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
});
