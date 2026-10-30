import { faker } from "@faker-js/faker";
import CadastroProdutoPage from "../../support/pages/CadastroProdutoPage";

describe("Frontend | Cadastro de Produto (fluxo administrador)", () => {
  let admin;
  let adminId;
  let tokenAdmin;

  before(() => {
    admin = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "true",
    };

    cy.apiCriarUsuario(admin).then((res) => {
      adminId = res.body._id;
      cy.apiLogin(admin.email, admin.password).then((login) => {
        tokenAdmin = login.body.authorization;
      });
    });
  });

  after(() => {
    if (adminId) cy.apiExcluirUsuario(adminId);
  });

  beforeEach(() => {
    cy.loginUI(admin.email, admin.password);
    CadastroProdutoPage.visitar();
  });

  it("CT01 - Administrador deve cadastrar um novo produto com sucesso", () => {
    const produto = {
      nome: `Produto ${faker.string.uuid()}`,
      preco: String(faker.number.int({ min: 10, max: 500 })),
      descricao: faker.commerce.productDescription(),
      quantidade: String(faker.number.int({ min: 1, max: 100 })),
    };

    CadastroProdutoPage.preencherFormulario(produto).cadastrar();

    cy.url().should("include", "/admin/listarprodutos");
    cy.contains(produto.nome).should("be.visible");
  });

  it("CT02 - Não deve permitir cadastro de produto com nome já existente", () => {
    const produto = {
      nome: `Produto Duplicado ${faker.string.uuid()}`,
      preco: 100,
      descricao: "Produto criado para validar duplicidade",
      quantidade: 10,
    };

    // Pré-condição via API (não depende de outro fluxo de UI)
    cy.apiCriarProduto(produto, tokenAdmin).its("status").should("eq", 201);

    CadastroProdutoPage.preencherFormulario({
      ...produto,
      preco: String(produto.preco),
      quantidade: String(produto.quantidade),
    }).cadastrar();

    CadastroProdutoPage.elements
      .mensagemAlerta()
      .should("be.visible")
      .and("contain.text", "Já existe produto com esse nome");
    cy.url().should("include", "/admin/cadastrarprodutos");
  });

  it("CT03 - Deve exibir validação ao cadastrar produto sem preencher os campos obrigatórios", () => {
    CadastroProdutoPage.cadastrar();

    CadastroProdutoPage.elements
      .mensagemAlerta()
      .should("be.visible")
      .and("contain.text", "Nome é obrigatório");
  });
});
