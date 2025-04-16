const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script para corrigir problemas com dependências
 * - Remove referências ao expo-splash-screen
 * - Instala as dependências nas versões corretas
 */

const colors = {
  reset: '\x1b[0m',
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
  }
};

console.log(`
${colors.fg.cyan}==========================================${colors.reset}
${colors.fg.cyan}  CORRIGINDO DEPENDÊNCIAS DO PROJETO      ${colors.reset}
${colors.fg.cyan}==========================================${colors.reset}
`);

// Função para procurar arquivos recursivamente
function findFiles(dir, fileTypes, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findFiles(filePath, fileTypes, fileList);
    } else if (fileTypes.some(type => file.endsWith(type))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Função para remover importações do expo-splash-screen
function removeSplashScreenImports() {
  console.log(`${colors.fg.yellow}Procurando arquivos com referências ao expo-splash-screen...${colors.reset}`);

  const fileTypes = ['.ts', '.tsx', '.js', '.jsx'];
  const projectFiles = findFiles('.', fileTypes);
  let filesModified = 0;

  // Regex para capturar importações do expo-splash-screen
  const importRegex = /import\s+.*\s+from\s+['"]expo-splash-screen['"];?\n?/g;

  for (const filePath of projectFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remover importações do expo-splash-screen
    content = content.replace(importRegex, '');

    // Remover chamadas ao SplashScreen.hideAsync ou preventAutoHideAsync
    const splashScreenRegex = /SplashScreen\.(preventAutoHideAsync|hideAsync)\(\);\n?/g;
    content = content.replace(splashScreenRegex, '');

    // Remover outras chamadas ao SplashScreen
    const otherSplashRegex = /SplashScreen\.[a-zA-Z]+(\([^)]*\))?;\n?/g;
    content = content.replace(otherSplashRegex, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`${colors.fg.green}Arquivo modificado: ${filePath}${colors.reset}`);
      filesModified++;
    }
  }

  console.log(`${colors.fg.green}Total de ${filesModified} arquivos modificados${colors.reset}`);
}

// Função para instalar as dependências recomendadas
function installRecommendedDependencies() {
  console.log(`${colors.fg.yellow}Instalando dependências nas versões recomendadas...${colors.reset}`);

  try {
    execSync(
      'npx expo install @react-native-async-storage/async-storage@1.23.1 react-native@0.76.9 react-native-gesture-handler@~2.20.2 react-native-reanimated@~3.16.1 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0',
      { stdio: 'inherit' }
    );
    console.log(`${colors.fg.green}Dependências instaladas com sucesso!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao instalar dependências: ${error.message}${colors.reset}`);
  }
}

// Função para limpar o cache do Metro
function clearMetroCache() {
  console.log(`${colors.fg.yellow}Limpando cache do Metro Bundler...${colors.reset}`);

  try {
    // Criar pasta temporária .expo se não existir
    if (!fs.existsSync('.expo')) {
      fs.mkdirSync('.expo');
    }

    // Limpar vários tipos de cache
    execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
    execSync('npx expo start --clear --no-dev --non-interactive', { stdio: 'ignore' });
    console.log(`${colors.fg.green}Cache limpo com sucesso!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.fg.red}Erro ao limpar cache: ${error.message}${colors.reset}`);
  }
}

// Executar funções
try {
  removeSplashScreenImports();
  installRecommendedDependencies();
  clearMetroCache();

  console.log(`
${colors.fg.green}===========================================${colors.reset}
${colors.fg.green}  CORREÇÕES CONCLUÍDAS COM SUCESSO!       ${colors.reset}
${colors.fg.green}===========================================${colors.reset}

${colors.fg.cyan}Agora você pode executar:${colors.reset}
${colors.fg.yellow}npm run dev:android${colors.reset}

${colors.fg.cyan}Se ainda encontrar problemas, execute:${colors.reset}
${colors.fg.yellow}npm run clear-cache${colors.reset}
`);

} catch (error) {
  console.error(`${colors.fg.red}Erro durante as correções: ${error.message}${colors.reset}`);
}
