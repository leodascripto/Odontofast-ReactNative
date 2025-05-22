import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para o componente
interface UserAvatarProps {
  userId?: number;
  defaultImage?: any;
  size?: number;
  onImageChange?: (imageUri: string | null) => void;
}

interface ImageData {
  uri: string;
  base64?: string;
  type: string;
  fileName?: string;
}

const USER_AVATAR_KEY = '@OdontoFast:userAvatar';

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  defaultImage = require('../assets/images/fastinho.png'),
  size = 80,
  onImageChange
}) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);

  // Carrega a imagem salva ao inicializar o componente
  useEffect(() => {
    loadSavedAvatar();
  }, [userId]);

  // Carrega avatar salvo no AsyncStorage
  const loadSavedAvatar = async () => {
    try {
      const savedUri = await AsyncStorage.getItem(`${USER_AVATAR_KEY}_${userId || 'default'}`);
      if (savedUri) {
        setAvatarUri(savedUri);
        setHasCustomAvatar(true);
      }
    } catch (error) {
      console.error('Erro ao carregar avatar:', error);
    }
  };

  // Salva avatar no AsyncStorage
  const saveAvatar = async (uri: string | null) => {
    try {
      const key = `${USER_AVATAR_KEY}_${userId || 'default'}`;
      if (uri) {
        await AsyncStorage.setItem(key, uri);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
    }
  };

  // Função para fazer upload da imagem para a API (preparada para implementação futura)
  const uploadImageToAPI = async (imageData: ImageData): Promise<string | null> => {
    // TODO: Implementar quando a API .NET estiver pronta
    // const formData = new FormData();
    // formData.append('file', {
    //   uri: imageData.uri,
    //   type: imageData.type,
    //   name: imageData.fileName || 'avatar.jpg',
    // } as any);
    // formData.append('userId', userId?.toString() || '');
    
    // try {
    //   const response = await fetch(`${API_BASE_URL}/usuario/avatar`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${token}`,
    //     },
    //     body: formData,
    //   });
    
    //   if (response.ok) {
    //     const result = await response.json();
    //     return result.avatarUrl;
    //   }
    // } catch (error) {
    //   console.error('Erro no upload:', error);
    // }

    // Por enquanto, retorna a URI local
    return imageData.uri;
  };

  // Função para deletar imagem da API (preparada para implementação futura)
  const deleteImageFromAPI = async (): Promise<boolean> => {
    // TODO: Implementar quando a API .NET estiver pronta
    // try {
    //   const response = await fetch(`${API_BASE_URL}/usuario/${userId}/avatar`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   });
    //   return response.ok;
    // } catch (error) {
    //   console.error('Erro ao deletar avatar:', error);
    //   return false;
    // }

    return true; // Por enquanto, sempre retorna sucesso
  };

  // Função para obter as permissões necessárias
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Precisamos de permissão para acessar sua galeria de fotos.',
        [
          { text: 'Configurações', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
      return false;
    }
    return true;
  };

  // Abre a galeria para selecionar imagem
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Aspecto quadrado para avatar
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageData: ImageData = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          fileName: result.assets[0].fileName || 'avatar.jpg',
        };

        await handleImageUpload(imageData);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Falha ao selecionar a imagem.');
    }
  };

  // Abre a câmera para tirar foto
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Precisamos de permissão para acessar sua câmera.',
        [
          { text: 'Configurações', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageData: ImageData = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          fileName: 'camera_avatar.jpg',
        };

        await handleImageUpload(imageData);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Falha ao tirar a foto.');
    }
  };

  // Manipula o upload da imagem
  const handleImageUpload = async (imageData: ImageData) => {
    setUploading(true);
    setModalVisible(false);

    try {
      // Upload para API (quando disponível) ou salva localmente
      const uploadedUri = await uploadImageToAPI(imageData);
      
      if (uploadedUri) {
        setAvatarUri(uploadedUri);
        setHasCustomAvatar(true);
        await saveAvatar(uploadedUri);
        
        // Callback para o componente pai
        onImageChange?.(uploadedUri);
        
        console.log(`✅ Avatar ${hasCustomAvatar ? 'atualizado' : 'definido'} com sucesso:`, uploadedUri);
        Alert.alert('Sucesso! 🎉', 'Foto do perfil atualizada com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao fazer upload da imagem.');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Falha ao salvar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  // Remove a foto do perfil
  const removeAvatar = async () => {
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover sua foto do perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setUploading(true);
            
            try {
              // Deleta da API (quando disponível)
              const deleted = await deleteImageFromAPI();
              
              if (deleted) {
                setAvatarUri(null);
                setHasCustomAvatar(false);
                await saveAvatar(null);
                
                // Callback para o componente pai
                onImageChange?.(null);
                
                console.log('🗑️ Avatar removido com sucesso');
                Alert.alert('Sucesso! ✨', 'Foto do perfil removida com sucesso.');
              } else {
                Alert.alert('Erro', 'Falha ao remover a foto.');
              }
            } catch (error) {
              console.error('Erro ao remover avatar:', error);
              Alert.alert('Erro', 'Falha ao remover a foto.');
            } finally {
              setUploading(false);
            }
          }
        }
      ]
    );
  };

  // Mostra opções de ação
  const showActionOptions = () => {
    if (hasCustomAvatar) {
      // Se já tem avatar customizado, mostra opções de trocar ou remover
      Alert.alert(
        'Foto do Perfil',
        'O que você gostaria de fazer?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Trocar Foto', onPress: () => setModalVisible(true) },
          { text: 'Remover Foto', style: 'destructive', onPress: removeAvatar }
        ]
      );
    } else {
      // Se não tem avatar, abre diretamente o modal de seleção
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.avatarContainer, { width: size, height: size }]}
        onPress={showActionOptions}
        disabled={uploading}
        accessibilityLabel="Foto do perfil"
        accessibilityHint="Toque para alterar sua foto do perfil"
      >
        <Image
          source={avatarUri ? { uri: avatarUri } : defaultImage}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
        
        {/* Ícone de edição */}
        <View style={[styles.editIcon, { 
          width: size * 0.3, 
          height: size * 0.3, 
          borderRadius: (size * 0.3) / 2,
          bottom: -2,
          right: -2
        }]}>
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.editIconText, { fontSize: size * 0.15 }]}>✏️</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Modal de seleção de imagem */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolher Foto do Perfil</Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.modalButtonIcon}>📱</Text>
              <Text style={styles.modalButtonText}>Escolher da Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={takePhotoWithCamera}
            >
              <Text style={styles.modalButtonIcon}>📷</Text>
              <Text style={styles.modalButtonText}>Tirar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  editIcon: {
    position: 'absolute',
    backgroundColor: '#45B3CB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  editIconText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  modalButtonText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalCancelButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginTop: 10,
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default UserAvatar;