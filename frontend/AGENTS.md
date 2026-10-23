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

Entidades principais (existem nos dois lados, frontend em `src/types/*.ts` e backend em `entities/*.java`): Usuario, Comunidade, HorarioMissa, Acampamento, Doacao, ItemEstoque, MovimentacaoEstoque, MuralFotos, InscricaoAcampamento, Pagamento, Pastoral, Formulario, Pergunta, Resposta.

- Usuário tem nível de acesso (`UsuarioTipoNivel`: COORDENADOR_GERAL, PADRE, SECRETARIA, COORDENADOR_ACAMPAMENTO, SERVO, CAMPISTA) e status (ATIVO/INATIVO/PENDENTE).
- Formulário dinâmico (estilo Google Forms): `Formulario` tem público-alvo (campista/servo) e várias `Pergunta`s de tipos variados; o campista/servo responde (`Resposta`) e isso gera uma `InscricaoAcampamento` (status em `InscricaoAcampamentoStatus`).
- Estoque: `ItemEstoque` tem quantidade agregada que só muda via `MovimentacaoEstoque` (tipos ENTRADA/SAIDA/TRANSFERENCIA/PERDA_VALIDADE). A lógica de saldo (somar/subtrair, exigir origem+destino em transferência) está no controller `MovimentoEstoqueRestControllers` do backend, não no service.

## Rotas do frontend

- `(auth)`: `login`, `cadastro` — sem layout de dashboard.
- `(dashboard)`: layout com Sidebar+Header+`VerificarSessao`; dentro dele, `forms/<entidade>/page.tsx` (cadastro, um por entidade), `views/<entidade>/page.tsx` (listagem/visualização), `inscricao/resposta` e `painel`.
- **Implementado**: login, cadastro; forms de acampamento, comunidades, doacao, itemEstoque, movimentoEstoque, usuarios, muralFotos, formularios, `pergunta/[idFormulario]`; views de formularios, `formulariosPerguntasRespostas/[idFormulario]`, inscricoes, usuarios; `inscricao/resposta` (lista de formulários disponíveis) e `inscricao/resposta/[idFormulario]` (responder); `acesso-negado`.
- **Em andamento**: `painel` (ainda com lógica de nível hardcoded e cards estáticos; plano é trocar pelos widgets reais via `src/config/painelWidgets.ts` e hooks `useUsuarioLogado`/`useAsync`, que já existem).
- **Placeholder vazio (ainda não implementado)**: forms de equipes, estoque (visão geral), financeiro, inscricoes, missas, mural (geral), pastorais, relatorios; `views/acampamento`; widgets do painel (`atalhosRapidos`, `estatisticasCards`, `ultimasMovimentacoes`); componentes de UI genéricos (`Buttons`, `Input`, `Modal`); vários `services/*.ts` e `types/*.ts` (equipe, estoque, financeiro, missa, pagamento, pastoral).

## Autenticação

- `localStorage` guarda `token`, `idUsuario`, `nomeUsuario`, `nivelUsuario`. Sem cookies httpOnly, sem contexto de auth, sem middleware global.
- Login: `POST /usuario/loginUsuario` (por CPF — no banco o CPF fica **com máscara** `000.000.000-00`) devolve um **JWT real** (`TokenService.gerarToken`, subject = CPF, validade de 2h). Usuários inativos são barrados no login.
- Todo service manda `Authorization: Bearer <token>`, exceto as rotas públicas (login, cadastro, `listarAcampamentosPublicos`).
- Sessão: `src/components/auth/VerificarSessao.tsx` fica no layout do `(dashboard)` e, a cada troca de página, chama `GET /usuario/validarToken` com o Bearer; desloga e manda para `/login` só em 401/403 (servidor fora do ar/500 mantém logado). Reiniciar o backend **não** desloga mais.
- Proteção por nível via `src/components/auth/ProtectedRoute.tsx`, aplicado **manualmente** por página — hoje em `painel`, `forms/acampamento`, `forms/formularios`, `forms/itemEstoque`, `forms/movimentoEstoque`, `forms/muralFotos`, `forms/usuarios`, `views/formularios`, `views/inscricoes` e `views/usuarios`. É só conveniência de tela; quem garante o acesso é o backend.
- Padrão **filho/pai** obrigatório nas telas protegidas que buscam dados: a lógica fica num componente filho (ex. `ListaInscricoes`) e o `export default` só envolve o filho no `ProtectedRoute`. Senão o `useEffect` da página dispara a busca antes da checagem de nível.
- Campista/servo usam `inscricaoAcampamentoService.listarMinhasInscricoes` (`GET /inscricaoAcampamento/minhasInscricoes`) e `respostaService.buscarRespostasPorInscricao` — nunca baixar a lista inteira e filtrar no navegador.
- `usuarioService.cadastrarUsuario` (público, só CAMPISTA/SERVO, status forçado ATIVO) vs. `cadastrarUsuarioAdmin` (`forms/usuarios`, qualquer nível, só ADMIN).
- Cada `service` do frontend tem sua própria `BASE_URL` hardcoded (`http://localhost:8080/...`); `src/services/api.ts` está vazio (sem client HTTP centralizado nem variável de ambiente).

