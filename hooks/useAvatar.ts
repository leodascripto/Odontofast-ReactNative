import { useState, useEffect } from 'react';
import { avatarService } from '../services/avatarService';

/**
 * Hook personalizado para gerenciar avatar do usuário
 * @param userId ID do usuário
 * @returns Objeto com estado e funções do avatar
 */
export const useAvatar = (userId?: number) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasAvatar, setHasAvatar] = useState<boolean>(false);

  // Carrega o avatar quando o userId muda
  useEffect(() => {
    if (userId) {
      loadAvatar();
    }
  }, [userId]);

  /**
   * Carrega o avatar do usuário
   */
  const loadAvatar = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const avatar = await avatarService.getUserAvatar(userId);
      setAvatarUri(avatar);
      setHasAvatar(!!avatar);
    } catch (error) {
      console.error('Erro ao carregar avatar:', error);
      setAvatarUri(null);
      setHasAvatar(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza o avatar do usuário
   * @param imageUri URI da nova imagem
   */
  const updateAvatar = async (imageUri: string, fileName?: string) => {
    if (!userId) return false;

    setLoading(true);
    try {
      const result = await avatarService.uploadAvatar({
        userId,
        file: {
          uri: imageUri,
          type: 'image/jpeg',
          name: fileName || 'avatar.jpg'
        }
      });

      if (result.success) {
        setAvatarUri(result.avatarUrl || imageUri);
        setHasAvatar(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove o avatar do usuário
   */
  const removeAvatar = async () => {
    if (!userId) return false;

    setLoading(true);
    try {
      const success = await avatarService.deleteUserAvatar(userId);
      if (success) {
        setAvatarUri(null);
        setHasAvatar(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica se o usuário tem avatar
   */
  const checkHasAvatar = async () => {
    if (!userId) return false;

    try {
      const exists = await avatarService.checkUserHasAvatar(userId);
      setHasAvatar(exists);
      return exists;
    } catch (error) {
      console.error('Erro ao verificar avatar:', error);
      return false;
    }
  };

  return {
    avatarUri,
    loading,
    hasAvatar,
    loadAvatar,
    updateAvatar,
    removeAvatar,
    checkHasAvatar,
  };
};

export default useAvatar;