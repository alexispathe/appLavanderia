// app/orders/newOrder/chooseItemDetails.js
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChooseItemDetailsScreen() {
  const router = useRouter();
  const { itemId, clientId } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [size, setSize] = useState('Individual'); // Solo si es cobija, por ejemplo
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        const foundItem = itemsArray.find((i) => i.id === itemId);
        setItem(foundItem);
      } catch (error) {
        console.log('Error cargando ítem:', error);
        Alert.alert('Error', 'No se pudo cargar el ítem.');
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [itemId]);

  const handleSaveDetails = async () => {
    if (!quantity) {
      Alert.alert('Error', 'Por favor ingresa una cantidad o peso.');
      return;
    }

    try {
      // Obtener la lista de ítems seleccionados que ya estén en AsyncStorage
      const storedSelectedItems = await AsyncStorage.getItem('selectedItems');
      let selectedArray = storedSelectedItems ? JSON.parse(storedSelectedItems) : [];

      // Ver si ya existe este ítem en la selección
      const existingIndex = selectedArray.findIndex((sel) => sel.id === item.id);

      const newItemSelected = {
        ...item,
        quantity,
        size: item.category === 'Cobija' ? size : null,
      };

      if (existingIndex >= 0) {
        selectedArray[existingIndex] = newItemSelected;
      } else {
        selectedArray.push(newItemSelected);
      }

      await AsyncStorage.setItem('selectedItems', JSON.stringify(selectedArray));
      Alert.alert('Éxito', 'Ítem configurado correctamente.');
      router.back(); // Volver a la lista de ítems
    } catch (error) {
      console.log('Error guardando la selección de ítems:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración del ítem.');
    }
  };

  if (isLoading || !item) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de: {item.name}</Text>
      <Text>Tipo de medida: {item.measureType}</Text>
      <Text>Precio base: ${item.price.toFixed(2)}</Text>
      <Text style={styles.label}>
        {item.measureType === 'kilo' ? 'Ingresa peso (kg)' : 'Cantidad'}
      </Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      {item.category === 'Cobija' && (
        <>
          <Text style={styles.label}>Tamaño de Cobija</Text>
          <TextInput
            style={styles.input}
            value={size}
            onChangeText={setSize}
          />
        </>
      )}
      <Button title="Guardar" onPress={handleSaveDetails} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
});
