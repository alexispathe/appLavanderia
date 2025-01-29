// app/(tabs)/index.js
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      {/* Cada tab apunta a una carpeta/pantalla distinta */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="items/addItem"
        options={{
          title: 'Agregar Ítem',
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: 'Órdenes',
        }}
      />
      {/* Agrega más tabs si lo deseas */}
    </Tabs>
  );
}
