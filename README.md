# OdontoFast
![Capa do projeto](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/capa.jpg?raw=true)

OdontoFast é um aplicativo móvel desenvolvido com React Native (Expo) para ajudar os clientes da OdontoPrev a gerenciar suas consultas odontológicas e receber notificações sobre saúde bucal. O app garante uma experiência fluida ao utilizar recursos modernos de navegação e usabilidade.

## 📌 Funcionalidades

- **Autenticação de Usuário**: Login seguro via uma API em .NET com persistência de sessão usando AsyncStorage.
- **Navegação pelo Dashboard**: Acesso rápido a todas as funcionalidades principais com layout responsivo.
- **Gerenciamento de Avatar**: Sistema completo de upload, edição e remoção de fotos de perfil integrado com API .NET.
- **Gerenciamento de Consultas**: Exibição de consultas odontológicas agendadas.
- **Sistema de Checklist**: Obtém itens aleatórios de checklist a partir de uma API em Python com indicador de progresso.
- **Notificações de Saúde**: Lembretes e alertas sobre cuidados bucais.
- **Histórico Odontológico**: Exibição do histórico de consultas e tratamentos do usuário.
- **Recursos de Acessibilidade**: Ajustes de tamanho de fonte, contraste e modo de leitura.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React Native (Expo)
- **Gerenciamento de Estado**: AsyncStorage para persistência de dados
- **APIs Backend**: .NET (C#) para autenticação e avatares, Python para checklist
- **Banco de Dados**: Oracle Database com Entity Framework
- **Upload de Imagens**: Expo ImagePicker com validação de tipos

## 🌐 Arquitetura de APIs

### 🔑 **API .NET (C#) - Backend Principal**
**Base URL**: `http://localhost:5058/api`

#### **Endpoints de Autenticação:**
- `POST /login` - Realiza login do usuário
- `GET /Usuario/{id}` - Busca dados do usuário
- `PUT /Usuario/{id}` - Atualiza dados do usuário

#### **Endpoints de Avatar (CRUD Completo):**
- `GET /ImagemUsuario/{idUsuario}` - **READ**: Busca avatar do usuário
- `POST /ImagemUsuario` - **CREATE**: Cria novo avatar
- `PUT /ImagemUsuario/{idUsuario}` - **UPDATE**: Atualiza avatar existente
- `DELETE /ImagemUsuario/{idUsuario}` - **DELETE**: Remove avatar
- `GET /ImagemUsuario/{idUsuario}/exists` - Verifica se usuário possui avatar

#### **Endpoints de IA Odontológica (Disponíveis):**
- `POST /IAOdontologica/prever-tratamento` - Predição de duração de tratamentos
- `POST /IAOdontologica/recomendar` - Recomendações personalizadas
- `POST /IAOdontologica/treinar-modelo-duracao` - Treinamento de modelos ML

#### **Endpoints de Progresso:**
- `POST /Progresso` - Processa progresso do usuário

### 🐍 **API Python - Checklist**
**Base URL**: `http://localhost:5000`

#### **Endpoints:**
- `GET /checklist` - Retorna 4 itens aleatórios de checklist

## 📱 Visão Geral das Telas

### 1️⃣ HomeScreen
Tela inicial antes do login, apresentando uma introdução ao aplicativo.

### 2️⃣ LoginScreen
Realiza a autenticação do usuário através da API em .NET. Inclui validação de formulário e login rápido para desenvolvimento. Caso o login seja bem-sucedido, o usuário é redirecionado para o Dashboard.

### 3️⃣ DashBoardScreen
Funciona como menu principal, exibindo uma saudação personalizada baseada na hora do dia. Permite a navegação para outras seções do aplicativo através de cards visuais, mostra a próxima consulta agendada e **inclui avatar editável do usuário**.

### 4️⃣ AgendaScreen
Exibe as consultas odontológicas agendadas, fornecendo detalhes como nome do profissional, data e horário.

### 5️⃣ ChecklistScreen
Obtém **quatro itens aleatórios** de um checklist a partir da API em Python, ajudando os usuários a manterem bons hábitos de saúde bucal. Inclui uma barra de progresso visual e mensagens motivacionais baseadas no progresso do usuário.

### 6️⃣ NotificacoesScreen
Exibe notificações e lembretes importantes sobre saúde bucal com animações suaves para melhorar a experiência do usuário.

### 7️⃣ FichaOdontoScreen
Mostra o histórico odontológico do usuário, incluindo consultas passadas e tratamentos realizados.

## 🚀 Recursos Adicionados Recentemente

### ✅ Sistema de Avatar Completo
- **Upload de fotos** via câmera ou galeria
- **Edição e remoção** de avatares
- **Integração completa** com API .NET
- **Cache local** para funcionamento offline
- **Validação de tipos** de arquivo (JPG, PNG, GIF, WEBP)

### ✅ Componente de Cabeçalho Unificado
Todas as telas agora utilizam um componente de cabeçalho padronizado que melhora a consistência visual e navegação.

### ✅ Login com Persistência
Implementado sistema de login com AsyncStorage para manter o usuário conectado após fechar o aplicativo.

### ✅ Verificação Automática de Login
O aplicativo verifica automaticamente se há uma sessão salva e direciona o usuário para a tela correta.

### ✅ Barra de Progresso no Checklist
Adicionado feedback visual para acompanhar o progresso do checklist diário.

### ✅ Configurações de Acessibilidade
Novo componente que permite ajustar o tamanho da fonte, ativar modo de alto contraste e modo de leitura.

### ✅ Centralização de Configurações da API
Criado sistema para gerenciar URLs de API para diferentes ambientes de forma centralizada.

## 🔗 Fluxo de Dados das APIs

### **Sistema de Avatar (CRUD)**
```
1. CREATE: Usuário seleciona foto → POST /ImagemUsuario → Salva no banco
2. READ: App inicia → GET /ImagemUsuario/{id} → Exibe avatar
3. UPDATE: Usuário troca foto → PUT /ImagemUsuario/{id} → Atualiza registro
4. DELETE: Usuário remove foto → DELETE /ImagemUsuario/{id} → Remove registro
```

### **Sistema de Autenticação**
```
1. LOGIN: Credenciais → POST /login → Retorna dados do usuário
2. PERSISTÊNCIA: Dados salvos → AsyncStorage → Mantém sessão
3. VERIFICAÇÃO: App inicia → Verifica AsyncStorage → Direciona para Dashboard ou Login
```

### **Sistema de Checklist**
```
1. BUSCA: Tela carrega → GET /checklist → Retorna 4 itens aleatórios
2. PROGRESSO: Usuário marca itens → Calcula % → Exibe mensagem motivacional
3. REFRESH: Pull-to-refresh → Nova requisição → Novos itens
```

## 📊 Diagrama da Solução

![Diagrama da Solução](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/diagrama.png?raw=true)

## 📂 Estrutura do Projeto

```
OdontoFast/
├── src/
│   ├── assets/               # Recursos estáticos
│   ├── backend/              # API Python para o checklist
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Header.tsx        # Cabeçalho unificado
│   │   ├── UserAvatar.tsx    # Componente de avatar com upload
│   │   └── AccessibilitySettings.tsx # Configurações de acessibilidade
│   ├── config/               # Configurações do aplicativo
│   │   └── apiConfig.ts      # Configuração centralizada de APIs
│   ├── hooks/                # Custom hooks
│   │   └── useAvatar.ts      # Hook para gerenciar avatares
│   ├── screens/              # Telas do aplicativo
│   ├── services/             # Serviços do aplicativo
│   │   ├── authService.ts    # Serviço de autenticação
│   │   └── avatarService.ts  # Serviço de gerenciamento de avatares
│   └── types/                # Definições de tipos TypeScript
└── App.tsx                   # Componente principal
```

## 🐍 Instruções para Rodar a API em Python

Siga os passos abaixo para rodar a API de backend em Python:

1. **Instalar o Python**  
   Certifique-se de que o Python mais recente está instalado em sua máquina. Você pode verificar a versão do Python com o comando:
   ```bash
   python --version
   ```

2. **Navegar até o diretório 'src\backend'**  
   Abra o terminal e navegue até o diretório onde está o código do backend:
   ```bash
   cd src/backend
   ```

3. **Criar e ativar um ambiente virtual**  
   Para garantir que as dependências não conflitem com outros projetos, crie um ambiente virtual:
   - No terminal, execute:
     ```bash
     python -m venv venv
     ```
   - Ative o ambiente virtual:
     - **No Windows**:
       ```bash
       .\venv\Scripts\activate
       ```
     - **No Linux/Mac**:
       ```bash
       source venv/bin/activate
       ```

4. **Instalar as dependências**  
   Certifique-se de ter todas as dependências necessárias instaladas com:
   ```bash
   pip install -r requirements.txt
   ```

5. **Rodar a API**  
   Após o ambiente virtual estar ativado e as dependências instaladas, execute o arquivo `run.py` para iniciar o backend:
   ```bash
   python run.py
   ```

## 🔧 Instruções para Rodar a API .NET

1. **Instalar o .NET SDK**  
   Certifique-se de que o .NET 8.0 SDK está instalado:
   ```bash
   dotnet --version
   ```

2. **Navegar até o diretório da API**  
   ```bash
   cd OdontofastAPI
   ```

3. **Restaurar as dependências**  
   ```bash
   dotnet restore
   ```

4. **Configurar o banco de dados**  
   - Configure a string de conexão no arquivo `.env`
   - Execute as migrations se necessário:
   ```bash
   dotnet ef database update
   ```

5. **Rodar a API**  
   ```bash
   dotnet run
   ```

A API estará disponível em `http://localhost:5058`

## ⚙️ Instruções para Rodar a Aplicação React Native

Siga os passos abaixo para rodar a aplicação:

1. **Instalar as dependências**  
   **⚠️ IMPORTANTE**: Execute o comando abaixo para instalar todas as dependências necessárias:
   ```bash
   npm install
   ```

2. **Rodar o aplicativo**  
   No terminal, dentro da pasta raiz do projeto, execute o comando:
   ```bash
   npx expo start
   ```

3. **Escolher plataforma**  
   Após o comando anterior, você pode:
   - Pressionar `a` para Android
   - Pressionar `i` para iOS
   - Pressionar `w` para Web
   - Escanear o QR Code com o app Expo Go

4. **Lembre-se de rodar as APIs primeiro**  
   Certifique-se de que tanto a API .NET quanto a API Python estejam rodando antes de iniciar o aplicativo.

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar aplicativo
npx expo start

# Rodar em plataforma específica
npx expo start --android
npx expo start --ios
npx expo start --web

# Limpar cache
npx expo start --clear
```

## 👨‍💻 Modo de Desenvolvimento

Para facilitar os testes durante o desenvolvimento, o aplicativo inclui um botão de "Login Rápido" que permite pular o processo de autenticação. Esta funcionalidade está disponível apenas em ambiente de desenvolvimento e não aparece na versão de produção.

## 🧪 Testando o Sistema de Avatar

### **Fluxo de Teste Completo:**

1. **Primeiro Acesso**:
   - Faça login → Vá para Dashboard → Avatar mostra imagem padrão

2. **Criar Avatar**:
   - Toque no avatar → Escolha "Galeria" ou "Câmera" → Selecione imagem → Confirme upload

3. **Verificar Persistência**:
   - Feche o app → Reabra → Avatar deve aparecer automaticamente

4. **Atualizar Avatar**:
   - Toque no avatar → "Trocar Foto" → Selecione nova imagem → Confirme

5. **Remover Avatar**:
   - Toque no avatar → "Remover Foto" → Confirme → Volta ao avatar padrão

### **Testando Cache Offline**:
1. Defina um avatar com API rodando
2. Pare a API .NET
3. Feche e reabra o app
4. Avatar deve aparecer do cache local

## 📱 Compatibilidade

O aplicativo foi testado em:
- Android 10 ou superior
- iOS 14 ou superior
- Emuladores: Android Studio e Xcode Simulator
- Dispositivos físicos

## 📋 Requisitos de Instalação

- Node.js 18 ou superior
- Python 3.8 ou superior
- .NET 8.0 SDK
- Expo CLI
- Android Studio (para emuladores Android)
- Xcode (para emuladores iOS - apenas macOS)
- Oracle Database (para API .NET)

## 👥 Equipe

- **Desenvolvimento Frontend**: React Native + Expo - Leonardo de Oliveira
- **Backend .NET**: API completa com Entity Framework - Sara Sousa
- **Backend Python**: Microserviço para checklist - Leonardo de Oliveira
- **Banco de Dados**: Oracle Database - Felipe Amador
- **Design**: UI/UX focado em acessibilidade - Leonardo de Oliveira

---

**OdontoFast** - Transformando o cuidado odontológico através da tecnologia! 🦷✨