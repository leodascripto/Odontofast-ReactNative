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

- **API de Login (.NET)**: Responsável pela autenticação do usuário.
- **API de Checklist (Python)**: Retorna quatro itens aleatórios do checklist.
- **(Futuro)** Outras APIs poderão ser integradas para funcionalidades adicionais, como agendamento de consultas.

## 📊 Diagrama da Solução

![Diagrama da Solução](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/diagrama.png?raw=true)

## 🚀 Navegação & Usabilidade Aprimoradas

O OdontoFast incorpora práticas modernas de navegação e UI para garantir uma experiência intuitiva. O aplicativo utiliza:
- **React Navigation** para transições suaves entre telas.
- **Gerenciamento de Estado Otimizado** para melhor desempenho.
- **Componentes de UI Intuitivos** para aprimorar a usabilidade.
