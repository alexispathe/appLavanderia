import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { generateUniqueId } from '../utils/helpers';

export default function AddEmployeeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');

  const handleAddEmployee = async () => {
    if (!name.trim() || !position.trim() || !email.trim()) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    const newEmployee = {
      id: generateUniqueId(),
      name,
      position,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const storedStaff = await AsyncStorage.getItem('staff');
      const staffArray = storedStaff ? JSON.parse(storedStaff) : [];
      staffArray.push(newEmployee);
      await AsyncStorage.setItem('staff', JSON.stringify(staffArray));
      Alert.alert('Éxito', 'Empleado agregado.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el empleado.');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Agregar Empleado</Title>
      <TextInput
        mode="outlined"
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Posición"
        value={position}
        onChangeText={setPosition}
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
      <Button mode="contained" onPress={handleAddEmployee} style={styles.button}>
        Guardar Empleado
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
