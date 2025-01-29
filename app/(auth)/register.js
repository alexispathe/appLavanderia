// app/(auth)/register.js
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth(); // Opcional: Auto login después de registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }
    // Aquí agregarías la lógica real de registro
    // Por ahora, simulamos un registro exitoso
    login({ email });
    router.replace('(tabs)'); // Usa replace para evitar volver a la pantalla de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
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
      <Button title="Crear" onPress={handleRegister} />
      <Link href="login" style={styles.link}>
        Ya tengo una cuenta
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
