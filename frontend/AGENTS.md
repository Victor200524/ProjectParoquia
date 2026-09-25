<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ProjectParoquia — visão geral do sistema

Este `frontend/` é metade de um projeto full-stack de estágio supervisionado (sistema de gestão para a Paróquia São Miguel). O backend fica na pasta irmã `../backend` (Spring Boot, não tem AGENTS.md próprio ainda). Este resumo existe para não precisar reanalisar o projeto do zero a cada sessão.

## Stack

- **Frontend** (aqui): Next.js 16.2.2 (App Router) + React 19.2.4 + TypeScript. Estilo real é CSS Modules por página (Tailwind v4 está configurado mas quase não é usado). Sem axios/react-query/SWR — tudo `fetch` nativo. Sem react-hook-form/zod — validação manual. Sem gerenciador de estado global, sem `middleware.ts`.
- **Backend** (`../backend`): Spring Boot 4.0.5, Java 25, Maven, PostgreSQL (`bd_paroquia`), Spring Security + JWT (auth0 java-jwt), springdoc-openapi, SDK Mercado Pago. Roda em `localhost:8080`.

## Domínio

Entidades principais (existem nos dois lados, frontend em `src/types/*.ts` e backend em `entities/*.java`): Usuario, Comunidade, HorarioMissa, Acampamento, Doacao, ItemEstoque, MovimentacaoEstoque, MuralFotos, InscricaoAcampamento, Pagamento, Pastoral.

- Usuário tem nível de acesso (`UsuarioTipoNivel`: COORDENADOR_GERAL, PADRE, SECRETARIA, COORDENADOR_ACAMPAMENTO, SERVO, CAMPISTA) e status (ATIVO/INATIVO/PENDENTE).
- Estoque: `ItemEstoque` tem quantidade agregada que só muda via `MovimentacaoEstoque` (tipos ENTRADA/SAIDA/TRANSFERENCIA/PERDA_VALIDADE). A lógica de saldo (somar/subtrair, exigir origem+destino em transferência) está no controller `MovimentoEstoqueRestControllers` do backend, não no service.

## Rotas do frontend

- `(auth)`: `login`, `cadastro` — sem layout de dashboard.
- `(dashboard)`: layout com Sidebar+Header; dentro dele, `forms/<entidade>/page.tsx` — um formulário por entidade.
- **Implementado**: login, cadastro, forms de acampamento, comunidades, doacao, itemEstoque, movimentoEstoque, usuarios, muralFotos.
- **Placeholder vazio (ainda não implementado)**: forms de equipes, estoque (visão geral), financeiro, formularios, inscricoes, missas, mural (geral), pastorais, relatorios; widgets do painel (`atalhosRapidos`, `estatisticasCards`, `ultimasMovimentacoes`); componentes de UI genéricos (`Buttons`, `Input`, `Modal`); vários `services/*.ts` e `types/*.ts` (equipe, estoque, financeiro, formulario, inscricao, missa, pagamento, pastoral).

## Autenticação

- `localStorage` guarda `token`, `idUsuario`, `nomeUsuario`, `nivelUsuario`. Sem cookies httpOnly, sem contexto de auth, sem middleware global.
- Proteção de rota via `src/components/auth/ProtectedRoute.tsx`, aplicado **manualmente** por página — hoje só em `/painel` e `forms/acampamento`. As demais telas de `forms/` não bloqueiam visualmente o acesso.
- O frontend usa `POST /usuario/loginUsuario` (backend), que hoje devolve um token **fake** (`"logado-sucesso"`), não um JWT real. Existe um segundo fluxo de login no backend (`POST /autenticacao`, via Spring Security, JWT real com auth0) que o frontend **não usa** — os dois fluxos coexistem e provavelmente precisam ser unificados.
- Cada `service` do frontend tem sua própria `BASE_URL` hardcoded (`http://localhost:8080/...`); `src/services/api.ts` está vazio (sem client HTTP centralizado nem variável de ambiente).

## Backend — pontos de atenção

- Quase todas as rotas estão `permitAll()` no `SecurityConfig` — o controle por nível de usuário já está modelado nas `authorities` (`ROLE_ADMIN`/`ROLE_COORDENADOR`/`ROLE_USER`) mas não é aplicado nos endpoints ainda.
- `SecurityFilter` parece ter um bug: resolve o usuário autenticado por CPF a partir do subject do token, mas o token (`/autenticacao`) é gerado com **e-mail** como subject.
- `InscricaoAcampamentoRestControllers` está vazio (sem endpoints implementados).
- Credenciais de banco, segredo JWT e access token do Mercado Pago estão hardcoded em texto puro em `application.properties` (sem variáveis de ambiente). `ddl-auto=update`, sem Flyway/Liquibase.
- `MovimentacaoEstoque.java` é a entidade mais mexida recentemente — cuidado ao alterar o construtor completo e o nome da coluna de join `acampamentodestino_id_acampamento` (já houve um bug ali em que o construtor sempre zerava `acampamentoDestino`).

## Inconsistências conhecidas (não corrigidas ainda)

1. `src/app/painel/page.tsx` fica **fora** do grupo `(dashboard)`, então não herda automaticamente o layout com Sidebar/Header.
2. Rotas do menu em `Sidebar.tsx` (`/inscricoes`, `/equipes`, `/estoque`, `/financeiro`) não batem com os caminhos reais das páginas (que ficam sob `/forms/...`).
3. Dois fluxos de login no backend coexistindo (real vs. fake) — o frontend usa o fake.
