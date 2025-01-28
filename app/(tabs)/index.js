// app/(tabs)/index.js
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Inicio',
          // Puedes agregar iconos o ajustes de tab aquí
        }}
      />
      <Tabs.Screen
        name="items/index"
        options={{
          title: 'Ítems',
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: 'Órdenes',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
