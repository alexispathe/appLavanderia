import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function StaffScreen() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadStaff = async () => {
        try {
          const storedStaff = await AsyncStorage.getItem('staff');
          const parsed = storedStaff ? JSON.parse(storedStaff) : [];
          setStaff(parsed);
        } catch (error) {
          console.log('Error cargando personal:', error);
        }
      };
      loadStaff();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Empleado',
      '¿Estás seguro de eliminar este empleado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedStaff = staff.filter(emp => emp.id !== id);
              setStaff(updatedStaff);
              await AsyncStorage.setItem('staff', JSON.stringify(updatedStaff));
            } catch (error) {
              console.log('Error eliminando empleado:', error);
            }
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.position} />
      <Card.Content>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Registrado: {new Date(item.createdAt).toLocaleDateString()}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`staff/editEmployee?employeeId=${item.id}`)}>
          Editar
        </Button>
        <Button onPress={() => handleDelete(item.id)} color="red">
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Personal</Title>
      <Button mode="contained" onPress={() => router.push('staff/addEmployee')} style={styles.addButton}>
        Agregar Empleado
      </Button>
      <FlatList
        data={staff}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployee}
        ListEmptyComponent={<Paragraph>No hay empleados registrados.</Paragraph>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 10 },
  addButton: { marginBottom: 16 },
});
