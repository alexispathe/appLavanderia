// app/orders/newOrder/index.js
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NewOrderMenu() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Orden</Text>
      <Link href="orders/newOrder/addClient" style={styles.link}>
        Agregar Nuevo Cliente
      </Link>
      <Link href="orders/newOrder/existingClients" style={styles.link}>
        Clientes Existentes
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  link: { color: 'blue', marginBottom: 10, textAlign: 'center' },
});
