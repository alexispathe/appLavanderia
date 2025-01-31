// app/items/addItem.js
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

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
      // Opcional: Mostrar confirmación o limpiar el formulario
      alert('Ítem agregado exitosamente.');
      router.push('items/index'); // Redirigir a la lista de ítems
    } catch (error) {
      console.log('Error guardando ítem:', error);
      alert('Hubo un error al guardar el ítem.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Ítem</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Ítem"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Text style={styles.label}>Tipo de Medida:</Text>
      <Picker
        selectedValue={measureType}
        style={styles.picker}
        onValueChange={(itemValue) => setMeasureType(itemValue)}
      >
        <Picker.Item label="Unidad" value="unidad" />
        <Picker.Item label="Kilo" value="kilo" />
      </Picker>

      <Text style={styles.label}>Categoría:</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(val) => setCategory(val)}
      >
        <Picker.Item label="Ropa" value="Ropa" />
        <Picker.Item label="Cobija" value="Cobija" />
        <Picker.Item label="Otro" value="Otro" />
      </Picker>

      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 4 },
  label: { marginTop: 10, marginBottom: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
});
