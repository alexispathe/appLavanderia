// app/items/addItem.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function AddItemScreen() {
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [measureType, setMeasureType] = useState('unidad'); // 'unidad' o 'kilo'
  const [category, setCategory] = useState('Ropa');

  const handleSave = async () => {
    if (itemName.trim() === '' || price.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      const existingItems = await AsyncStorage.getItem('items');
      let itemsArray = existingItems ? JSON.parse(existingItems) : [];
      const newItem = {
        id: Date.now().toString(),
        name: itemName,
        price: parseFloat(price),
        measureType,
        category,
      };
      itemsArray.push(newItem);
      await AsyncStorage.setItem('items', JSON.stringify(itemsArray));
      alert('Ítem agregado exitosamente.');
      router.back();
    } catch (error) {
      console.log('Error guardando ítem:', error);
      alert('Hubo un error al guardar el ítem.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Agregar Nuevo Ítem</Title>
      <TextInput
        mode="outlined"
        label="Nombre del Ítem"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Precio"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />
      <Paragraph style={styles.label}>Tipo de Medida:</Paragraph>
      <Picker
        selectedValue={measureType}
        style={styles.picker}
        onValueChange={(itemValue) => setMeasureType(itemValue)}
      >
        <Picker.Item label="Unidad" value="unidad" />
        <Picker.Item label="Kilo" value="kilo" />
      </Picker>
      <Paragraph style={styles.label}>Categoría:</Paragraph>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(val) => setCategory(val)}
      >
        <Picker.Item label="Ropa" value="Ropa" />
        <Picker.Item label="Cobija" value="Cobija" />
        <Picker.Item label="Otro" value="Otro" />
      </Picker>
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 10 },
  input: { marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5, fontSize: 16 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  button: { marginTop: 10 },
});
