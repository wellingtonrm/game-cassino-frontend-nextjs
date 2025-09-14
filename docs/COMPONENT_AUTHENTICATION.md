# Sistema de Autenticação por Componentes

Este documento descreve como usar o sistema de autenticação baseado em componentes protegidos implementado no projeto.

## Visão Geral

O sistema funciona da seguinte forma:
- **Não há rotas protegidas** - apenas componentes protegidos
- Usuário conecta a wallet via RainbowKit + Wagmi
- Usuário assina uma mensagem para autenticação
- Tokens são salvos em cookies persistentes
- Componentes são protegidos usando hooks e wrappers

## Componentes Principais

### 1. Hook `useAuth`

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, login, logout, address } = useAuth();
  
  // Usar isAuthenticated para verificar status
  if (!isAuthenticated) {
    return <div>Usuário não autenticado</div>;
  }
  
  return <div>Usuário autenticado: {address}</div>;
}
```

### 2. Hook `useAuthStatus`

```typescript
import { useAuthStatus } from '@/hooks/useAuth';

function SimpleComponent() {
  const isAuthenticated = useAuthStatus();
  
  return isAuthenticated ? <SecretContent /> : <PublicContent />;
}
```

### 3. Componente `ProtectedComponent`

```typescript
import { ProtectedComponent } from '@/components/ProtectedComponent';

// Componente simples protegido
<ProtectedComponent>
  <div>Conteúdo só para usuários autenticados</div>
</ProtectedComponent>

// Componente protegido com fallback
<ProtectedComponent 
  fallback={<div>Faça login para ver este conteúdo</div>}
>
  <div>Conteúdo protegido</div>
</ProtectedComponent>
```

### 4. Hook `useProtectedRender`

```typescript
import { useProtectedRender } from '@/components/ProtectedComponent';

function MyComponent() {
  const { renderIfAuthenticated, renderIfNotAuthenticated } = useProtectedRender();
  
  return (
    <div>
      {renderIfNotAuthenticated(
        <div>Você precisa fazer login</div>
      )}
      
      {renderIfAuthenticated(
        <div>Bem-vindo, usuário autenticado!</div>
      )}
    </div>
  );
}
```

## Fluxo de Autenticação

### 1. Conexão da Wallet

```typescript
// O componente WalletConnection gerencia a conexão
import { WalletConnection } from '@/components/WalletConnection';

<WalletConnection />
```

### 2. Processo de Login

1. Usuário conecta a wallet
2. Sistema busca um nonce da API
3. Usuário assina o nonce
4. Sistema envia assinatura para API
5. API retorna tokens JWT
6. Tokens são salvos em cookies
7. Estado de autenticação é atualizado

### 3. Gerenciamento de Cookies

Os cookies são gerenciados automaticamente:
- `accessToken`: Token de acesso JWT
- `refreshToken`: Token para renovação
- `account`: Dados do usuário (endereço da wallet)

## Exemplos de Uso

### Proteger um Botão

```typescript
import { ProtectedComponent } from '@/components/ProtectedComponent';

function ActionButton() {
  return (
    <ProtectedComponent>
      <Button onClick={handleAction}>
        Ação Protegida
      </Button>
    </ProtectedComponent>
  );
}
```

### Proteger uma Seção Completa

```typescript
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Seção pública */}
      <PublicStats />
      
      {/* Seção protegida */}
      <ProtectedComponent 
        fallback={<LoginPrompt />}
      >
        <UserStats />
        <UserActions />
      </ProtectedComponent>
    </div>
  );
}
```

### Renderização Condicional Complexa

```typescript
function ComplexComponent() {
  const { isAuthenticated } = useAuth();
  const { renderIfAuthenticated } = useProtectedRender();
  
  return (
    <div>
      <Header />
      
      {!isAuthenticated && (
        <WelcomeMessage />
      )}
      
      {renderIfAuthenticated(
        <>
          <UserDashboard />
          <UserMenu />
        </>
      )}
      
      <Footer />
    </div>
  );
}
```

## Middleware

O middleware foi simplificado para não proteger rotas:
- Remove verificação de rotas protegidas
- Mantém funcionalidades de segurança
- Mantém redirecionamento por dispositivo (mobile/desktop)

## Cookies Persistentes

Os cookies são configurados para:
- **Duração**: 7 dias por padrão
- **Segurança**: Secure em produção
- **SameSite**: 'lax' para compatibilidade
- **Path**: '/' para acesso global

## Boas Práticas

1. **Use `useAuthStatus`** para verificações simples
2. **Use `ProtectedComponent`** para proteger blocos de UI
3. **Use `useProtectedRender`** para lógica condicional complexa
4. **Sempre forneça fallbacks** informativos para usuários não autenticados
5. **Teste o fluxo completo** de login/logout

## Troubleshooting

### Problema: Componente não atualiza após login
**Solução**: Verifique se está usando os hooks corretos (`useAuth` ou `useAuthStatus`)

### Problema: Cookies não persistem
**Solução**: Verifique as configurações de cookies no navegador e se o domínio está correto

### Problema: Estado inconsistente
**Solução**: O hook `useAuth` sincroniza automaticamente cookies com o store na inicialização

## Arquivos Relacionados

- `/src/hooks/useAuth.ts` - Hook principal de autenticação
- `/src/components/ProtectedComponent.tsx` - Componente wrapper
- `/src/components/WalletConnection.tsx` - Gerenciamento de conexão
- `/src/lib/cookies.ts` - Utilitários de cookies
- `/src/stores/authStore.ts` - Store Zustand
- `/src/middleware.ts` - Middleware simplificado