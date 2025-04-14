import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, LogBox, ActivityIndicator } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashBoardScreen';
import FichaOdontoScreen from './src/screens/FichaOdontoScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import NotificacoesScreen from './src/screens/NotificacoesScreen';

import { RootStackParamList } from './src/types/navigation';
import { AccessibilityProvider, AccessibilityButton } from './src/components/AccessibilitySettings';
import { isAuthenticated, getCurrentUser } from './src/services/authService';

// Ignorar avisos específicos (opcional)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Manter a tela de splash visível até que os recursos estejam carregados
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  
  // Estado para controlar a tela inicial com base na autenticação
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [userData, setUserData] = useState<{nome: string} | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar se o usuário está autenticado ao iniciar o app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        
        if (authenticated) {
          const user = await getCurrentUser();
          if (user) {
            setUserData({ nome: user.nome });
            setInitialRoute('Dashboard');
          } else {
            setInitialRoute('Home');
          }
        } else {
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setInitialRoute('Home');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Callback para esconder a tela de splash quando os recursos estiverem prontos
  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded && initialRoute) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialRoute]);

  if (!fontsLoaded || !initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#45B3CB" />
      </View>
    );
  }

  return (
    <AccessibilityProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false, // Ocultar o cabeçalho padrão, usaremos nosso componente personalizado
              cardStyle: { backgroundColor: '#f0f0f0' },
              gestureEnabled: true,
              // As propriedades de animação devem estar dentro de 'animation'
              animation: 'default'
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              initialParams={userData ? { nome: userData.nome } : undefined}
            />
            <Stack.Screen name="FichaOdontoPage" component={FichaOdontoScreen} />
            <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
            <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} />
            <Stack.Screen name="NotificacoesScreen" component={NotificacoesScreen} />
          </Stack.Navigator>
          
          {/* Botão de acessibilidade flutuante */}
          <AccessibilityButton />
        </NavigationContainer>
      </View>
    </AccessibilityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});