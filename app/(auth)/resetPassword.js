// app/(auth)/resetPassword.js
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email.trim() === '') {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    // Lógica para restablecer la contraseña (mock)
    // Aquí puedes integrar un servicio real de restablecimiento de contraseña
    alert('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
    router.push('(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Enviar Enlace" onPress={handleResetPassword} />
      <Link href="(auth)/login" style={styles.link}>
        Volver a Iniciar Sesión
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  link: { marginTop: 8, color: 'blue', textAlign: 'center' },
});
