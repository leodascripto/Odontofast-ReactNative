import React, { useState, createContext, useContext, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  ScrollView,
  Slider
} from "react-native";

// Definir o tipo de contexto para acessibilidade
interface AccessibilityContextProps {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  readingMode: boolean;
  toggleReadingMode: () => void;
}

// Criar o contexto de acessibilidade
const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

// Hook personalizado para usar o contexto de acessibilidade
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser usado dentro de um AccessibilityProvider");
  }
  return context;
};

// Propriedades do provedor de acessibilidade
interface AccessibilityProviderProps {
  children: ReactNode;
}

// Provedor de contexto para configurações de acessibilidade
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Estados para armazenar configurações de acessibilidade
  const [fontSize, setFontSize] = useState<number>(1); // 1 = tamanho padrão
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [readingMode, setReadingMode] = useState<boolean>(false);

  // Funções para manipular o tamanho da fonte
  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 0.1, 1.5)); // Limite máximo de 1.5x
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 0.1, 0.8)); // Limite mínimo de 0.8x
  };

  const resetFontSize = () => {
    setFontSize(1); // Resetar para o tamanho padrão
  };

  // Função para alternar o modo de alto contraste
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  // Função para alternar o modo de leitura
  const toggleReadingMode = () => {
    setReadingMode(prev => !prev);
  };

  // Valor do contexto que será fornecido
  const contextValue: AccessibilityContextProps = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    readingMode,
    toggleReadingMode
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Componente de botão de acessibilidade
export const AccessibilityButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    readingMode,
    toggleReadingMode
  } = useAccessibility();

  return (
    <>
      <TouchableOpacity 
        style={styles.accessibilityButton}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Configurações de acessibilidade"
        accessibilityHint="Abre o menu de configurações de acessibilidade"
      >
        <Text style={styles.accessibilityButtonText}>A</Text>
      </TouchableOpacity>

      {/* Modal de configurações de acessibilidade */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Configurações de Acessibilidade</Text>
            
            <ScrollView style={styles.settingsContainer}>
              {/* Controle de tamanho da fonte */}
              <View style={styles.settingSection}>
                <Text style={styles.settingTitle}>Tamanho da Fonte</Text>
                <Text style={styles.settingValue}>{Math.round(fontSize * 100)}%</Text>
                
                <View style={styles.fontSizeControls}>
                  <TouchableOpacity 
                    style={styles.fontSizeButton} 
                    onPress={decreaseFontSize}
                    accessibilityLabel="Diminuir tamanho da fonte"
                  >
                    <Text style={styles.fontSizeButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.resetButton} 
                    onPress={resetFontSize}
                    accessibilityLabel="Resetar tamanho da fonte"
                  >
                    <Text style={styles.resetButtonText}>Padrão</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.fontSizeButton} 
                    onPress={increaseFontSize}
                    accessibilityLabel="Aumentar tamanho da fonte"
                  >
                    <Text style={styles.fontSizeButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Alto Contraste */}
              <View style={styles.settingSection}>
                <View style={styles.switchContainer}>
                  <Text style={styles.settingTitle}>Alto Contraste</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#45B3CB" }}
                    thumbColor="#f4f3f4"
                    onValueChange={toggleHighContrast}
                    value={highContrast}
                    accessibilityLabel="Ativar alto contraste"
                  />
                </View>
                <Text style={styles.settingDescription}>
                  Aumenta o contraste das cores para melhor visibilidade.
                </Text>
              </View>
              
              {/* Modo Leitura */}
              <View style={styles.settingSection}>
                <View style={styles.switchContainer}>
                  <Text style={styles.settingTitle}>Modo Leitura</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#45B3CB" }}
                    thumbColor="#f4f3f4"
                    onValueChange={toggleReadingMode}
                    value={readingMode}
                    accessibilityLabel="Ativar modo leitura"
                  />
                </View>
                <Text style={styles.settingDescription}>
                  Reduz elementos visuais para facilitar a leitura de textos.
                </Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              accessibilityLabel="Fechar configurações"
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  accessibilityButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#45B3CB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  accessibilityButtonText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  settingsContainer: {
    width: "100%",
  },
  settingSection: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#333",
  },
  settingValue: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#45B3CB",
    marginVertical: 5,
  },
  settingDescription: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  fontSizeControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  fontSizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  fontSizeButtonText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#333",
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  resetButtonText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#45B3CB",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});

export default AccessibilityButton;