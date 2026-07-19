# Dominium DayZ

Site oficial do servidor brasileiro de DayZ **Dominium** — com status ao vivo, notícias, loja VIP, ranking, equipe, FAQ, recurso de ban e contato.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — roda o servidor de API (porta dinâmica via PORT)
- `pnpm --filter @workspace/dominium run dev` — roda o frontend (porta dinâmica via PORT)
- `pnpm run typecheck` — typecheck completo
- `pnpm run build` — typecheck + build de todos os pacotes
- `pnpm --filter @workspace/api-spec run codegen` — regenera hooks React Query e schemas Zod a partir do OpenAPI spec
- `pnpm --filter @workspace/db run push` — aplica mudanças no schema do banco (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4, Wouter, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validação: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/dominium/` — Frontend React/Vite (páginas, componentes, layout)
- `artifacts/api-server/src/routes/` — Rotas da API Express
- `artifacts/api-server/src/seed.ts` — Seed de dados iniciais (roda no startup)
- `lib/api-spec/openapi.yaml` — Spec OpenAPI (fonte da verdade dos contratos)
- `lib/api-client-react/src/generated/` — Hooks gerados pelo Orval
- `lib/api-zod/src/generated/` — Schemas Zod gerados pelo Orval
- `lib/db/src/schema/` — Schema do banco de dados (Drizzle)

## Architecture decisions

- O seed é chamado automaticamente no startup da API (`seedDatabase()` em `index.ts`)
- Status do servidor é simulado (em produção integraria com a API do DayZ)
- Jogadores online são gerados dinamicamente para simular o servidor real
- Frontend usa `BASE_URL` do Vite para path-prefixed routing do workspace Replit

## Product

- **Home** — Hero com status ao vivo do servidor (jogadores, ping, mapa)
- **Status** — Detalhes completos do servidor e lista de jogadores online
- **Notícias** — Feed de notícias/atualizações com categorias e detalhes
- **Loja** — Pacotes VIP com preços e benefícios
- **Ranking** — Leaderboard por kills, sobrevivência, tempo de jogo e loot
- **Regras** — Regras completas do servidor
- **Equipe** — Staff do servidor com cargos e status
- **FAQ** — Perguntas frequentes por categoria
- **Recurso** — Formulário de recurso de banimento
- **Contato** — Formulário de contato
- **Mapa** — Mapa interativo do servidor

## User preferences

- O usuário quer continuar a partir do site existente (restaurado do zip 2112-main). Preservar a estrutura e identidade visual.

## Gotchas

- Após qualquer mudança no `lib/api-spec/openapi.yaml`, rodar `pnpm --filter @workspace/api-spec run codegen`
- O `pnpm --filter @workspace/db run push` só funciona com `DATABASE_URL` disponível
- O frontend usa `import.meta.env.BASE_URL` — não usar paths absolutos hardcoded

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
