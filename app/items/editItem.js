// app/items/editItem.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditItemScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [measureType, setMeasureType] = useState('unidad');
  const [category, setCategory] = useState('Ropa');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        const item = itemsArray.find(i => i.id === itemId);
        if (item) {
          setItemName(item.name);
          setPrice(item.price.toString());
          setMeasureType(item.measureType || 'unidad');
          setCategory(item.category || 'Ropa');
        } else {
          alert('Ítem no encontrado.');
          router.push('/items');
        }
      } catch (error) {
        console.log('Error cargando ítem:', error);
        alert('Hubo un error al cargar el ítem.');
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [itemId, router]);

  const handleUpdate = async () => {
    if (itemName.trim() === '' || price.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      const storedItems = await AsyncStorage.getItem('items');
      let itemsArray = storedItems ? JSON.parse(storedItems) : [];
      itemsArray = itemsArray.map(i =>
        i.id === itemId ? { ...i, name: itemName, price: parseFloat(price), measureType, category } : i
      );
      await AsyncStorage.setItem('items', JSON.stringify(itemsArray));
      alert('Ítem actualizado exitosamente.');
      router.back();
    } catch (error) {
      console.log('Error actualizando ítem:', error);
      alert('Hubo un error al actualizar el ítem.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Paragraph>Cargando ítem...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Editar Ítem</Title>
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
      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Actualizar
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
