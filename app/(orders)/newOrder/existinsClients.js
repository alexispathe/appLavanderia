import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ExistingClientsScreen() {
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

  const selectClient = async (client) => {
    const currentOrderStr = await AsyncStorage.getItem('currentOrder');
    const currentOrder = currentOrderStr ? JSON.parse(currentOrderStr) : {};
    currentOrder.clientName = client.name;
    currentOrder.clientPhone = client.phone;
    currentOrder.createdAt = new Date().toISOString();
    await AsyncStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    router.push('chooseItems');
  };

  const renderClient = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.phone} />
      <Card.Content>
        <Paragraph>Email: {item.email}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => selectClient(item)}>Seleccionar</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Seleccionar Cliente</Title>
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
});
