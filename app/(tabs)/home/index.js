// app/(tabs)/home/index.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const menuOptions = [
    {
      title: 'Listar Ítems',
      description: 'Ver y gestionar los ítems existentes',
      navigateTo: '/(items)/',
    },
    {
      title: 'Gestionar Órdenes',
      description: 'Crear y gestionar órdenes de lavado',
      navigateTo: '/(tabs)/orders',
    },
    {
      title: 'Finanzas',
      description: 'Gestor de ingresos y cierre de caja',
      navigateTo: '/(tabs)/finance',
    },
  ];

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Menú Principal</Title>
      {menuOptions.map((option, index) => (
        <Card key={index} style={styles.card}>
          <Card.Title title={option.title} />
          <Card.Content>
            <Paragraph>{option.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => router.push(option.navigateTo)}>
              Ir
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 15, backgroundColor: '#e6f7ff' },
});
