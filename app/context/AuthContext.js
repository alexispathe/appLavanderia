import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cargar usuario desde almacenamiento local si existe
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error al cargar usuario', error);
      }
    };
    loadUserData();
  }, []);

  const login = async (email, password) => {
    // Lógica de autenticación simulada
    // Podrías buscar en un "storageService" para validar credenciales
    if (email === 'test@test.com' && password === '123456') {
      const userData = { id: '1', email };
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (email, password) => {
    // Lógica de registro simulada
    const userData = { id: Date.now().toString(), email };
    // Guardar usuario en AsyncStorage
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
