import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LoginArea } from './src/components/LoginArea';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [professorName, setProfessorName] = useState('');

  const handleLogin = (username: string, password: string, category: string) => {
    console.log('Login attempt:', { username, password, category });
    setProfessorName(username.toUpperCase());
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfessorName('');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginArea onLogin={handleLogin} />
        <StatusBar hidden={true} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabNavigator professorName={professorName} onLogout={handleLogout} />
      <StatusBar hidden={true} />
    </NavigationContainer>
  );
}
