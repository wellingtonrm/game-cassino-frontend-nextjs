/**
 * Design System - Paleta de cores conforme especificação
 * Plataforma EAD Gamificada "Conquiste o Futuro" - Nova paleta de cores neutra e moderna
 */

export const colors = {
  // Cores principais da nova paleta
  primary: '#121214',        // Preto quase - fundo padrão dark da aplicação
  secondary: '#fdbf5c',      // Laranja dourado - destaques, links, elementos secundários
  accent: '#f69a0b',         // Laranja forte - ações importantes, botões principais
  danger: '#d43a00',         // Laranja vermelho - avisos, erros
  error: '#9b0800',          // Vermelho escuro - erros críticos
  logo: '#fdbf5c',           // Amarelo dourado da logo - elementos de marca
  
  // Cores neutras e de fundo
  lightGray: '#F2F2F2',      // Cinza claro - áreas neutras
  mediumGray: '#717171',     // Cinza médio - bordas, texto secundário
  darkGray: '#121214',       // Preto quase - fundo padrão dark
  
  // Mapeamento para compatibilidade com código existente
  lightBeige: '#F2F2F2',     // Mapeado para lightGray
  mediumBeige: '#fdbf5c',    // Mapeado para secondary
  darkBrown: '#121214',      // Mapeado para primary
  burnedGold: '#fdbf5c',     // Mapeado para secondary
  
  // Cores de texto
  neutralGray1: '#717171',   // Cinza médio - texto secundário
  neutralGray2: '#717171',   // Cinza médio - linhas, elementos neutros
  realBlack: '#121214',      // Preto quase - fundo padrão dark
  
  // Cores de sistema (mantidas para compatibilidade)
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#F2F2F2',
    100: '#F2F2F2',
    200: '#fdbf5c',
    300: '#fdbf5c',
    400: '#717171',
    500: '#717171',
    600: '#121214',
    700: '#121214',
    800: '#121214',
    900: '#121214',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
} as const;

export const borderRadius = {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem'
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
} as const;
