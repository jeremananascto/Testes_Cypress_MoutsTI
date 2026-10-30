import { faker } from "@faker-js/faker";

const apiUrl = Cypress.env("apiUrl");

describe("API | POST /login", () => {
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

  it("CT01 - Deve autenticar com sucesso e retornar token válido para credenciais corretas", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login`,
      body: {
        email: usuario.email,
        password: usuario.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "Login realizado com sucesso");
      expect(response.body).to.have.property("authorization");
      expect(response.body.authorization).to.match(/^Bearer\s.+/);
    });
  });

  it("CT02 - Não deve autenticar com senha incorreta e deve retornar status 401", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login`,
      body: {
        email: usuario.email,
        password: "senhaIncorretaXPTO",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq("Email e/ou senha inválidos");
    });
  });

  it("CT03 - Deve retornar status 400 e mensagens de validação quando email e senha não são informados", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login`,
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eq("email é obrigatório");
      expect(response.body.password).to.eq("password é obrigatório");
    });
  });
});
