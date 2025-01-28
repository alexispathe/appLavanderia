// app/orders/newOrder/addClient.js
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Text style={styles.title}>Agregar Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Guardar y Ver Clientes" onPress={handleAddClient} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 4 },
});
