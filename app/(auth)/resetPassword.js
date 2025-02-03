// app/(auth)/resetPassword.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email.trim() === '') {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    alert('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
    router.push('(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Restablecer Contraseña</Title>
      <TextInput
        mode="outlined"
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
        Enviar Enlace
      </Button>
      <Button onPress={() => router.push('(auth)/login')} style={styles.link}>
        Volver a Iniciar Sesión
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
