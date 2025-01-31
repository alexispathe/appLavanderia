// app/(tabs)/finance/index.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export default function FinanceScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [dailyIncome, setDailyIncome] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];

        // Filtramos solo las órdenes pagadas
        const paidOrders = ordersArray.filter((o) => o.paymentStatus === 'Pagado');

        setOrders(paidOrders);

        const now = new Date();

        let dailySum = 0;
        let weeklySum = 0;
        let monthlySum = 0;

        paidOrders.forEach((order) => {
          const updatedAt = new Date(order.updatedAt); 
          // O podrías usar paidAt si lo tuvieras

          // Si está pagado hoy:
          if (isSameDay(now, updatedAt)) {
            dailySum += order.totalPrice;
          }

          // Si está dentro de la misma semana (aprox)
          if (differenceInWeeks(now, updatedAt) === 0) {
            weeklySum += order.totalPrice;
          }

          // Si está dentro del mismo mes (aprox)
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
      <Text style={styles.title}>Gestor de Ingresos</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Ingresos de Hoy:</Text>
        <Text style={styles.value}>${dailyIncome.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Ingresos de la Semana:</Text>
        <Text style={styles.value}>${weeklyIncome.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Ingresos del Mes:</Text>
        <Text style={styles.value}>${monthlyIncome.toFixed(2)}</Text>
      </View>

      <Button title="Ir a Cierre de Caja" onPress={goToCloseCash} />
    </View>
  );
}

// Funciones auxiliares simples
function isSameDay(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  label: { fontSize: 18, fontWeight: '600' },
  value: { fontSize: 18, marginTop: 5 },
});
