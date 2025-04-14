import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Alert, 
  Platform,
  ActivityIndicator,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import Header from "../components/Header";
import { login, quickLogin } from "../services/authService";

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [nrCarteira, setNrCarteira] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);
  const [errors, setErrors] = useState({
    nrCarteira: '',
    senha: '',
    server: ''
  });

  // Função para validar os campos do formulário
  const validateForm = () => {
    let isValid = true;
    const newErrors = { nrCarteira: '', senha: '', server: '' };

    // Validação do número da carteira
    if (!nrCarteira.trim()) {
      newErrors.nrCarteira = 'O número da carteira é obrigatório';
      isValid = false;
    } else if (!/^\d+$/.test(nrCarteira)) {
      newErrors.nrCarteira = 'Digite apenas números';
      isValid = false;
    }

    // Validação da senha
    if (!senha) {
      newErrors.senha = 'A senha é obrigatória';
      isValid = false;
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    // Limpar mensagem de erro do servidor
    setErrors(prev => ({ ...prev, server: '' }));
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = await login(nrCarteira, senha);
      setLoading(false);
      
      // Login bem-sucedido, mover para o Dashboard
      navigation.navigate('Dashboard', { nome: userData.nome });
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, server: error.message }));
      } else {
        setErrors(prev => ({ ...prev, server: 'Ocorreu um erro inesperado' }));
      }
    }
  };
  
  // Função para fazer login rápido
  const handleQuickLogin = async () => {
    setQuickLoginLoading(true);
    
    try {
      const userData = await quickLogin();
      setQuickLoginLoading(false);
      
      // Redirecionar para o Dashboard
      navigation.navigate('Dashboard', { nome: userData.nome });
    } catch (error) {
      setQuickLoginLoading(false);
      Alert.alert('Erro', 'Falha ao fazer login rápido');
    }
  };

  // Para permitir esconder o teclado ao tocar fora dos inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Header title="Login" showBackButton={true} />
          
          <Image 
            source={require('../assets/images/fastinho.png')} 
            style={styles.logo}
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Número da Carteirinha</Text>
            <TextInput
              style={[
                styles.input, 
                errors.nrCarteira ? styles.inputError : null
              ]}
              placeholder="Digite o número da carteirinha"
              placeholderTextColor="#bbb"
              keyboardType="numeric"
              value={nrCarteira}
              onChangeText={(text) => {
                setNrCarteira(text);
                if (errors.nrCarteira) {
                  setErrors(prev => ({ ...prev, nrCarteira: '' }));
                }
              }}
              autoCapitalize="none"
              accessibilityLabel="Campo de número da carteirinha"
            />
            {errors.nrCarteira ? (
              <Text style={styles.errorText}>{errors.nrCarteira}</Text>
            ) : null}

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[
                styles.input, 
                errors.senha ? styles.inputError : null
              ]}
              placeholder="Digite sua senha"
              placeholderTextColor="#bbb"
              secureTextEntry
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (errors.senha) {
                  setErrors(prev => ({ ...prev, senha: '' }));
                }
              }}
              accessibilityLabel="Campo de senha"
            />
            {errors.senha ? (
              <Text style={styles.errorText}>{errors.senha}</Text>
            ) : null}

            {errors.server ? (
              <View style={styles.serverErrorContainer}>
                <Text style={styles.serverErrorText}>{errors.server}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin} 
              disabled={loading}
              accessibilityLabel="Botão de login"
              accessibilityHint="Toque para fazer login no aplicativo"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
            
            {/* Botão de Login Rápido para testes */}
            <TouchableOpacity 
              style={[
                styles.quickLoginButton,
                quickLoginLoading && styles.quickLoginButtonLoading
              ]}
              onPress={handleQuickLogin}
              disabled={quickLoginLoading}
              accessibilityLabel="Login rápido para testes"
            >
              {quickLoginLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Text style={styles.quickLoginText}>Login Rápido (Apenas para Testes)</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 20,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 52,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ED7389',
    borderWidth: 2,
  },
  errorText: {
    color: '#ED7389',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  serverErrorContainer: {
    backgroundColor: 'rgba(237, 115, 137, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  serverErrorText: {
    color: '#ED7389',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#45B3CB',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  forgotPasswordText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#45B3CB',
    textDecorationLine: 'underline',
  },
  quickLoginButton: {
    alignSelf: 'center',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    minWidth: 250,
    alignItems: 'center',
  },
  quickLoginButtonLoading: {
    backgroundColor: '#e8e8e8',
  },
  quickLoginText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#666',
  },
});

export default LoginScreen;