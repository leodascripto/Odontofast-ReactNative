# OdontoFast
![Capa do projeto](https://github.com/leodascripto/Odontofast-ReactNative/blob/master/src/assets/images/readmepics/capa.jpg?raw=true)

- **2TDSPS**
- **Felipe Amador** - RM 553528
- **Leonardo de Oliveira** - RM554024
- **Sara Gabrielle Sousa** - RM552656

<br>
OdontoFast é um aplicativo móvel desenvolvido com React Native (Expo) para ajudar os clientes da OdontoPrev a gerenciar suas consultas odontológicas e receber notificações sobre saúde bucal. O app oferece uma experiência fluida com recursos modernos de navegação e usabilidade.

## 📌 Funcionalidades

- **Autenticação de Usuário**: Login seguro via API .NET com persistência de sessão
- **Sistema de Avatar**: Upload, edição e remoção de fotos de perfil com CRUD completo
- **Dashboard Interativo**: Acesso rápido a todas as funcionalidades com layout responsivo
- **Checklist de Saúde**: Sistema dinâmico com API Python e indicador de progresso
- **Gerenciamento de Consultas**: Visualização de consultas odontológicas agendadas
- **Recursos de Acessibilidade**: Ajustes de fonte, contraste e modo de leitura

## 🛠️ Tecnologias

- **Frontend**: React Native (Expo) + TypeScript
- **APIs**: .NET (C#) + Python (Flask)
- **Banco**: Oracle Database + Entity Framework
- **Estado**: AsyncStorage + Context API
- **Upload**: Expo ImagePicker

## 🌐 APIs e Repositórios

### 🔑 **API .NET Principal**
**Repositório**: [OdontoFast-API-dotnet](https://github.com/leodascripto/OdontoFast-API-dotnet)  
**Base URL**: `http://localhost:5058/api`

**Principais Endpoints:**
- `POST /login` - Autenticação
- `GET|POST|PUT|DELETE /ImagemUsuario/{id}` - CRUD Avatar
- `POST /IAOdontologica/prever-tratamento` - IA Odontológica
- `GET /Usuario/{id}` - Dados do usuário

### 🐍 **API Python - Checklist**
**Base URL**: `http://localhost:5000`
- `GET /checklist` - Retorna 4 itens aleatórios

## 📱 Principais Telas

- **HomeScreen**: Tela inicial de apresentação
- **LoginScreen**: Autenticação com validação completa + login rápido para dev
- **DashboardScreen**: Menu principal com avatar editável e cards de navegação
- **ChecklistScreen**: Lista dinâmica com progresso visual e pull-to-refresh
- **AgendaScreen**: Visualização de consultas agendadas
- **NotificacoesScreen**: Lembretes e alertas de saúde bucal

## 🚀 Como Executar

### **1. Pré-requisitos**
```bash
# Verificar instalações
node --version    # Node.js 18+
python --version  # Python 3.8+
dotnet --version  # .NET 8.0+
```

### **2. Clonar e Configurar APIs**

#### **API .NET:**
```bash
# Clone a API .NET
git clone https://github.com/leodascripto/OdontoFast-API-dotnet.git
cd OdontoFast-API-dotnet

# Restaurar dependências
dotnet restore

# Configurar .env com string de conexão Oracle
# Rodar API
dotnet watch run
# API disponível em: http://localhost:5058
```

#### **API Python:**
```bash
# No diretório do React Native
cd src/backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente
# Windows: .\venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar API
python run.py
# API disponível em: http://localhost:5000
```

### **3. Rodar React Native**
```bash
# ⚠️ IMPORTANTE: Instalar dependências
npm install

# Rodar aplicativo
npx expo start

# Escolher plataforma:
# Pressione 'a' para Android
# Pressione 'i' para iOS  
# Pressione 'w' para Web
# Ou escaneie QR Code com Expo Go
```

## 🔧 Comandos Úteis

```bash
# Dependências
npm install

# Iniciar app
npx expo start

# Plataformas específicas
npx expo start --android
npx expo start --ios
npx expo start --web

# Limpar cache
npx expo start --clear
```

## 🧪 Testando o Sistema

### **Fluxo Completo de Avatar:**
1. **Login** → Dashboard → Avatar padrão visível
2. **Criar**: Toque no avatar → Selecione foto → Upload automático
3. **Editar**: Toque no avatar → "Trocar Foto" → Nova imagem
4. **Remover**: Toque no avatar → "Remover Foto" → Volta ao padrão
5. **Persistência**: Feche/abra app → Avatar mantido

### **Login Rápido (Dev):**
- Use o botão "Login Rápido" para pular autenticação durante desenvolvimento

## 📊 Arquitetura

```
React Native App
├── Autenticação → API .NET
├── Avatar (CRUD) → API .NET  
├── Checklist → API Python
├── Cache Local → AsyncStorage
└── Estados → Context + Hooks
```

## 🔗 Fluxo de Dados

**Sistema de Avatar (CRUD Completo):**
```
CREATE: Foto selecionada → POST /ImagemUsuario → Banco Oracle
READ: App inicia → GET /ImagemUsuario/{id} → Exibe avatar
UPDATE: Nova foto → PUT /ImagemUsuario/{id} → Atualiza
DELETE: Remover → DELETE /ImagemUsuario/{id} → Remove
```

## 📂 Estrutura do Projeto

```
OdontoFast/
├── src/
│   ├── components/          # UserAvatar, Header, Accessibility
│   ├── screens/            # Home, Login, Dashboard, etc.
│   ├── services/           # authService, avatarService  
│   ├── config/             # apiConfig (URLs centralizadas)
│   ├── hooks/              # useAvatar (custom hook)
│   └── backend/            # API Python (checklist)
├── App.tsx                 # Componente principal
└── package.json           # Dependências
```

## 🎯 Recursos Destacados

### ✅ **Sistema de Avatar Avançado**
- Upload via câmera ou galeria
- Validação de tipos (JPG, PNG, GIF, WEBP)
- Cache offline para funcionamento sem internet
- Integração completa com API .NET

### ✅ **Autenticação Robusta**
- Persistência de sessão com AsyncStorage
- Verificação automática de login
- Redirecionamento inteligente

### ✅ **APIs Integradas**
- .NET para dados principais e avatar
- Python para checklist dinâmico
- Fallbacks para funcionamento offline

## 💡 Funcionalidades da API .NET

A API .NET inclui recursos avançados como:
- **IA Odontológica**: Predição de tratamentos com ML.NET
- **Sistema de Recomendações**: Sugestões personalizadas
- **Modelos de Machine Learning**: Treinamento automático

Veja mais detalhes no [repositório da API](https://github.com/leodascripto/OdontoFast-API-dotnet).

## 📱 Compatibilidade

- ✅ Android 10+
- ✅ iOS 14+
- ✅ Emuladores (Android Studio/Xcode)
- ✅ Dispositivos físicos
- ✅ Modo offline (cache local)

## 👥 Equipe

- **Frontend React Native**: Leonardo de Oliveira
- **Backend .NET + IA**: Sara Sousa  
- **Backend Python**: Leonardo de Oliveira
- **Banco Oracle**: Felipe Amador
- **UI/UX Design**: Leonardo de Oliveira

---

**OdontoFast** - Transformando o cuidado odontológico através da tecnologia! 🦷✨

### 🔗 Links Importantes
- [API .NET Repository](https://github.com/leodascripto/OdontoFast-dotnet-API)
- [Documentação da API](https://github.com/leodascripto/OdontoFast-dotnet-API#readme)
