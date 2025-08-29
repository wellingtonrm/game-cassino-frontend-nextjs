/**
 * Design System - Paleta de cores conforme especificação
 * Plataforma EAD Gamificada "Conquiste o Futuro" - Nova paleta de cores neutra e moderna
 */

export const colors = {
  // Cores principais
  primary: '#2C2657',        // Roxo escuro - botões principais, ações primárias
  secondary: '#D6B897',      // Bege dourado - destaques, links, elementos secundários
  accent: '#2C2657',         // Cor de destaque (mesmo que primary)
  logo: '#ffc14f',           // Amarelo dourado da logo - elementos de marca
  
  // Cores neutras e de fundo
  lightGray: '#F2F2F2',      // Cinza claro - fundo principal, áreas neutras
  mediumGray: '#717171',     // Cinza médio - bordas, texto secundário
  darkGray: '#0E0E0E',       // Preto quase - texto principal, ênfase
  
  // Mapeamento para compatibilidade com código existente
  lightBeige: '#F2F2F2',     // Mapeado para lightGray
  mediumBeige: '#D6B897',    // Mapeado para secondary
  darkBrown: '#2C2657',      // Mapeado para primary
  burnedGold: '#D6B897',     // Mapeado para secondary
  
  // Cores de texto
  neutralGray1: '#717171',   // Cinza médio - texto secundário
  neutralGray2: '#717171',   // Cinza médio - linhas, elementos neutros
  realBlack: '#0E0E0E',      // Preto quase - texto principal, ênfase
  
  // Cores de sistema (mantidas para compatibilidade)
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#F2F2F2',
    100: '#F2F2F2',
    200: '#D6B897',
    300: '#D6B897',
    400: '#717171',
    500: '#717171',
    600: '#2C2657',
    700: '#2C2657',
    800: '#0E0E0E',
    900: '#0E0E0E',
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
