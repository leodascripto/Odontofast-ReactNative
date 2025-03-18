
# OdontoFast
![Capa do projeto](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/capa.jpg?raw=true)

OdontoFast é um aplicativo móvel desenvolvido com React Native (Expo) para ajudar os clientes da OdontoPrev a gerenciar suas consultas odontológicas e receber notificações sobre saúde bucal. O app garante uma experiência fluida ao utilizar recursos modernos de navegação e usabilidade.

## 📌 Funcionalidades

- **Autenticação de Usuário**: Login seguro via uma API em .NET.
- **Navegação pelo Dashboard**: Acesso rápido a todas as funcionalidades principais.
- **Gerenciamento de Consultas**: Exibição de consultas odontológicas agendadas.
- **Sistema de Checklist**: Obtém itens aleatórios de checklist a partir de uma API em Python.
- **Notificações de Saúde**: Lembretes e alertas sobre cuidados bucais.
- **Histórico Odontológico**: Exibição do histórico de consultas e tratamentos do usuário.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React Native (Expo)
- **APIs Backend**: .NET (C#) para autenticação, Python para checklist
- **Banco de Dados**: Armazena informações de usuários, consultas, notificações e registros odontológicos

## 📱 Visão Geral das Telas

### 1️⃣ LoginScreen
Realiza a autenticação do usuário através da API em .NET. Caso o login seja bem-sucedido, o usuário é redirecionado para o Dashboard.

### 2️⃣ DashBoardScreen
Funciona como menu principal, permitindo a navegação para outras seções do aplicativo.

### 3️⃣ AgendaScreen
Exibe as consultas odontológicas agendadas, fornecendo detalhes como nome do profissional, data e horário.

### 4️⃣ ChecklistScreen
Obtém **quatro itens aleatórios** de um checklist a partir da API em Python, ajudando os usuários a manterem bons hábitos de saúde bucal.

### 5️⃣ NotificacoesScreen
Exibe notificações e lembretes importantes sobre saúde bucal.

### 6️⃣ FichaOdontoScreen
Mostra o histórico odontológico do usuário, incluindo consultas passadas e tratamentos realizados.

### 7️⃣ HomeScreen
Tela inicial antes do login, apresentando uma introdução ao aplicativo.

## 🔗 Chamadas de API (Planejadas)

- **(Ainda não implementada) API de Login (.NET)**: Responsável pela autenticação do usuário.
- **API de Checklist (Python)**: Retorna quatro itens aleatórios do checklist.
- **(Futuro)** Outras APIs poderão ser integradas para funcionalidades adicionais, como agendamento de consultas.

## 📊 Diagrama da Solução

![Diagrama da Solução](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/diagrama.png?raw=true)

## 🚀 Navegação & Usabilidade Aprimoradas

O OdontoFast incorpora práticas modernas de navegação e UI para garantir uma experiência intuitiva. O aplicativo utiliza:
- **React Navigation** para transições suaves entre telas.
- **Gerenciamento de Estado Otimizado** para melhor desempenho.
- **Componentes de UI Intuitivos** para aprimorar a usabilidade.

## 🐍 Instruções para Rodar a API em Python

Siga os passos abaixo para rodar a API de backend em Python:

1. **Instalar o Python**  
   Certifique-se de que o Python mais recente está instalado em sua máquina. Você pode verificar a versão do Python com o comando:
   ```bash
   python --version
   ```

2. **Abrir a aplicação na sua IDE de preferência**  
   Caso ainda não tenha, abra o projeto na IDE de sua escolha. Para este exemplo, usamos o [VSCode](https://code.visualstudio.com/).

3. **Navegar até o diretório 'src\backend'**  
   Abra o terminal dentro da sua IDE ou use o terminal para navegar até o diretório onde está o código do backend:
   ```bash
   cd src/backend
   ```

4. **Criar e ativar um ambiente virtual**  
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

5. **Instalar as dependências**  
   Certifique-se de ter todas as dependências necessárias instaladas com:
   ```bash
   pip install -r requirements.txt
   ```

6. **Rodar a API**  
   Após o ambiente virtual estar ativado e as dependências instaladas, execute o arquivo `run.py` para iniciar o backend:
   ```bash
   python src/backend/run.py
   ```

Pronto! A API estará rodando localmente. Você pode fazer chamadas a ela a partir do aplicativo.

## ⚙️ Instruções para Rodar a Aplicação

Siga os passos abaixo para rodar a aplicação:

1. **Instalar o Node.js**  
   Certifique-se de ter o Node.js instalado. Você pode verificar a instalação com:
   ```bash
   node --version
   ```

2. **Instalar as dependências do projeto**  
   Abra o terminal na pasta raiz do projeto e execute o comando:
   ```bash
   npm install
   ```

3. **Instalar o Expo CLI**  
   Se ainda não tiver o Expo CLI instalado, instale-o globalmente com o comando:
   ```bash
   npm install -g expo-cli
   ```

4. **Rodar o aplicativo**  
   No terminal, dentro da pasta raiz do projeto, execute o comando:
   ```bash
   npx expo start
   ```

5. **Lembre-se de rodar a API Python primeiro**  
   Não se esqueça de rodar a API Python antes de rodar o aplicativo. Isso garantirá que a comunicação entre o frontend e o backend funcione corretamente.

Pronto! Agora você pode começar a usar a aplicação em seu dispositivo ou no emulador.

