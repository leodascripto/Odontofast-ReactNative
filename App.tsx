import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashBoardScreen';
import FichaOdontoScreen from './src/screens/FichaOdontoScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import NotificacoesScreen from './src/screens/NotificacoesScreen';

import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Page' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login Page' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="FichaOdontoPage" component={FichaOdontoScreen} options={{ title: 'Ficha Odontológica' }} />
        <Stack.Screen name="AgendaScreen" component={AgendaScreen} options={{ title: 'Agenda' }} />
        <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} options={{ title: 'Checklist' }} />
        <Stack.Screen name="NotificacoesScreen" component={NotificacoesScreen} options={{ title: 'Notificações' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
