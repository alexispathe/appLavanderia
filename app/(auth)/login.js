// app/(auth)/login.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Por favor, ingresa email y contraseña.');
      return;
    }
    login({ email });
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Iniciar Sesión</Title>
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
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Entrar
      </Button>
      <Button onPress={() => router.push('resetPassword')} style={styles.link}>
        ¿Olvidaste tu contraseña?
      </Button>
      <Button onPress={() => router.push('register')} style={styles.link}>
        Crear Cuenta
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
