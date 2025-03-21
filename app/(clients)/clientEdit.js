import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ClientEditScreen() {
  const { clientId } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadClient = async () => {
      try {
        const storedClients = await AsyncStorage.getItem('clients');
        const clientsArray = storedClients ? JSON.parse(storedClients) : [];
        const client = clientsArray.find(c => c.id === clientId);
        if (client) {
          setName(client.name);
          setPhone(client.phone);
          setEmail(client.email);
        } else {
          Alert.alert('Error', 'Cliente no encontrado');
          router.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el cliente.');
      }
    };
    loadClient();
  }, [clientId]);

  const handleUpdateClient = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Error', 'Completa todos los campos obligatorios.');
      return;
    }
    try {
      const storedClients = await AsyncStorage.getItem('clients');
      const clientsArray = storedClients ? JSON.parse(storedClients) : [];
      const updatedClients = clientsArray.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            name,
            phone,
            email,
            updatedAt: new Date().toISOString(),
          };
        }
        return client;
      });
      await AsyncStorage.setItem('clients', JSON.stringify(updatedClients));
      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      router.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el cliente.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Editar Cliente</Title>
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
      <Button mode="contained" onPress={handleUpdateClient} style={styles.button}>
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
