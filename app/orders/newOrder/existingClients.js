// app/orders/newOrder/existingClients.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList, Button, Title, Card, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ExistingClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadClients = async () => {
        try {
          const stored = await AsyncStorage.getItem('clients');
          const parsed = stored ? JSON.parse(stored) : [];
          setClients(parsed);
        } catch (error) {
          console.log('Error cargando clientes:', error);
        }
      };
      loadClients();
    }, [])
  );

  const handleSelectClient = (client) => {
    AsyncStorage.setItem('selectedClient', JSON.stringify(client))
      .then(() => {
        router.push('orders/newOrder/chooseItems?clientId=' + client.id);
      })
      .catch((error) => {
        console.log('Error seleccionando cliente:', error);
        alert('Hubo un error al seleccionar el cliente.');
      });
  };

  const renderClient = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.phone} />
      <Card.Actions>
        <Button onPress={() => handleSelectClient(item)}>Seleccionar</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Clientes Existentes</Title>
      {clients.length === 0 ? (
        <Paragraph>No hay clientes registrados.</Paragraph>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={renderClient}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 10 },
  card: { marginBottom: 12, padding: 10 },
});
