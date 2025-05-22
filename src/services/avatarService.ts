import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/apiConfig';

// Chaves para armazenamento local
const AVATAR_CACHE_KEY = '@OdontoFast:avatarCache';

// Interfaces baseadas na sua API .NET
export interface ImagemUsuarioDTO {
  idUsuario: number;
  caminhoImg: string;
}

export interface ImagemUsuarioCreateDTO {
  idUsuario: number;
  caminhoImg: string;
}

export interface ImagemUsuarioUpdateDTO {
  caminhoImg: string;
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
  data?: ImagemUsuarioDTO;
  avatarUrl?: string;
}

/**
 * Serviço para gerenciar avatares do usuário integrado com API .NET
 */
class AvatarService {

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
      // Primeiro, verifica se já existe uma imagem para este usuário
      const existingImage = await this.getUserAvatar(uploadData.userId);

      let response;

      if (existingImage) {
        // Se já existe, atualiza (PUT)
        const requestBody: ImagemUsuarioUpdateDTO = {
          caminhoImg: uploadData.file.uri
        };

        response = await fetch(API_ENDPOINTS.avatar.update(uploadData.userId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        // Se não existe, cria (POST)
        const requestBody: ImagemUsuarioCreateDTO = {
          idUsuario: uploadData.userId,
          caminhoImg: uploadData.file.uri
        };

        response = await fetch(API_ENDPOINTS.avatar.create(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (response.ok) {
        const result: ImagemUsuarioDTO = await response.json();
        
        // Salva no cache local
        await this.saveAvatarToCache(uploadData.userId, result.caminhoImg);
        
        console.log('✅ Avatar salvo com sucesso na API:', result);
        
        return {
          success: true,
          message: existingImage ? 'Avatar atualizado com sucesso!' : 'Avatar criado com sucesso!',
          data: result,
          avatarUrl: result.caminhoImg,
        };
      } else {
        const errorResult = await response.json();
        console.error('❌ Erro da API:', errorResult);
        
        return {
          success: false,
          message: errorResult.Message || errorResult.message || 'Erro ao salvar avatar',
        };
      }
    } catch (error) {
      console.error('❌ Erro no upload do avatar:', error);
      
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
      // Primeiro, tenta carregar da API
      const response = await fetch(API_ENDPOINTS.avatar.get(userId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result: ImagemUsuarioDTO = await response.json();
        
        if (result.caminhoImg) {
          // Salva no cache
          await this.saveAvatarToCache(userId, result.caminhoImg);
          console.log('✅ Avatar carregado da API:', result.caminhoImg);
          return result.caminhoImg;
        }
      } else if (response.status === 404) {
        // Usuário não tem avatar na API
        console.log('ℹ️ Usuário não possui avatar na API');
        return null;
      } else {
        console.warn('⚠️ Erro ao buscar avatar da API, tentando cache local');
      }

      // Fallback: tenta carregar do cache local
      return await this.getAvatarFromCache(userId);
    } catch (error) {
      console.error('❌ Erro ao obter avatar do usuário:', error);
      
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
      // Faz requisição DELETE para API .NET
      const response = await fetch(API_ENDPOINTS.avatar.delete(userId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Avatar removido da API:', result);
        
        // Remove do cache local
        await this.removeAvatarFromCache(userId);
        return true;
      } else if (response.status === 404) {
        // Avatar não encontrado na API, mas consideramos sucesso
        console.log('ℹ️ Avatar não encontrado na API para remoção');
        await this.removeAvatarFromCache(userId);
        return true;
      } else {
        const errorResult = await response.json();
        console.error('❌ Erro ao deletar avatar da API:', errorResult);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao deletar avatar:', error);
      
      // Fallback: remove do cache local
      await this.removeAvatarFromCache(userId);
      return true; // Considera sucesso se conseguiu remover localmente
    }
  }

  /**
   * Verifica se o usuário possui avatar
   * @param userId ID do usuário
   * @returns Promise<boolean> indicando se possui avatar
   */
  async checkUserHasAvatar(userId: number): Promise<boolean> {
    try {
      // Usa o endpoint exists da API
      const response = await fetch(API_ENDPOINTS.avatar.exists(userId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Verificação de avatar da API:', result);
        return result.possuiImagem || false;
      } else {
        console.warn('⚠️ Erro ao verificar avatar na API, usando cache local');
      }

      // Fallback: verifica no cache local
      const cachedAvatar = await this.getAvatarFromCache(userId);
      return !!cachedAvatar;
    } catch (error) {
      console.error('❌ Erro ao verificar se usuário possui avatar:', error);
      // Fallback: verifica no cache local
      const cachedAvatar = await this.getAvatarFromCache(userId);
      return !!cachedAvatar;
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
      console.warn('⚠️ Tipo de arquivo não permitido:', file.type);
      return false;
    }

    // Verifica a extensão (se disponível)
    if (file.name) {
      const extension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!extension || !allowedExtensions.includes(extension)) {
        console.warn('⚠️ Extensão de arquivo não permitida:', extension);
        return false;
      }
    }

    return true;
  }

  // Métodos para cache local

  /**
   * Salva avatar no cache local
   */
  private async saveAvatarToCache(userId: number, avatarUrl: string): Promise<void> {
    try {
      const cacheKey = `${AVATAR_CACHE_KEY}_${userId}`;
      await AsyncStorage.setItem(cacheKey, avatarUrl);
      console.log('💾 Avatar salvo no cache local:', cacheKey);
    } catch (error) {
      console.error('❌ Erro ao salvar avatar no cache:', error);
    }
  }

  /**
   * Obtém avatar do cache local
   */
  private async getAvatarFromCache(userId: number): Promise<string | null> {
    try {
      const cacheKey = `${AVATAR_CACHE_KEY}_${userId}`;
      const cachedAvatar = await AsyncStorage.getItem(cacheKey);
      if (cachedAvatar) {
        console.log('💾 Avatar carregado do cache local:', cacheKey);
      }
      return cachedAvatar;
    } catch (error) {
      console.error('❌ Erro ao obter avatar do cache:', error);
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
      console.log('🗑️ Avatar removido do cache local:', cacheKey);
    } catch (error) {
      console.error('❌ Erro ao remover avatar do cache:', error);
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
        console.log('🧹 Cache de avatares limpo:', avatarKeys.length, 'itens removidos');
      }
    } catch (error) {
      console.error('❌ Erro ao limpar cache de avatares:', error);
    }
  }
}

// Exporta uma instância singleton do serviço
export const avatarService = new AvatarService();
export default avatarService;