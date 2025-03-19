import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Card, Paragraph } from 'react-native-paper';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ChooseItemsScreen() {
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

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        router.push({ pathname: 'chooseItemDetails', params: { itemId: item.id } })
      }
    >
      <Card.Title title={item.name} />
      <Card.Content>
        <Paragraph>Precio: ${item.price.toFixed(2)}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Seleccionar Ítems</Title>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Paragraph>No hay ítems registrados.</Paragraph>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 10 },
});
