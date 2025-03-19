import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUniqueId } from '../utils/helpers';
import { useRouter } from 'expo-router';

export default function AddItemScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [measureType, setMeasureType] = useState('');
  const [category, setCategory] = useState('');

  const handleAddItem = async () => {
    if (!name.trim() || !price.trim() || !measureType.trim()) {
      Alert.alert('Error', 'Completa los campos obligatorios.');
      return;
    }
    const newItem = {
      id: generateUniqueId(),
      name,
      price: parseFloat(price),
      measureType,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storedItems = await AsyncStorage.getItem('items');
    const itemsArray = storedItems ? JSON.parse(storedItems) : [];
    itemsArray.push(newItem);
    await AsyncStorage.setItem('items', JSON.stringify(itemsArray));
    Alert.alert('Éxito', 'Ítem agregado.');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Agregar Ítem</Title>
      <TextInput
        mode="outlined"
        label="Nombre del Ítem"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Tipo de Medida"
        value={measureType}
        onChangeText={setMeasureType}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Categoría (opcional)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddItem} style={styles.button}>
        Guardar Ítem
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
