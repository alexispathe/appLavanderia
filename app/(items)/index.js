// app/(items)/index.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ItemsScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadItems = async () => {
        try {
          const storedItems = await AsyncStorage.getItem('items');
          const parsed = storedItems ? JSON.parse(storedItems) : [];
          setItems(parsed);
        } catch (error) {
          console.log('Error cargando ítems:', error);
        }
      };
      loadItems();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Ítem',
      '¿Estás seguro de que deseas eliminar este ítem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(id) },
      ]
    );
  };

  const confirmDelete = async (id) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.log('Error eliminando ítem:', error);
      alert('Hubo un error al eliminar el ítem.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Content>
        <Paragraph>Precio: ${item.price.toFixed(2)}</Paragraph>
        <Paragraph>Tipo de Medida: {item.measureType}</Paragraph>
        {item.category && <Paragraph>Categoría: {item.category}</Paragraph>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`(items)/editItem?itemId=${item.id}`)}>
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
      <Title style={styles.title}>Listado de Ítems</Title>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Paragraph>No hay ítems registrados.</Paragraph>}
      />
      <Button mode="contained" onPress={() => router.push('(items)/addItem')} style={styles.addButton}>
        Agregar Nuevo Ítemss
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 10 },
  addButton: { marginTop: 20 },
});
