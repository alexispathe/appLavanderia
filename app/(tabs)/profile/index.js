// app/(tabs)/profile/index.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Paragraph } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Perfil</Title>
      {user ? (
        <>
          <Paragraph>Usuario logueado: {user.email}</Paragraph>
          <Button mode="contained" onPress={logout} style={styles.button}>
            Cerrar sesión
          </Button>
        </>
      ) : (
        <Paragraph>No estás autenticado</Paragraph>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 16 },
  button: { marginTop: 10 },
});
