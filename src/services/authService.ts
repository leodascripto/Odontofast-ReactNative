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
      throw new Error(errorData.message || errorData.mensagem || 'Falha ao fazer login');
    }

    const data: any = await response.json();
    console.log('🔍 Resposta da API de login:', data);
    
    // Mapeia os campos corretos da resposta da API
    const userData: UserData = {
      id: data.idUsuario || data.id, // Pode vir como idUsuario ou id
      nome: data.nomeUsuario || data.nome,
      email: data.emailUsuario || data.email,
      nrCarteira: data.nrCarteira || nrCarteira,
    };

    // Salvar token e dados do usuário
    if (data.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
    }
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    console.log('✅ Dados do usuário salvos:', userData);
    return userData;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};