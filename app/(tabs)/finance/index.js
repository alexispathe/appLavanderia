// app/(tabs)/finance/index.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Card, Text as PaperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export default function FinanceScreen() {
  const router = useRouter();
  const [dailyIncome, setDailyIncome] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        const paidOrders = ordersArray.filter(o => o.paymentStatus === 'Pagado');
        const now = new Date();
        let dailySum = 0, weeklySum = 0, monthlySum = 0;
        paidOrders.forEach(order => {
          const updatedAt = new Date(order.updatedAt);
          if (isSameDay(now, updatedAt)) {
            dailySum += order.totalPrice;
          }
          if (differenceInWeeks(now, updatedAt) === 0) {
            weeklySum += order.totalPrice;
          }
          if (differenceInMonths(now, updatedAt) === 0) {
            monthlySum += order.totalPrice;
          }
        });
        setDailyIncome(dailySum);
        setWeeklyIncome(weeklySum);
        setMonthlyIncome(monthlySum);
      } catch (error) {
        console.log('Error cargando órdenes:', error);
      }
    };
    loadData();
  }, []);

  const goToCloseCash = () => {
    router.push('/(tabs)/finance/closeCash');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Gestor de Ingresos</Title>
      <Card style={styles.card}>
        <Card.Content>
          <PaperText style={styles.label}>Ingresos de Hoy:</PaperText>
          <PaperText style={styles.value}>${dailyIncome.toFixed(2)}</PaperText>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <PaperText style={styles.label}>Ingresos de la Semana:</PaperText>
          <PaperText style={styles.value}>${weeklyIncome.toFixed(2)}</PaperText>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <PaperText style={styles.label}>Ingresos del Mes:</PaperText>
          <PaperText style={styles.value}>${monthlyIncome.toFixed(2)}</PaperText>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={goToCloseCash} style={styles.button}>
        Ir a Cierre de Caja
      </Button>
    </View>
  );
}

function isSameDay(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 10, backgroundColor: '#f0f8ff' },
  label: { fontSize: 18, fontWeight: '600' },
  value: { fontSize: 18, marginTop: 5 },
  button: { marginTop: 20 },
});
