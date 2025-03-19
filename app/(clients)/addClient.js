import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { generateUniqueId } from '../utils/helpers';
export default function AddClientScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleAddClient = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    const newClient = {
      id: generateUniqueId(),
      name,
      phone,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orders: [], // Historial de pedidos (puedes agregar pedidos luego)
    };

    try {
      const storedClients = await AsyncStorage.getItem('clients');
      const clientsArray = storedClients ? JSON.parse(storedClients) : [];
      clientsArray.push(newClient);
      await AsyncStorage.setItem('clients', JSON.stringify(clientsArray));
      Alert.alert('Éxito', 'Cliente agregado.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el cliente.');
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
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddClient} style={styles.button}>
        Guardar Cliente
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
