// app/(auth)/register.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }
    login({ email });
    router.replace('(tabs)');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Cuenta</Title>
      <TextInput
        mode="outlined"
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Crear
      </Button>
      <Button onPress={() => router.push('login')} style={styles.link}>
        Ya tengo una cuenta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginVertical: 5 },
  link: { marginVertical: 3 },
});
