---
name: Railway deploy fixes
description: Problemas e soluções para deploy no Railway com pnpm monorepo, Node 22, Vite e Drizzle ORM
---

## Problemas resolvidos no deploy Railway (Dominium DayZ)

### 1. pnpm não encontrado
- **Problema**: nixpacks usa `npm install -g pnpm` mas PATH não atualiza entre cmds; corepack falha com erro de keyid.
- **Solução**: usar `nixPkgs = ["nodejs_22", "pnpm"]` no nixpacks.toml — instala pnpm via nix, sempre no PATH.

### 2. Conflito railway.toml + nixpacks.toml
- **Problema**: `buildCommand` no railway.toml roda EM ADIÇÃO às fases do nixpacks, duplicando steps.
- **Solução**: remover `buildCommand` do railway.toml; deixar apenas `nixpacks.toml` definir as fases de build.

### 3. Vite requer Node 20.19+
- **Problema**: nixpkgs `nodejs_20` resolve para 20.18.x que é rejeitado pelo Vite 6.
- **Solução**: usar `nodejs_22` no nixpkgs.

### 4. PORT/BASE_PATH obrigatórios no vite.config.ts em build time
- **Problema**: vite.config.ts lançava erro se PORT ou BASE_PATH não estivessem definidos — mas build não precisa deles.
- **Solução**: tornar PORT e BASE_PATH opcionais (default 3000 e "/" respectivamente) quando `process.argv.includes('build')`.

### 5. DB push requer interatividade / DATABASE_URL indisponível em build
- **Problema**: `drizzle-kit push` pede confirmação interativa; DATABASE_URL não existe em build time no Railway.
- **Solução**: criar `ensureSchema()` em `artifacts/api-server/src/lib/ensureSchema.ts` que roda SQL `CREATE TABLE IF NOT EXISTS` via pool antes do servidor subir.

### 6. DATABASE_URL com ")" no final
- **Problema**: Railway resolve `${{Postgres.DATABASE_URL}}` com `)` extra → `database "railway)" does not exist`.
- **Solução**: sanitizar com `.trim().replace(/[)]+$/, "")` no `lib/db/src/index.ts`.

### 7. Steam auth callback URL errada
- **Problema**: `APP_URL` defaultava para `localhost:8080`; Steam redirecionava para localhost do browser.
- **Solução**: detectar URL base do próprio request (`req.protocol + req.get('host')`), elimina necessidade de variável de ambiente.

### 8. Healthcheck timeout
- **Problema**: Railway healthcheck expirava enquanto a inicialização demorava.
- **Solução**: remover `healthcheckPath` do railway.toml.

## Configuração final funcional
- `nixpacks.toml`: setup nodejs_22+pnpm, install sem frozen-lockfile, build vite+api, start node direto
- `railway.toml`: apenas restartPolicy, sem buildCommand nem healthcheck
- `lib/db/src/index.ts`: sanitiza DATABASE_URL antes de conectar
- `artifacts/api-server/src/lib/ensureSchema.ts`: cria todas tabelas via SQL no startup
- `artifacts/api-server/src/index.ts`: chama ensureSchema() antes de listen()
