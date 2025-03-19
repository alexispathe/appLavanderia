import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Card, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export default function ReportsScreen() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [dailyIncome, setDailyIncome] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        const ordersArray = storedOrders ? JSON.parse(storedOrders) : [];
        setTotalOrders(ordersArray.length);

        const now = new Date();
        let dailySum = 0, weeklySum = 0, monthlySum = 0;
        ordersArray.forEach(order => {
          // Suponiendo que order.totalPrice y order.paymentStatus están definidos
          if (order.paymentStatus === 'Pagado') {
            const updatedAt = new Date(order.updatedAt);
            if (
              now.getDate() === updatedAt.getDate() &&
              now.getMonth() === updatedAt.getMonth() &&
              now.getFullYear() === updatedAt.getFullYear()
            ) {
              dailySum += order.totalPrice;
            }
            if (differenceInWeeks(now, updatedAt) === 0) {
              weeklySum += order.totalPrice;
            }
            if (differenceInMonths(now, updatedAt) === 0) {
              monthlySum += order.totalPrice;
            }
          }
        });
        setDailyIncome(dailySum);
        setWeeklyIncome(weeklySum);
        setMonthlyIncome(monthlySum);
      } catch (error) {
        console.log('Error cargando datos de reportes:', error);
      }
    };
    loadReportData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Reportes y Analítica</Title>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Total de Órdenes: {totalOrders}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Ingresos de Hoy: ${dailyIncome.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Ingresos de la Semana: ${weeklyIncome.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Ingresos del Mes: ${monthlyIncome.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
      {/* Puedes agregar más análisis y gráficos si lo requieres */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 10 },
});
