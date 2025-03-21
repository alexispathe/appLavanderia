import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate } from '../utils/helpers';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ClientDetailsScreen() {
  const { clientId } = useLocalSearchParams();
  const router = useRouter();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const storedClients = await AsyncStorage.getItem('clients');
        const clientsArray = storedClients ? JSON.parse(storedClients) : [];
        const foundClient = clientsArray.find(c => c.id === clientId);
        if (foundClient) {
          setClient(foundClient);
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

  if (!client) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{client.name}</Title>
      <Paragraph>Teléfono: {client.phone}</Paragraph>
      <Paragraph>Email: {client.email}</Paragraph>
      <Paragraph>Registrado: {formatDate(client.createdAt)}</Paragraph>
      {/* Aquí puedes mostrar el historial de pedidos si lo vinculas */}
      <Button
        mode="contained"
        onPress={() => router.push(`(clients)/editClient?clientId=${client.id}`)}
        style={styles.button}
      >
        Editar Cliente
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 20 },
});
