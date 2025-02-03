// app/(tabs)/finance/closeCash.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { differenceInDays } from 'date-fns';

export default function CloseCashScreen() {
  const router = useRouter();
  const [startingCash, setStartingCash] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

  useEffect(() => {
    const calculateTotals = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const today = new Date();
        let income = 0;
        let pending = 0;
        let change = 0;

        ordersArray.forEach(order => {
          const orderDate = new Date(order.createdAt);
          if (differenceInDays(today, orderDate) === 0) {
            if (order.paymentStatus === 'Pagado') {
              income += order.totalPrice;
              change += order.cambio || 0;
            } else {
              pending += order.totalPrice;
            }
          }
        });

        setTotalIncome(income);
        setPendingPayments(pending);
        setTotalChange(change);
      } catch (error) {
        console.log('Error calculating totals:', error);
      }
    };
    calculateTotals();
  }, []);

  const handleSaveClosure = async () => {
    if (!startingCash) {
      Alert.alert('Error', 'Por favor, ingresa la cantidad de dinero inicial.');
      return;
    }
    try {
      const closureRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        startingCash: parseFloat(startingCash),
        totalIncome,
        pendingPayments,
        totalChange,
      };
      const storedClosures = await AsyncStorage.getItem('cashClosures');
      const closuresArray = storedClosures ? JSON.parse(storedClosures) : [];
      closuresArray.push(closureRecord);
      await AsyncStorage.setItem('cashClosures', JSON.stringify(closuresArray));
      Alert.alert('Éxito', 'Cierre de caja registrado.');
      router.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el cierre de caja.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Cierre de Caja" />
        <Card.Content>
          <Text style={styles.label}>Cantidad inicial de caja:</Text>
          <TextInput
            mode="outlined"
            label="Monto Inicial"
            value={startingCash}
            onChangeText={setStartingCash}
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.info}>Total Ingresos: ${totalIncome.toFixed(2)}</Text>
          <Text style={styles.info}>Pagos Pendientes: ${pendingPayments.toFixed(2)}</Text>
          <Text style={styles.info}>Total Cambios entregados: ${totalChange.toFixed(2)}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSaveClosure}>Registrar Cierre</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  card: { padding: 10, backgroundColor: '#FFFFFF' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { marginBottom: 16 },
  info: { fontSize: 14, marginBottom: 4 },
});
