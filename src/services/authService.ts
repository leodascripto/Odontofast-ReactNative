import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_ENDPOINTS } from '../config/apiConfig';

// Chaves para armazenamento
const AUTH_TOKEN_KEY = '@OdontoFast:authToken';
const USER_DATA_KEY = '@OdontoFast:userData';

// Interface para dados do usuário
export interface UserData {
  id?: number;
  nome: string;
  email?: string;
  nrCarteira?: string;
  perfil?: string;
  // outros campos que o usuário possa ter
}

// Interface para resposta de login
interface LoginResponse {
  token?: string;
  nome: string;
  // outros campos que o backend retorne
}

/**
 * Realiza o login na API
 */
export const login = async (nrCarteira: string, senha: string): Promise<UserData> => {
  try {
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nrCarteira, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensagem || 'Falha ao fazer login');
    }

    const data: LoginResponse = await response.json();
    
    // Objeto com dados do usuário
    const userData: UserData = {
      nome: data.nome,
      nrCarteira,
    };

    // Salvar token e dados do usuário
    if (data.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
    }
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

/**
 * Realiza login rápido para testes
 */
export const quickLogin = async (): Promise<UserData> => {
  try {
    // Dados de teste do usuário
    const userData: UserData = {
      nome: 'Usuário Teste',
      nrCarteira: '123456',
      email: 'teste@odontofast.com',
      perfil: 'paciente'
    };

    // Salvar dados fictícios
    const fakeToken = 'fake-jwt-token-' + new Date().getTime();
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error('Erro no login rápido:', error);
    throw error;
  }
};

/**
 * Verifica se o usuário está logado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return !!token; // Converte para booleano (true se token existir)
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

/**
 * Obtém os dados do usuário atual
 */
export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!userDataString) return null;
    
    return JSON.parse(userDataString) as UserData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};

/**
 * Realiza o logout do usuário
 */
export const logout = async (): Promise<void> => {
  try {
    // Remover todos os dados de autenticação
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};