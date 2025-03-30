# Cache com SWRV

Este documento explica como utilizar a estratégia de cache SWR (Stale-While-Revalidate) na aplicação Intuitive Care usando a biblioteca SWRV para Vue.js.

## O que é SWR?

SWR (Stale-While-Revalidate) é uma estratégia de cache que garante uma experiência rápida para usuários, retornando dados armazenados em cache (stale) imediatamente enquanto atualiza (revalidate) esses dados em segundo plano.

Principais benefícios:

- Rápida exibição de dados sem espera
- Atualizações automáticas quando os dados mudam
- Revalidação automática em diferentes situações (foco na janela, reconexão, etc)
- Deduplicação de requisições

## Instalação

```bash
npm install swrv
```

## Como usamos SWRV na aplicação

Criamos um composable personalizado em `src/app/composables/useSwrvCache.ts` que integra o SWRV com nosso cliente Axios, adicionando recursos como:

1. Integração com o sistema de rate limit
2. Cache global compartilhado
3. Tipagem TypeScript
4. Métodos auxiliares para operações comuns

## Exemplo de uso básico

```typescript
import { useApiCache } from '@/app/composables/useSwrvCache'

// Em um componente Vue
const { data, error, isLoading, refresh } = useApiCache('/api/endpoint')
```

## Hooks específicos disponíveis

Para facilitar o uso comum, já criamos hooks específicos para endpoints frequentes:

```typescript
// Listar operadoras
const { data: operators } = useOperatorsCache({ search: 'termo' })

// Detalhes de uma operadora
const { data: operator } = useOperatorDetailCache(123)
```

## Opções de configuração

O sistema usa configurações padrão otimizadas, mas você pode personalizar:

```typescript
const { data } = useApiCache('/api/endpoint', params, {
  // Tempo para evitar requisições duplicadas (padrão: 10s)
  dedupingInterval: 5000,

  // Tempo de vida do cache (padrão: 5 minutos)
  ttl: 60 * 1000, // 1 minuto

  // Revalidar quando janela ganhar foco (padrão: true)
  revalidateOnFocus: false,
})
```

## Integrações e recursos avançados

### Integração com Rate Limit

O sistema está configurado para trabalhar em conjunto com nosso controle de rate limit:

- Se uma solicitação for bloqueada devido ao rate limit, o sistema tentará retornar dados em cache
- O sistema é inteligente o suficiente para não tentar solicitações durante períodos de rate limit

### Manipulação de dados em cache

```typescript
const { data, mutate, invalidate } = useApiCache('/api/endpoint')

// Atualizar dados localmente sem fazer requisição
mutate(newData)

// Forçar revalidação (buscar dados frescos)
mutate()

// Invalidar dados em cache para este endpoint
invalidate()
```

## Exemplo completo de componente

Veja o exemplo em `src/app/composables/useExampleSwrv.vue` para uma implementação completa utilizando o cache SWRV com lista e detalhes de operadoras, incluindo:

1. Exibição de dados em cache imediatamente
2. Estados de carregamento
3. Tratamento de erros
4. Atualização manual de dados
5. Filtragem local de dados em cache
6. Carregamento condicional de detalhes
