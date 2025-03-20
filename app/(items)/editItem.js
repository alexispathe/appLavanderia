import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [measureType, setMeasureType] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        const item = itemsArray.find(i => i.id === itemId);
        if (item) {
          setName(item.name);
          setPrice(item.price.toString());
          setMeasureType(item.measureType);
          setCategory(item.category || '');
        } else {
          Alert.alert('Error', 'Ítem no encontrado');
          router.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Error cargando el ítem');
      }
    };
    loadItem();
  }, [itemId]);

  const handleUpdateItem = async () => {
    if (!name.trim() || !price.trim() || !measureType.trim()) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }
    try {
      const storedItems = await AsyncStorage.getItem('items');
      const itemsArray = storedItems ? JSON.parse(storedItems) : [];
      const updatedItems = itemsArray.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            name,
            price: parseFloat(price),
            measureType,
            category,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      Alert.alert('Éxito', 'Ítem actualizado correctamente');
      router.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el ítem');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Editar Ítem</Title>
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
      <Button mode="contained" onPress={handleUpdateItem} style={styles.button}>
        Guardar Cambios
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center' 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 20 
  },
  input: { 
    marginBottom: 10 
  },
  button: { 
    marginTop: 10 
  },
});
