import { faker } from "@faker-js/faker";
import LoginPage from "../../support/pages/LoginPage";

describe("Frontend | Login", () => {
  let usuario;

  before(() => {
    
    usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    };

    cy.apiCriarUsuario(usuario);
  });

  beforeEach(() => {
    LoginPage.visitar();
  });

  it("CT01 - Deve realizar login com sucesso utilizando credenciais válidas", () => {
    LoginPage.login(usuario.email, usuario.password);

    
    cy.url().should("include", "/home");
    cy.title().should("eq", "Front - ServeRest");
  });

  it("CT02 - Não deve permitir login com credenciais inválidas e deve exibir mensagem de erro", () => {
    
    LoginPage.login("usuario.inexistente@gmail.com", "senhaIncorreta123");

    LoginPage.elements
      .mensagemAlerta()
      .should("be.visible")
      .and("contain.text", "Email e/ou senha inválidos");

   
    cy.url().should("include", "/login");
  });

  it("CT03 - Deve exibir mensagens de validação ao tentar logar com campos obrigatórios vazios", () => {
    LoginPage.clicarEmEntrar();

   
    LoginPage.elements
      .mensagemAlerta()
      .should("be.visible")
      .and("contain.text", "Email é obrigatório")
      .and("contain.text", "Password é obrigatório");
  });
});
