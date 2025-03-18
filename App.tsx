import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashBoardScreen';
import FichaOdontoScreen from './src/screens/FichaOdontoScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import NotificacoesScreen from './src/screens/NotificacoesScreen'; // Importação da nova tela

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Dashboard: { nome: string };
  FichaOdontoPage: undefined;
  AgendaScreen: undefined;
  ChecklistScreen: undefined;
  NotificacoesScreen: undefined; // Adicionada a nova tela
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Page' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login Page' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="FichaOdontoPage"
          component={FichaOdontoScreen}
          options={{ title: 'Ficha Odontológica' }}
        />
        <Stack.Screen
          name="AgendaScreen"
          component={AgendaScreen}
          options={{ title: 'Agenda' }}
        />
        <Stack.Screen
          name="ChecklistScreen"
          component={ChecklistScreen}
          options={{ title: 'Checklist' }}
        />
        <Stack.Screen
          name="NotificacoesScreen" // Adicionada a nova tela no Stack.Navigator
          component={NotificacoesScreen}
          options={{ title: 'Notificações' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
