/**
 * Script para iniciar o ambiente de desenvolvimento OdontoFast
 * Cria automaticamente um ambiente virtual Python, instala dependências e inicia ambos os servidores
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Definindo cores para os logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Parse command line arguments 
const args = process.argv.slice(2);
const platform = args[0] === 'android' ? 'android' : 
                 args[0] === 'ios' ? 'ios' : 
                 args[0] === 'web' ? 'web' : 'android'; // Default to Android if not specified

// Função para prefixar os logs
const prefixLog = (prefix, color) => (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${color}[${prefix}]${colors.reset} ${line}`);
    }
  });
};

// Verifica se o caminho da API Python existe
const backendDir = path.join(__dirname, 'src', 'backend');
const pythonScript = path.join(backendDir, 'run.py');
const venvDir = path.join(backendDir, 'venv');
const venvPython = os.platform() === 'win32' 
  ? path.join(venvDir, 'Scripts', 'python.exe')
  : path.join(venvDir, 'bin', 'python');
const venvPip = os.platform() === 'win32'
  ? path.join(venvDir, 'Scripts', 'pip.exe')
  : path.join(venvDir, 'bin', 'pip');

if (!fs.existsSync(pythonScript)) {
  console.error(`${colors.fg.red}Erro: O arquivo da API Python não foi encontrado em ${pythonScript}${colors.reset}`);
  console.error(`${colors.fg.yellow}Verifique se o caminho está correto ou se o repositório está completo.${colors.reset}`);
  process.exit(1);
}

// Banner informativo
console.log(`
${colors.fg.cyan}${colors.bright}=====================================${colors.reset}
${colors.fg.cyan}${colors.bright}  INICIANDO AMBIENTE DE DESENVOLVIMENTO  ${colors.reset}
${colors.fg.cyan}${colors.bright}=====================================${colors.reset}
${colors.fg.yellow}▶ Preparando ambiente Python e iniciando app para ${colors.bright}${platform.toUpperCase()}${colors.reset}
`);

// Determina o comando Python baseado no sistema operacional
const getPythonCommand = () => {
  // No Linux, preferimos python3 explicitamente
  if (os.platform() === 'linux') {
    return 'python3';
  }
  
  // No Windows, tentamos 'python' e 'py'
  if (os.platform() === 'win32') {
    try {
      execSync('python --version', { stdio: 'ignore' });
      return 'python';
    } catch (e) {
      try {
        execSync('py --version', { stdio: 'ignore' });
        return 'py';
      } catch (e) {
        console.error(`${colors.fg.red}Erro: Python não encontrado. Certifique-se de que o Python está instalado e disponível no PATH.${colors.reset}`);
        process.exit(1);
      }
    }
  }
  
  // Em macOS e outros sistemas, verificamos python e python3
  try {
    execSync('python3 --version', { stdio: 'ignore' });
    return 'python3';
  } catch (e) {
    try {
      execSync('python --version', { stdio: 'ignore' });
      return 'python';
    } catch (e) {
      console.error(`${colors.fg.red}Erro: Python não encontrado. Certifique-se de que o Python está instalado e disponível no PATH.${colors.reset}`);
      process.exit(1);
    }
  }
};

const pythonCmd = getPythonCommand();
console.log(`${colors.fg.green}Usando comando Python: ${pythonCmd}${colors.reset}`);

// Verifica e configura o ambiente virtual Python
try {
  // Verifica se o ambiente virtual já existe
  if (!fs.existsSync(venvDir)) {
    console.log(`${colors.fg.yellow}Ambiente virtual não encontrado. Criando novo ambiente em ${venvDir}${colors.reset}`);
    
    try {
      // Tenta criar ambiente virtual com python3 -m venv
      execSync(`${pythonCmd} -m venv "${venvDir}"`, { 
        stdio: 'inherit',
        cwd: backendDir 
      });
    } catch (venvError) {
      console.error(`${colors.fg.red}Erro ao criar ambiente virtual. Verifique se o pacote venv está instalado:${colors.reset}`);
      console.error(`${colors.fg.yellow}Em Ubuntu/Debian: sudo apt install python3-venv${colors.reset}`);
      console.error(`${colors.fg.yellow}Em Fedora: sudo dnf install python3-virtualenv${colors.reset}`);
      console.error(`${colors.fg.yellow}Detalhes do erro: ${venvError.message}${colors.reset}`);
      process.exit(1);
    }
  } else {
    console.log(`${colors.fg.green}Usando ambiente virtual existente em ${venvDir}${colors.reset}`);
  }
  
  // Instala as dependências usando o arquivo requirements.txt
  const requirementsPath = path.join(backendDir, 'requirements.txt');
  
  if (fs.existsSync(requirementsPath)) {
    console.log(`${colors.fg.green}Instalando dependências do arquivo requirements.txt...${colors.reset}`);
    execSync(`"${venvPip}" install -r "${requirementsPath}"`, { 
      stdio: 'inherit',
      cwd: backendDir 
    });
  } else {
    // Se não tiver o arquivo requirements.txt, instala diretamente as dependências necessárias
    console.log(`${colors.fg.green}Instalando dependências Python básicas (flask, flask-cors)...${colors.reset}`);
    execSync(`"${venvPip}" install flask flask-cors`, { 
      stdio: 'inherit',
      cwd: backendDir 
    });
  }
  
  console.log(`${colors.fg.green}Dependências Python instaladas com sucesso!${colors.reset}`);
} catch (error) {
  console.error(`${colors.fg.red}Erro ao configurar ambiente Python: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Inicia o servidor Python usando o ambiente virtual
console.log(`${colors.fg.green}Iniciando servidor API Python com ambiente virtual...${colors.reset}`);
const pythonProcess = spawn(venvPython, [pythonScript], {
  cwd: backendDir
});

// Captura a saída do servidor Python
pythonProcess.stdout.on('data', prefixLog('PYTHON', colors.fg.green));
pythonProcess.stderr.on('data', prefixLog('PYTHON ERROR', colors.fg.red));

// Aguarda um pouco para garantir que o servidor Python tenha iniciado
setTimeout(() => {
  console.log(`${colors.fg.blue}Iniciando aplicativo React Native para ${platform}...${colors.reset}`);
  
  // Inicia o app React Native com a plataforma especificada
  const expoProcess = spawn('npx', ['expo', 'start', `--${platform}`], {
    shell: true
  });
  
  // Captura a saída do app React Native
  expoProcess.stdout.on('data', prefixLog('EXPO', colors.fg.blue));
  expoProcess.stderr.on('data', prefixLog('EXPO ERROR', colors.fg.red));
  
  // Manipula a saída dos processos
  expoProcess.on('close', (code) => {
    console.log(`${colors.fg.yellow}Aplicativo React Native encerrado com código ${code}${colors.reset}`);
    // Encerra o servidor Python quando o app React Native for fechado
    pythonProcess.kill();
    process.exit(0);
  });
  
}, 2000); // Espera 2 segundos para o servidor Python iniciar

// Manipula erros do servidor Python
pythonProcess.on('close', (code) => {
  if (code !== null && code !== 0) {
    console.error(`${colors.fg.red}Servidor Python encerrado com código ${code}${colors.reset}`);
    process.exit(1);
  }
});

// Captura sinais para encerramento limpo
process.on('SIGINT', () => {
  console.log(`${colors.fg.yellow}Encerrando aplicação...${colors.reset}`);
  pythonProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`${colors.fg.yellow}Encerrando aplicação...${colors.reset}`);
  pythonProcess.kill();
  process.exit(0);
});