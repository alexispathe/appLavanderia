// app/welcome.js
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App de Lavandería</Text>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={() => router.push('(auth)/login')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Crear una Cuenta" onPress={() => router.push('(auth)/register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  buttonContainer: { marginVertical: 10 },
});