## Backend — pontos de atenção

- `SecurityFilter` valida o JWT, busca o usuário pelo CPF do subject e barra INATIVO; o `Usuario` vira o principal (controllers usam `@AuthenticationPrincipal Usuario usuarioLogado` para não confiar em ids vindos do JSON — ex. `gravarInscricao`, `gravarResposta`, `alterarResposta`).
- `SecurityConfig` aplica nível por rota (negar por padrão: exceções específicas **antes** da regra geral do controller). `getAuthorities` afunila os 6 níveis em 3 roles: COORDENADOR_GERAL/PADRE/SECRETARIA → `ADMIN`+`USER`; COORDENADOR_ACAMPAMENTO → `COORDENADOR`+`USER`; SERVO/CAMPISTA → `USER`. Admin **não** tem `ROLE_COORDENADOR` → usar `hasAnyRole("ADMIN","COORDENADOR")`.
- Resumo das regras: `/acampamento/**`, `/pastoral/**`, `/usuario/**` (exceto login, cadastro público e `validarToken`) e escrita em `/comunidade` → ADMIN; GET de `/comunidade`, `/muralFotos` e `/acampamento/publico` → público; estoque, doação, escrita em formulário/pergunta/mural e o resto de `/resposta` e `/inscricaoAcampamento` → ADMIN,COORDENADOR; GET de formulário/pergunta, `gravarInscricao`, `gravarResposta`, `buscarRespostasPorInscricao`, `alterarResposta` → USER (com checagem de dono no controller); `minhasInscricoes` → autenticado.
- `Usuario.senhaUsuario` e `Acampamento.tokenMercadoPagoAcampamento`/`Acampamento.usuario` são `WRITE_ONLY` no JSON (não vazam nas respostas). `AcampamentoPublicoDTO` + `GET /acampamento/publico` para telas públicas.
- `POST /autenticacao` (login via Spring Security) é sobra do fluxo antigo: não está liberado no `SecurityConfig` e o frontend não usa — candidato a remoção.
- Swagger (springdoc) não está liberado no `SecurityConfig`: `/swagger-ui/**` e `/v3/api-docs/**` caem em `anyRequest().authenticated()`.
- Credenciais de banco, segredo JWT e access token do Mercado Pago estão hardcoded em texto puro em `application.properties` (sem variáveis de ambiente). `ddl-auto=update`, sem Flyway/Liquibase.
- `MovimentacaoEstoque.java` é a entidade mais mexida recentemente — cuidado ao alterar o construtor completo e o nome da coluna de join `acampamentodestino_id_acampamento` (já houve um bug ali em que o construtor sempre zerava `acampamentoDestino`).

## Inconsistências conhecidas (não corrigidas ainda)

1. Rotas do menu em `Sidebar.tsx` (`/equipes`, `/estoque`, `/financeiro`) não batem com os caminhos reais das páginas (que ficam sob `/forms/...`). O Sidebar não filtra itens por nível; o plano é criar `src/config/menuNavegacao.ts` (agora com suporte a submenus, que o Sidebar já usa).
2. `/autenticacao` sobrando no backend (ver acima).
3. `deletarPergunta` bloqueia (409) se houver respostas; o desejado é apagar as respostas junto.
