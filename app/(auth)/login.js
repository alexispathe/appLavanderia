// app/(auth)/login.js
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
    // Aquí agregarías la lógica real de autenticación
    // Por ahora, simulamos un login exitoso
    login({ email });
    router.replace('(tabs)'); // Usa replace para evitar volver a la pantalla de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Link href="resetPassword" style={styles.link}>
        ¿Olvidaste tu contraseña?
      </Link>
      <Link href="register" style={styles.link}>
        Crear Cuenta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  input: { 
    borderWidth: 1, 
    marginBottom: 12, 
    padding: 8, 
    borderRadius: 4 
  },
  link: { 
    marginTop: 8, 
    color: 'blue', 
    textAlign: 'center' 
  },
});
