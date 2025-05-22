import { Platform } from "react-native";
import Constants from "expo-constants";

// Configurações do ambiente
type Environment = "development" | "production";

// Por padrão, usamos o ambiente de desenvolvimento
const ENV: Environment = __DEV__ ? "development" : "production";

// Obtendo as configurações do app.json
const expoConfig = Constants.expoConfig;
const apiUrlFromConfig = expoConfig?.extra?.apiUrl;

// Definição dos URLs base para cada ambiente
const API_BASE_URLS = {
  development: {
    // Para ambientes de desenvolvimento local
    // Localhost no iOS e 10.0.2.2 no Android (loopback para emulador)
    ios: "http://localhost:5058/api",
    android: "http://10.0.2.2:5058/api",
    // URL de fallback para rodar no navegador ou em dispositivos reais de teste
    default: "http://192.168.1.11:5058/api"
  },
  production: {
    // Em produção, usamos o mesmo URL para iOS e Android
    ios: "https://api.odontofast.com.br/api",
    android: "https://api.odontofast.com.br/api",
    default: "https://api.odontofast.com.br/api",
  }
};

// Definições para a API Python de checklist
const PYTHON_API_BASE_URLS = {
  development: {
    ios: "http://localhost:5000",
    android: "http://10.0.2.2:5000",
    default: "http://192.168.1.11:5000"
  },
  production: {
    ios: "https://checklist.odontofast.com.br",
    android: "https://checklist.odontofast.com.br",
    default: "https://checklist.odontofast.com.br"
  }
};

// Função para obter o URL base da API .NET
export const getApiBaseUrl = (): string => {
  // Se a configuração veio do app.json, usamos ela
  if (apiUrlFromConfig) {
    return apiUrlFromConfig;
  }

  // Caso contrário, usamos a configuração baseada na plataforma
  const platform = Platform.OS as "ios" | "android" | "default";
  
  // Obtemos da configuração ou usamos o default
  return API_BASE_URLS[ENV][platform] || API_BASE_URLS[ENV].default;
};

// Função para obter o URL base da API Python
export const getPythonApiBaseUrl = (): string => {
  const platform = Platform.OS as "ios" | "android" | "default";
  return PYTHON_API_BASE_URLS[ENV][platform] || PYTHON_API_BASE_URLS[ENV].default;
};

// Endpoints específicos
export const API_ENDPOINTS = {
  // 🔑 Endpoints existentes (mantidos)
  login: `${getApiBaseUrl()}/login`,
  user: (id: number) => `${getApiBaseUrl()}/Usuario/${id}`,
  checklist: `${getPythonApiBaseUrl()}/checklist`,
  
  // 🖼️ Novos endpoints para avatar
  avatar: {
    get: (userId: number) => `${getApiBaseUrl()}/ImagemUsuario/${userId}`,
    create: () => `${getApiBaseUrl()}/ImagemUsuario`,
    update: (userId: number) => `${getApiBaseUrl()}/ImagemUsuario/${userId}`,
    delete: (userId: number) => `${getApiBaseUrl()}/ImagemUsuario/${userId}`,
    exists: (userId: number) => `${getApiBaseUrl()}/ImagemUsuario/${userId}/exists`,
  },
  
  // 🔮 Futuros endpoints (preparados para expansão)
  usuario: {
    getById: (id: number) => `${getApiBaseUrl()}/Usuario/${id}`,
    update: (id: number) => `${getApiBaseUrl()}/Usuario/${id}`,
    // Adicione outros endpoints de usuário conforme necessário
  },
  
  // 📊 Outros endpoints que podem ser adicionados no futuro
  consultas: {
    // getByUserId: (userId: number) => `${getApiBaseUrl()}/Consultas/usuario/${userId}`,
    // create: () => `${getApiBaseUrl()}/Consultas`,
    // update: (id: number) => `${getApiBaseUrl()}/Consultas/${id}`,
    // delete: (id: number) => `${getApiBaseUrl()}/Consultas/${id}`,
  },
  
  // 🔔 Endpoints de notificações (preparados)
  notificacoes: {
    // getByUserId: (userId: number) => `${getApiBaseUrl()}/Notificacoes/usuario/${userId}`,
    // markAsRead: (id: number) => `${getApiBaseUrl()}/Notificacoes/${id}/read`,
  }
};

export default API_ENDPOINTS;