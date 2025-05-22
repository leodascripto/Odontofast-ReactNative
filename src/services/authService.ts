import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/apiConfig';

// Chaves para AsyncStorage
const AUTH_TOKEN_KEY = '@OdontoFast:authToken';
const USER_DATA_KEY = '@OdontoFast:userData';
const IS_AUTHENTICATED_KEY = '@OdontoFast:isAuthenticated';

// Interface para dados do usuário (baseado na sua API)
interface UserData {
  id: number;
  nome: string;
  email: string;
  nrCarteira: string;
  telefone?: number;
}

// Interface para resposta do login da API
interface LoginResponse {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  nrCarteira: string;
  telefoneUsuario: number;
}

/**
 * Realiza o login na API
 */
export const login = async (nrCarteira: string, senha: string): Promise<UserData> => {
  try {
    console.log('🔐 Tentando fazer login com carteira:', nrCarteira);
    
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nrCarteira, senha }),
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro da API:', errorData);
      throw new Error(errorData.message || errorData.mensagem || 'Credenciais inválidas');
    }

    const data: LoginResponse = await response.json();
    console.log('✅ Resposta da API de login:', data);
    
    // Mapeia os campos corretos da resposta da API
    const userData: UserData = {
      id: data.idUsuario,
      nome: data.nomeUsuario,
      email: data.emailUsuario,
      nrCarteira: data.nrCarteira,
      telefone: data.telefoneUsuario,
    };

    // Salvar dados do usuário e status de autenticação
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(IS_AUTHENTICATED_KEY, 'true');

    console.log('💾 Dados do usuário salvos:', userData);
    return userData;
  } catch (error) {
    console.error('❌ Erro no login:', error);
    throw error;
  }
};

/**
 * Função de login rápido para desenvolvimento
 */
export const quickLogin = async (): Promise<UserData> => {
  try {
    console.log('🚀 Fazendo login rápido para desenvolvimento');
    
    // Dados simulados para desenvolvimento
    const userData: UserData = {
      id: 1,
      nome: 'Leonardo (Dev)',
      email: 'dev@odontofast.com',
      nrCarteira: '123456789',
      telefone: 11999999999,
    };

    // Salvar dados do usuário e status de autenticação
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(IS_AUTHENTICATED_KEY, 'true');

    console.log('✅ Login rápido realizado:', userData);
    return userData;
  } catch (error) {
    console.error('❌ Erro no login rápido:', error);
    throw error;
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const authStatus = await AsyncStorage.getItem(IS_AUTHENTICATED_KEY);
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    const isAuth = authStatus === 'true' && userData !== null;
    console.log('🔍 Status de autenticação:', isAuth);
    
    return isAuth;
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return false;
  }
};

/**
 * Obtém os dados do usuário atual
 */
export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('👤 Dados do usuário atual:', parsedData);
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao obter dados do usuário:', error);
    return null;
  }
};

/**
 * Realiza o logout do usuário
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('🚪 Fazendo logout do usuário');
    
    // Remove todos os dados de autenticação e usuário
    await AsyncStorage.multiRemove([
      AUTH_TOKEN_KEY,
      USER_DATA_KEY,
      IS_AUTHENTICATED_KEY
    ]);
    
    console.log('✅ Logout realizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error);
    throw error;
  }
};

/**
 * Atualiza os dados do usuário no AsyncStorage
 */
export const updateUserData = async (newUserData: Partial<UserData>): Promise<void> => {
  try {
    const currentData = await getCurrentUser();
    if (currentData) {
      const updatedData = { ...currentData, ...newUserData };
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedData));
      console.log('✅ Dados do usuário atualizados:', updatedData);
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar dados do usuário:', error);
    throw error;
  }
};

/**
 * Obtém o token de autenticação (se existir)
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('❌ Erro ao obter token de autenticação:', error);
    return null;
  }
};

/**
 * Salva o token de autenticação
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log('✅ Token de autenticação salvo');
  } catch (error) {
    console.error('❌ Erro ao salvar token de autenticação:', error);
    throw error;
  }
};

/**
 * Limpa todos os dados armazenados (útil para debug)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    console.log('🧹 Limpando todos os dados armazenados');
    await AsyncStorage.clear();
    console.log('✅ Todos os dados foram limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
};