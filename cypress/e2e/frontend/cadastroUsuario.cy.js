import { faker } from "@faker-js/faker";
import CadastroUsuarioPage from "../../support/pages/CadastroUsuarioPage";

describe("Frontend | Cadastro de Usuário", () => {
  beforeEach(() => {
    CadastroUsuarioPage.visitar();
  });

  it("CT01 - Deve cadastrar um novo usuário com sucesso e redirecionar para a Home", () => {
    const novoUsuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: false,
    };

    CadastroUsuarioPage.preencherFormulario(novoUsuario).cadastrar();

    
    cy.url().should("include", "/home");
  });

  it("CT02 - Não deve permitir cadastro com um e-mail já utilizado por outro usuário", () => {
    const usuarioExistente = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    };

   
    cy.apiCriarUsuario(usuarioExistente).then(() => {
      CadastroUsuarioPage.preencherFormulario({
        ...usuarioExistente,
        administrador: false,
      }).cadastrar();

      CadastroUsuarioPage.elements
        .mensagemAlerta()
        .should("be.visible")
        .and("contain.text", "Este email já está sendo usado");

      cy.url().should("include", "/cadastrarusuarios");
    });
  });

  it("CT03 - Deve exibir mensagens de validação ao submeter o formulário sem preencher os campos obrigatórios", () => {
    CadastroUsuarioPage.cadastrar();

    CadastroUsuarioPage.elements
      .mensagemAlerta()
      .should("be.visible")
      .and("contain.text", "Nome é obrigatório");
  });
});
