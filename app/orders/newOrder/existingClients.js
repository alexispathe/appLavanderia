// app/orders/newOrder/existingClients.js
import { useRouter } from 'expo-router';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExistingClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const stored = await AsyncStorage.getItem('clients');
        const parsed = stored ? JSON.parse(stored) : [];
        setClients(parsed);
      } catch (error) {
        console.log('Error cargando clientes:', error);
      }
    };
    const unsubscribe = router.addListener('focus', loadClients); // Actualizar al volver a la pantalla
    loadClients();
    return unsubscribe;
  }, [router]);

  const handleSelectClient = (client) => {
    // Guardar el cliente seleccionado en AsyncStorage temporalmente
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
    <View style={styles.clientItem}>
      <Text>{item.name} - {item.phone}</Text>
      <Button title="Seleccionar" onPress={() => handleSelectClient(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes Existentes</Text>
      {clients.length === 0 ? (
        <Text>No hay clientes registrados.</Text>
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
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  clientItem: {
    marginBottom: 12,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
  },
});
