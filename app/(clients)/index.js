import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadClients = async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const parsed = storedClients ? JSON.parse(storedClients) : [];
          setClients(parsed);
        } catch (error) {
          console.log('Error cargando clientes:', error);
        }
      };
      loadClients();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Cliente',
      '¿Estás seguro de eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedClients = clients.filter(client => client.id !== id);
              setClients(updatedClients);
              await AsyncStorage.setItem('clients', JSON.stringify(updatedClients));
            } catch (error) {
              console.log('Error eliminando cliente:', error);
            }
          },
        },
      ]
    );
  };

  const renderClient = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.phone} />
      <Card.Content>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Registrado: {new Date(item.createdAt).toLocaleDateString()}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`(clients)/clientDetail?clientId=${item.id}`)}>
          Detalles
        </Button>
        <Button onPress={() => router.push(`(clients)/clientEdit?clientId=${item.id}`)}>
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
      <Title style={styles.title}>Clientes</Title>
      <Button mode="contained" onPress={() => router.push('(clients)/addClient')} style={styles.addButton}>
        Agregar Cliente
      </Button>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderClient}
        ListEmptyComponent={<Paragraph>No hay clientes registrados.</Paragraph>}
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
