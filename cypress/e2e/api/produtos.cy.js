import { faker } from "@faker-js/faker";

const apiUrl = Cypress.env("apiUrl");

describe("API | /produtos", () => {
  let tokenAdmin;
  let adminId;

  before(() => {
    
    const admin = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "true",
    };

    cy.apiCriarUsuario(admin).then((resposta) => {
      adminId = resposta.body._id;

      cy.apiLogin(admin.email, admin.password).then((loginResponse) => {
        tokenAdmin = loginResponse.body.authorization;
      });
    });
  });

  after(() => {
    if (adminId) {
      cy.apiExcluirUsuario(adminId);
    }
  });

  it("CT01 - Administrador autenticado deve cadastrar um novo produto com sucesso", () => {
    const produto = {
      nome: `Produto ${faker.string.uuid()}`,
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 50 }),
    };

    cy.apiCriarProduto(produto, tokenAdmin).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq("Cadastro realizado com sucesso");
      expect(response.body).to.have.property("_id").and.not.be.empty;

      cy.apiExcluirProduto(response.body._id, tokenAdmin);
    });
  });

  it("CT02 - Não deve permitir cadastro de produto sem token de autenticação e deve retornar status 401", () => {
    const produto = {
      nome: `Produto ${faker.string.uuid()}`,
      preco: 100,
      descricao: "Produto de teste sem autenticação",
      quantidade: 5,
    };

    cy.request({
      method: "POST",
      url: `${apiUrl}/produtos`,
      body: produto,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
    });
  });

  it("CT03 - Deve listar produtos cadastrados e permitir filtro por nome", () => {
    const produto = {
      nome: `Produto Filtro ${faker.string.uuid()}`,
      preco: 250,
      descricao: "Produto usado para validar filtro por nome",
      quantidade: 3,
    };

    cy.apiCriarProduto(produto, tokenAdmin).then((criado) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/produtos`,
        qs: { nome: produto.nome },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.eq(1);
        expect(response.body.produtos[0].nome).to.eq(produto.nome);

        cy.apiExcluirProduto(criado.body._id, tokenAdmin);
      });
    });
  });

  it("CT04 - Usuário não administrador não deve cadastrar produto e deve retornar status 403", () => {
    const comum = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    };

    cy.apiCriarUsuario(comum).then((criado) => {
      cy.apiLogin(comum.email, comum.password).then((login) => {
        cy.apiCriarProduto(
          { nome: `Produto ${faker.string.uuid()}`, preco: 100, descricao: "Sem permissão", quantidade: 1 },
          login.body.authorization
        ).then((response) => {
          expect(response.status).to.eq(403);
          expect(response.body.message).to.eq("Rota exclusiva para administradores");
          cy.apiExcluirUsuario(criado.body._id);
        });
      });
    });
  });

  it("CT05 - Não deve cadastrar produto com nome duplicado e deve retornar status 400", () => {
    const produto = {
      nome: `Produto Duplicado ${faker.string.uuid()}`,
      preco: 100,
      descricao: "Validação de duplicidade",
      quantidade: 2,
    };

    cy.apiCriarProduto(produto, tokenAdmin).then((primeira) => {
      expect(primeira.status).to.eq(201);

      cy.apiCriarProduto(produto, tokenAdmin).then((segunda) => {
        expect(segunda.status).to.eq(400);
        expect(segunda.body.message).to.eq("Já existe produto com esse nome");
        cy.apiExcluirProduto(primeira.body._id, tokenAdmin);
      });
    });
  });
});
