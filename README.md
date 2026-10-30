# Cypress ServeRest Tests

Suíte de automação em **Cypress + JavaScript** para o [ServeRest](https://serverest.dev): 3 specs E2E (frontend) e 3 specs de API, com cenários positivos e negativos.

## Estrutura

```
.github/workflows/cypress.yml   # CI (GitHub Actions): matriz frontend | api
cypress/
├── e2e/
│   ├── frontend/  login | cadastroUsuario | cadastroProduto
│   └── api/       login | usuarios | produtos
└── support/
    ├── commands.js   # comandos de API (setup/teardown) e loginUI (cy.session)
    ├── e2e.js
    └── pages/        # Page Objects
cypress.config.js
.env.example
```

## Decisões técnicas

- **Page Object Model** para isolar seletores (`data-testid`) dos testes.
- **Massa de dados dinâmica** (Faker: nomes, e-mails, senhas, UUIDs); nenhuma credencial fixa ou real no repositório.
- **Setup via API, validação via UI**: pré-condições (usuário, produto duplicado) são criadas por `cy.request`; login de UI usa `cy.session` e roda uma vez por usuário.
- **Teardown** dos registros criados nos hooks `after` e ao final dos testes de API.
- **Configuração por ambiente**: `CYPRESS_BASE_URL` e `CYPRESS_apiUrl` (ver `.env.example`); no CI, via variáveis do repositório `BASE_URL` / `API_URL`.
- **Exceções da aplicação não são silenciadas**, exceto o ruído `ResizeObserver`.
- **CI**: roda `frontend` e `api` em paralelo (matriz), com timeout e upload de screenshots em falhas.

## Execução

Requer Node.js 18+.

```bash
npm install
npm run cy:open        # modo interativo
npm test               # toda a suíte (headless)
npm run test:frontend
npm run test:api
```

## Cenários

| Camada | Spec | Positivo | Negativo |
|---|---|---|---|
| E2E | login | login válido | credenciais inválidas; campos vazios |
| E2E | cadastroUsuario | cadastro e redirecionamento | e-mail duplicado; campos vazios |
| E2E | cadastroProduto | cadastro por admin | nome duplicado; campos vazios |
| API | POST /login | 200 + token | 401 senha errada; 400 sem campos |
| API | /usuarios | 201 cadastro; 200 listagem | 400 e-mail duplicado; 400 e-mail inválido |
| API | /produtos | 201 cadastro; 200 filtro por nome | 401 sem token; 403 não admin; 400 nome duplicado |

## Observações

O ambiente público do ServeRest é compartilhado e zerado periodicamente; por isso toda a massa é gerada em tempo de execução.
