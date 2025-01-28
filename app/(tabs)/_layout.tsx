// app/tabs.js o donde estés manejando los tabs
import { Tabs } from 'expo-router';
import { Platform, Button } from 'react-native'; // Asegúrate de importar Button aquí también
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router'; // Necesitas importar useRouter para la navegación

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Usar el hook para redirigir a la pantalla de bienvenida

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Homes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarButton: () => <Button title="Ir a Bienvenida" onPress={() => router.push("/welcome")} />,
          
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      {/* Aquí puedes agregar un botón que navegue a la pantalla de bienvenida */}
      <Tabs.Screen
        name="welcome"
        options={{
          title: 'Bienvenida',
          tabBarButton: () => <Button title="Ir a Bienvenida" onPress={() => router.push("/welcome")} />,
        }}
      />
    </Tabs>
  );
}
