import { faker } from "@faker-js/faker";

const apiUrl = Cypress.env("apiUrl");

describe("API | /usuarios", () => {
  it("CT01 - Deve cadastrar um novo usuário com sucesso e retornar status 201", () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    };

    cy.request({
      method: "POST",
      url: `${apiUrl}/usuarios`,
      body: usuario,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq("Cadastro realizado com sucesso");
      expect(response.body).to.have.property("_id").and.not.be.empty;

      
      cy.apiExcluirUsuario(response.body._id);
    });
  });

  it("CT02 - Não deve permitir cadastro de usuário com e-mail já existente e deve retornar status 400", () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    };

    cy.apiCriarUsuario(usuario).then((primeiraResposta) => {
      expect(primeiraResposta.status).to.eq(201);
      const idCriado = primeiraResposta.body._id;


      cy.apiCriarUsuario(usuario).then((segundaResposta) => {
        expect(segundaResposta.status).to.eq(400);
        expect(segundaResposta.body.message).to.eq("Este email já está sendo usado");

        cy.apiExcluirUsuario(idCriado);
      });
    });
  });

  it("CT03 - Deve listar os usuários cadastrados e validar a estrutura da resposta", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/usuarios`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("quantidade");
      expect(response.body.quantidade).to.be.a("number");
      expect(response.body.usuarios).to.be.an("array");

      if (response.body.usuarios.length > 0) {
        const usuario = response.body.usuarios[0];
        expect(usuario).to.have.all.keys(
          "nome",
          "email",
          "password",
          "administrador",
          "_id"
        );
      }
    });
  });

  it("CT04 - Não deve cadastrar usuário com e-mail em formato inválido e deve retornar status 400", () => {
    cy.apiCriarUsuario({
      nome: faker.person.fullName(),
      email: "email-invalido",
      password: faker.internet.password({ length: 12 }),
      administrador: "false",
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("email");
    });
  });
});
