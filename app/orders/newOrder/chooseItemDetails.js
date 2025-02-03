// app/orders/newOrder/chooseItemDetails.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function ChooseItemDetailsScreen() {
  const router = useRouter();
  const { itemId, clientId } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [size, setSize] = useState('Individual');
  const [isLoading, setIsLoading] = useState(true);
  // Estado para la unidad de peso (para artículos de tipo “Ropa”)
  const [weightUnit, setWeightUnit] = useState('kilos');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        const itemsArray = storedItems ? JSON.parse(storedItems) : [];
        const foundItem = itemsArray.find(i => i.id === itemId);
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
      const storedSelectedItems = await AsyncStorage.getItem('selectedItems');
      let selectedArray = storedSelectedItems ? JSON.parse(storedSelectedItems) : [];
      const newItemSelected = {
        ...item,
        quantity,
        // Para "Cobija" se guarda el tamaño; para "Ropa" se guarda la unidad de peso
        size: item.category === 'Cobija' ? size : (item.category === 'Ropa' ? weightUnit : null),
      };
      const existingIndex = selectedArray.findIndex(sel => sel.id === item.id);
      if (existingIndex >= 0) {
        selectedArray[existingIndex] = newItemSelected;
      } else {
        selectedArray.push(newItemSelected);
      }
      await AsyncStorage.setItem('selectedItems', JSON.stringify(selectedArray));
      Alert.alert('Éxito', 'Ítem configurado correctamente.');
      router.back();
    } catch (error) {
      console.log('Error guardando la selección de ítems:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración del ítem.');
    }
  };

  if (isLoading || !item) {
    return (
      <View style={styles.container}>
        <Paragraph>Cargando detalles...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Detalles de: {item.name}</Title>
      <Paragraph>Tipo de medida: {item.measureType}</Paragraph>
      <Paragraph>Precio base: ${item.price.toFixed(2)}</Paragraph>
      <Paragraph style={styles.label}>
        {item.measureType === 'kilo' ? 'Ingresa peso (kg)' : 'Cantidad'}
      </Paragraph>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      {item.category === 'Cobija' && (
        <>
          <Paragraph style={styles.label}>Tamaño de Cobija</Paragraph>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={size}
            onChangeText={setSize}
          />
        </>
      )}
      {item.category === 'Ropa' && (
        <>
          <Paragraph style={styles.label}>Unidad de peso</Paragraph>
          <Picker
            selectedValue={weightUnit}
            style={styles.picker}
            onValueChange={(itemValue) => setWeightUnit(itemValue)}
          >
            <Picker.Item label="Kilos" value="kilos" />
            <Picker.Item label="Gramos" value="gramos" />
          </Picker>
        </>
      )}
      <Button mode="contained" onPress={handleSaveDetails} style={styles.button}>
        Guardar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 5, fontSize: 16 },
  input: { marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  button: { marginTop: 10 },
});
