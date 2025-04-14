# OdontoFast
![Capa do projeto](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/capa.jpg?raw=true)

OdontoFast é um aplicativo móvel desenvolvido com React Native (Expo) para ajudar os clientes da OdontoPrev a gerenciar suas consultas odontológicas e receber notificações sobre saúde bucal. O app garante uma experiência fluida ao utilizar recursos modernos de navegação e usabilidade.

## 📌 Funcionalidades

- **Autenticação de Usuário**: Login seguro via uma API em .NET com persistência de sessão usando AsyncStorage.
- **Navegação pelo Dashboard**: Acesso rápido a todas as funcionalidades principais com layout responsivo.
- **Gerenciamento de Consultas**: Exibição de consultas odontológicas agendadas.
- **Sistema de Checklist**: Obtém itens aleatórios de checklist a partir de uma API em Python com indicador de progresso.
- **Notificações de Saúde**: Lembretes e alertas sobre cuidados bucais.
- **Histórico Odontológico**: Exibição do histórico de consultas e tratamentos do usuário.
- **Recursos de Acessibilidade**: Ajustes de tamanho de fonte, contraste e modo de leitura.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React Native (Expo)
- **Gerenciamento de Estado**: AsyncStorage para persistência de dados
- **APIs Backend**: .NET (C#) para autenticação, Python para checklist
- **Banco de Dados**: Armazena informações de usuários, consultas, notificações e registros odontológicos

## 📱 Visão Geral das Telas

### 1️⃣ HomeScreen
Tela inicial antes do login, apresentando uma introdução ao aplicativo.

### 2️⃣ LoginScreen
Realiza a autenticação do usuário através da API em .NET. Inclui validação de formulário e login rápido para desenvolvimento. Caso o login seja bem-sucedido, o usuário é redirecionado para o Dashboard.

### 3️⃣ DashBoardScreen
Funciona como menu principal, exibindo uma saudação personalizada baseada na hora do dia. Permite a navegação para outras seções do aplicativo através de cards visuais e mostra a próxima consulta agendada.

### 4️⃣ AgendaScreen
Exibe as consultas odontológicas agendadas, fornecendo detalhes como nome do profissional, data e horário.

### 5️⃣ ChecklistScreen
Obtém **quatro itens aleatórios** de um checklist a partir da API em Python, ajudando os usuários a manterem bons hábitos de saúde bucal. Inclui uma barra de progresso visual e mensagens motivacionais baseadas no progresso do usuário.

### 6️⃣ NotificacoesScreen
Exibe notificações e lembretes importantes sobre saúde bucal com animações suaves para melhorar a experiência do usuário.

### 7️⃣ FichaOdontoScreen
Mostra o histórico odontológico do usuário, incluindo consultas passadas e tratamentos realizados.

## 🚀 Recursos Adicionados Recentemente

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

## 🔗 Chamadas de API

- **API de Login (.NET)**: Responsável pela autenticação do usuário.
- **API de Checklist (Python)**: Retorna quatro itens aleatórios do checklist.
- **(Futuro)** Outras APIs poderão ser integradas para funcionalidades adicionais, como agendamento de consultas.

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
│   │   └── AccessibilitySettings.tsx # Configurações de acessibilidade
│   ├── config/               # Configurações do aplicativo
│   │   └── apiConfig.ts      # Configuração centralizada de APIs
│   ├── screens/              # Telas do aplicativo
│   ├── services/             # Serviços do aplicativo
│   │   └── authService.ts    # Serviço de autenticação
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

## ⚙️ Instruções para Rodar a Aplicação

Siga os passos abaixo para rodar a aplicação:

1. **Instalar as dependências**  
   Você pode usar o arquivo `dependencies.txt` para instalar todas as dependências de uma vez:
   
   **No Linux/macOS**:
   ```bash
   npm install $(grep -v "^#" dependencies.txt | xargs)
   ```
   
   **No Windows (PowerShell)**:
   ```powershell
   Get-Content dependencies.txt | Where-Object { $_ -notmatch "^#" -and $_ -ne "" } | ForEach-Object { npm install $_ }
   ```
   
   **Ou use o script**:
   ```bash
   node install-deps.js
   ```

2. **Rodar o aplicativo**  
   No terminal, dentro da pasta raiz do projeto, execute o comando:
   ```bash
   npx expo start
   ```

3. **Lembre-se de rodar a API Python primeiro**  
   Não se esqueça de rodar a API Python antes de rodar o aplicativo. Isso garantirá que a comunicação entre o frontend e o backend funcione corretamente.

## 👨‍💻 Modo de Desenvolvimento

Para facilitar os testes durante o desenvolvimento, o aplicativo inclui um botão de "Login Rápido" que permite pular o processo de autenticação. Esta funcionalidade está disponível apenas em ambiente de desenvolvimento e não aparece na versão de produção.

## 📱 Compatibilidade

O aplicativo foi testado em:
- Android 10 ou superior
- iOS 14 ou superior
- Emuladores: Android Studio e Xcode Simulator

## 📋 Requisitos de Instalação

- Node.js 18 ou superior
- Python 3.8 ou superior
- Expo CLI
- Android Studio (para emuladores Android)
- Xcode (para emuladores iOS - apenas macOS)
