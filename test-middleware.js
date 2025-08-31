/**
 * Teste manual para validar o middleware de detecção de dispositivo
 * Execute com: node test-middleware.js
 */

// Simulação das funções do middleware para teste
function isMobileDevice(userAgent) {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  return mobileRegex.test(userAgent);
}

function getDeviceSpecificRoute(pathname, isMobile) {
  const MOBILE_PREFIX = '/m';
  const DESKTOP_PREFIX = '/d';
  
  // Remove prefixos existentes
  let cleanPath = pathname;
  if (cleanPath.startsWith(MOBILE_PREFIX)) {
    cleanPath = cleanPath.substring(MOBILE_PREFIX.length) || '/';
  } else if (cleanPath.startsWith(DESKTOP_PREFIX)) {
    cleanPath = cleanPath.substring(DESKTOP_PREFIX.length) || '/';
  }
  
  // Adiciona o prefixo apropriado
  const prefix = isMobile ? MOBILE_PREFIX : DESKTOP_PREFIX;
  
  // Se é a rota raiz, retorna apenas o prefixo
  if (cleanPath === '/') {
    return prefix;
  }
  
  return `${prefix}${cleanPath}`;
}

// Casos de teste
const testCases = [
  {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    pathname: '/wallet',
    expected: '/m/wallet',
    description: 'iPhone - rota wallet'
  },
  {
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    pathname: '/checkout',
    expected: '/m/checkout',
    description: 'Android - rota checkout'
  },
  {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    pathname: '/wallet',
    expected: '/d/wallet',
    description: 'Desktop Windows - rota wallet'
  },
  {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    pathname: '/game',
    expected: '/d/game',
    description: 'Desktop Mac - rota game'
  },
  {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    pathname: '/',
    expected: '/m',
    description: 'iPad - rota raiz'
  },
  {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    pathname: '/',
    expected: '/d',
    description: 'Desktop - rota raiz'
  }
];

console.log('🧪 Testando Middleware de Detecção de Dispositivo\n');
console.log('=' .repeat(60));

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  const isMobile = isMobileDevice(testCase.userAgent);
  const result = getDeviceSpecificRoute(testCase.pathname, isMobile);
  const passed = result === testCase.expected;
  
  console.log(`\nTeste ${index + 1}: ${testCase.description}`);
  console.log(`User-Agent: ${testCase.userAgent.substring(0, 50)}...`);
  console.log(`Dispositivo detectado: ${isMobile ? 'Mobile' : 'Desktop'}`);
  console.log(`Rota original: ${testCase.pathname}`);
  console.log(`Rota esperada: ${testCase.expected}`);
  console.log(`Rota obtida: ${result}`);
  console.log(`Status: ${passed ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  if (passed) passedTests++;
});

console.log('\n' + '=' .repeat(60));
console.log(`\n📊 Resultado dos Testes:`);
console.log(`✅ Testes aprovados: ${passedTests}/${totalTests}`);
console.log(`❌ Testes falharam: ${totalTests - passedTests}/${totalTests}`);
console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 Todos os testes passaram! O middleware está funcionando corretamente.');
} else {
  console.log('\n⚠️  Alguns testes falharam. Verifique a implementação do middleware.');
}

console.log('\n' + '=' .repeat(60));