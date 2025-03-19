import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AddClientOrderScreen() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const handleSaveClient = async () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    // Se crea o actualiza el pedido temporal
    const currentOrderStr = await AsyncStorage.getItem('currentOrder');
    const currentOrder = currentOrderStr ? JSON.parse(currentOrderStr) : {};
    currentOrder.clientName = clientName;
    currentOrder.clientPhone = clientPhone;
    currentOrder.createdAt = new Date().toISOString();
    await AsyncStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    router.push('chooseItems');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Nuevo Pedido: Datos del Cliente</Title>
      <TextInput
        mode="outlined"
        label="Nombre del Cliente"
        value={clientName}
        onChangeText={setClientName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Teléfono del Cliente"
        value={clientPhone}
        onChangeText={setClientPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSaveClient} style={styles.button}>
        Continuar
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
