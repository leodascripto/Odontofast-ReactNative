import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../config/apiConfig';

// Chaves para armazenamento local
const AVATAR_STORAGE_KEY = '@OdontoFast:userAvatar';
const AVATAR_CACHE_KEY = '@OdontoFast:avatarCache';

// Interfaces
export interface AvatarData {
  id?: number;
  userId: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
}

export interface UploadAvatarRequest {
  userId: number;
  file: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface AvatarResponse {
  success: boolean;
  message: string;
  data?: AvatarData;
  avatarUrl?: string;
}

/**
 * Serviço para gerenciar avatares do usuário
 * Preparado para integração com API .NET
 */
class AvatarService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  /**
   * Obtém o token de autenticação do AsyncStorage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@OdontoFast:authToken');
    } catch (error) {
      console.error('Erro ao obter token de autenticação:', error);
      return null;
    }
  }

  /**
   * Faz upload do avatar para a API .NET
   * @param uploadData Dados do upload (userId e arquivo)
   * @returns Promise com resposta do upload
   */
  async uploadAvatar(uploadData: UploadAvatarRequest): Promise<AvatarResponse> {
    try {
      const token = await this.getAuthToken();
      
      // Primeiro, verifica se já existe uma imagem para este usuário
      const existingImage = await this.getUserAvatar(uploadData.userId);
      
      // Dados para enviar à API (usando string base64 do caminho da imagem)
      const imagePayload = {
        idUsuario: uploadData.userId,
        caminhoImg: uploadData.file.uri // Por enquanto, armazena a URI local
      };

      let response;
      let apiUrl;

      if (existingImage) {
        // Se já existe, atualiza (PUT)
        apiUrl = `${this.baseUrl}/ImagemUsuario/${uploadData.userId}`;
        response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            caminhoImg: uploadData.file.uri
          }),
        });
      } else {
        // Se não existe, cria (POST)
        apiUrl = `${this.baseUrl}/ImagemUsuario`;
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify(imagePayload),
        });
      }

      if (response.ok) {
        const result = await response.json();
        // Salva no cache local
        await this.saveAvatarToCache(uploadData.userId, uploadData.file.uri);
        
        return {
          success: true,
          message: 'Avatar salvo com sucesso',
          data: result,
          avatarUrl: uploadData.file.uri,
        };
      } else {
        const errorResult = await response.json();
        return {
          success: false,
          message: errorResult.Message || 'Erro ao salvar avatar',
        };
      }
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      
      // Fallback: salva localmente se API não estiver disponível
      await this.saveAvatarToCache(uploadData.userId, uploadData.file.uri);
      
      return {
        success: true,
        message: 'Avatar salvo localmente (API indisponível)',
        avatarUrl: uploadData.file.uri,
      };
    }
  }

  /**
   * Obtém o avatar do usuário da API
   * @param userId ID do usuário
   * @returns Promise com URL do avatar ou null
   */
  async getUserAvatar(userId: number): Promise<string | null> {
    try {
      // Primeiro, tenta carregar do cache local
      const cachedAvatar = await this.getAvatarFromCache(userId);
      if (cachedAvatar) {
        return cachedAvatar;
      }

      const token = await this.getAuthToken();

      // Faz requisição para API .NET usando o endpoint correto
      const response = await fetch(`${this.baseUrl}/ImagemUsuario/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.caminhoImg) {
          // Salva no cache
          await this.saveAvatarToCache(userId, result.caminhoImg);
          return result.caminhoImg;
        }
      } else if (response.status === 404) {
        // Usuário não tem avatar
        return null;
      }

      return null;
    } catch (error) {
      console.error('Erro ao obter avatar do usuário:', error);
      
      // Fallback: tenta carregar do cache local
      return await this.getAvatarFromCache(userId);
    }
  }

  /**
   * Remove o avatar do usuário
   * @param userId ID do usuário
   * @returns Promise<boolean> indicando sucesso
   */
  async deleteUserAvatar(userId: number): Promise<boolean> {
    try {
      const token = await this.getAuthToken();

      // Faz requisição DELETE para API .NET usando o endpoint correto
      const response = await fetch(`${this.baseUrl}/ImagemUsuario/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        // Remove do cache local
        await this.removeAvatarFromCache(userId);
        return true;
      } else if (response.status === 404) {
        // Avatar não encontrado, mas consideramos sucesso
        await this.removeAvatarFromCache(userId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao deletar avatar:', error);
      
      // Fallback: remove do cache local
      await this.removeAvatarFromCache(userId);
      return true; // Considera sucesso se conseguiu remover localmente
    }
  }

  /**
   * Atualiza o avatar do usuário (substitui o existente)
   * @param uploadData Dados do novo avatar
   * @returns Promise com resposta da atualização
   */
  async updateAvatar(uploadData: UploadAvatarRequest): Promise<AvatarResponse> {
    try {
      // Primeiro remove o avatar atual
      await this.deleteUserAvatar(uploadData.userId);
      
      // Depois faz upload do novo
      return await this.uploadAvatar(uploadData);
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      return {
        success: false,
        message: 'Erro ao atualizar avatar',
      };
    }
  }

  /**
   * Verifica se o usuário possui avatar
   * @param userId ID do usuário
   * @returns Promise<boolean> indicando se possui avatar
   */
  async checkUserHasAvatar(userId: number): Promise<boolean> {
    try {
      const token = await this.getAuthToken();

      // Usa o endpoint exists da API
      const response = await fetch(`${this.baseUrl}/ImagemUsuario/${userId}/exists`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.possuiImagem || false;
      }

      return false;
    } catch (error) {
      console.error('Erro ao verificar se usuário possui avatar:', error);
      // Fallback: verifica no cache local
      const cachedAvatar = await this.getAvatarFromCache(userId);
      return !!cachedAvatar;
    }
  }
   * @param userId ID do usuário
   * @returns Promise com array de avatares
   */
  async getAvatarHistory(userId: number): Promise<AvatarData[]> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/usuario/${userId}/avatar/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }

      return [];
    } catch (error) {
      console.error('Erro ao obter histórico de avatares:', error);
      return [];
    }
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * @param file Dados do arquivo
   * @returns boolean indicando se é válido
   */
  validateImageFile(file: { uri: string; type: string; name?: string }): boolean {
    // Tipos de imagem aceitos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    // Verifica o tipo MIME
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return false;
    }

    // Verifica a extensão (se disponível)
    if (file.name) {
      const extension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!extension || !allowedExtensions.includes(extension)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Redimensiona a imagem (implementação futura)
   * @param imageUri URI da imagem
   * @param maxWidth Largura máxima
   * @param maxHeight Altura máxima
   * @returns Promise com URI da imagem redimensionada
   */
  async resizeImage(imageUri: string, maxWidth: number = 800, maxHeight: number = 800): Promise<string> {
    // TODO: Implementar redimensionamento usando expo-image-manipulator
    // Por enquanto, retorna a URI original
    return imageUri;
  }

  // Métodos para cache local

  /**
   * Salva avatar no cache local
   */
  private async saveAvatarToCache(userId: number, avatarUrl: string): Promise<void> {
    try {
      const cacheKey = `${AVATAR_CACHE_KEY}_${userId}`;
      await AsyncStorage.setItem(cacheKey, avatarUrl);
    } catch (error) {
      console.error('Erro ao salvar avatar no cache:', error);
    }
  }

  /**
   * Obtém avatar do cache local
   */
  private async getAvatarFromCache(userId: number): Promise<string | null> {
    try {
      const cacheKey = `${AVATAR_CACHE_KEY}_${userId}`;
      return await AsyncStorage.getItem(cacheKey);
    } catch (error) {
      console.error('Erro ao obter avatar do cache:', error);
      return null;
    }
  }

  /**
   * Remove avatar do cache local
   */
  private async removeAvatarFromCache(userId: number): Promise<void> {
    try {
      const cacheKey = `${AVATAR_CACHE_KEY}_${userId}`;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Erro ao remover avatar do cache:', error);
    }
  }

  /**
   * Limpa todo o cache de avatares
   */
  async clearAvatarCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const avatarKeys = keys.filter(key => key.startsWith(AVATAR_CACHE_KEY));
      
      if (avatarKeys.length > 0) {
        await AsyncStorage.multiRemove(avatarKeys);
      }
    } catch (error) {
      console.error('Erro ao limpar cache de avatares:', error);
    }
  }
}

// Exporta uma instância singleton do serviço
export const avatarService = new AvatarService();
export default avatarService;