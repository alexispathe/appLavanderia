// app/orders/newOrder/addClient.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AddClientScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddClient = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    try {
      const existingClients = await AsyncStorage.getItem('clients');
      let clientsArray = existingClients ? JSON.parse(existingClients) : [];
      const newClient = {
        id: Date.now().toString(),
        name,
        phone,
      };
      clientsArray.push(newClient);
      await AsyncStorage.setItem('clients', JSON.stringify(clientsArray));
      Alert.alert('Éxito', 'Cliente agregado exitosamente.');
      router.push('orders/newOrder/existingClients');
    } catch (error) {
      console.log('Error guardando cliente:', error);
      Alert.alert('Error', 'Hubo un error al guardar el cliente.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Agregar Cliente</Title>
      <TextInput
        mode="outlined"
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Teléfono"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddClient} style={styles.button}>
        Guardar y Ver Clientes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 10 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
});
