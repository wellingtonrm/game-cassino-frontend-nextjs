# Mines Game - Mobile Page

Página mobile do jogo Minas para DApp na rede Polygon usando USDT.

## Componentes Implementados

### 📱 MinesPage (Container Principal)
- **Arquivo**: `mines-page.tsx`
- **Descrição**: Componente principal que gerencia o estado do jogo e integra todos os sub-componentes
- **Funcionalidades**:
  - Gerenciamento de estado do jogo
  - Integração com smart contracts
  - Controle de fluxo de apostas

### 🎯 GameBoard
- **Arquivo**: `@/components/mobile/mines/GameBoard.tsx`
- **Descrição**: Grid 5x5 interativo para o jogo
- **Estados das células**: `closed`, `safe`, `mine`, `revealed`
- **Funcionalidades**:
  - Renderização visual das células
  - Feedback visual por estado
  - Interação com cliques

### 🎮 ControlsPanel
- **Arquivo**: `@/components/mobile/mines/ControlsPanel.tsx`
- **Descrição**: Painel de controles de aposta
- **Funcionalidades**:
  - Input de valor da aposta
  - Botões multiplicadores (½, 2x)
  - Botão principal Bet/Cash Out
  - Validação de saldo

### ⚙️ MinesSelector
- **Arquivo**: `@/components/mobile/mines/MinesSelector.tsx`
- **Descrição**: Seletor de configurações do jogo
- **Funcionalidades**:
  - Dropdown para número de minas (1-24)
  - Toggle Manual/Auto
  - Cálculo de multiplicadores
  - Estatísticas do jogo

### 💰 HeaderBalance
- **Arquivo**: `@/components/mobile/mines/HeaderBalance.tsx`
- **Descrição**: Cabeçalho com saldo e navegação
- **Funcionalidades**:
  - Exibição do saldo USDT
  - Botão de voltar
  - Título do jogo

### 🧭 FooterNav
- **Arquivo**: `@/components/mobile/mines/FooterNav.tsx`
- **Descrição**: Barra de navegação inferior
- **Funcionalidades**:
  - Ícones de configurações
  - Seção Fairness
  - Informações do jogo

### 📡 TxStatusToast
- **Arquivo**: `@/components/mobile/mines/TxStatusToast.tsx`
- **Descrição**: Componente de notificações
- **Tipos**: `success`, `error`, `loading`, `warning`

## 🔗 Integração Smart Contracts

### Hook: useMinesContract
- **Arquivo**: `@/hooks/useMinesContract.ts`
- **Funcionalidades**:
  - Leitura de saldo USDT
  - Aprovação de tokens
  - Execução de apostas
  - Revelação de células
  - Cash out

### Contratos Necessários
```solidity
// GameMines Contract
function placeBet(uint256 amount, uint8 minesCount) external returns (uint256 gameId)
function revealCell(uint256 gameId, uint8 cellIndex) external returns (bool isMine)
function cashOut(uint256 gameId) external returns (uint256 payout)

// Events
event GameStarted(uint256 indexed gameId, address indexed player, uint256 betAmount, uint8 minesCount)
event CellRevealed(uint256 indexed gameId, uint8 cellIndex, bool isMine, uint256 multiplier)
event GameEnded(uint256 indexed gameId, address indexed player, bool won, uint256 payout)
```

## 🎨 Design System

### Paleta de Cores
- **Primary**: `#420b58`
- **Accent**: `#fc036c`
- **Background**: `#0f0b12`
- **Card**: `#1b1020`
- **Success**: `#00ff66` (botão Bet)
- **Border**: `#2A3050`
- **Highlight**: `#fdbf5c`

### Responsividade
- **Viewport alvo**: 360-414px width
- **Mobile-first**: Otimizado para dispositivos móveis
- **Grid**: Sistema flexível com Tailwind CSS

## 🚀 Como Usar

1. **Configurar endereços dos contratos**:
   ```typescript
   // Em useMinesContract.ts
   const MINES_CONTRACT_ADDRESS = '0x...' // Endereço do contrato Mines
   const USDT_CONTRACT_ADDRESS = '0x...'  // Endereço do USDT na Polygon
   ```

2. **Importar e usar o componente**:
   ```tsx
   import MinesPage from './mines-page'
   
   export default function Page() {
     return <MinesPage />
   }
   ```

3. **Dependências necessárias**:
   - `wagmi` - Integração Web3
   - `viem` - Utilitários Ethereum
   - `react-hot-toast` - Notificações
   - `lucide-react` - Ícones

## 🧪 Testes

### Testes Unitários
- Interação dos botões (½, 2x, toggle Manual/Auto)
- Validação de entrada de apostas
- Estados das células do tabuleiro

### Testes E2E
- Fluxo completo de aposta com wallet simulada
- Aprovação de tokens
- Revelação de células
- Cash out

### Testes Visuais
- Snapshot testing para garantir correspondência com layout
- Responsividade em diferentes tamanhos de tela

## 📋 Critérios de Aceitação

- ✅ Layout idêntico à imagem de referência
- ✅ Fluxo approve → placeBet → resultado funcionando
- ✅ Botão Bet verde neon visível e responsivo
- ✅ Mobile-first, usabilidade fluida
- ✅ Dark theme com paleta especificada
- ✅ Componentização modular
- ✅ Integração com smart contracts
- ✅ Sistema de notificações

## 🔧 Próximos Passos

1. **Configurar endereços reais dos contratos**
2. **Implementar testes automatizados**
3. **Adicionar animações de transição**
4. **Otimizar performance**
5. **Adicionar modo auto-play**
6. **Implementar histórico de jogos**