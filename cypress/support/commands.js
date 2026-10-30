import LoginPage from "./pages/LoginPage";

const apiUrl = Cypress.env("apiUrl");

/**
 * Cria um usuário via API.
 * @param {Object} usuario - { nome, email, password, administrador }
 * @returns {Cypress.Chainable} response da API
 */
Cypress.Commands.add("apiCriarUsuario", (usuario) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/usuarios`,
    body: usuario,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("apiLogin", (email, password) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/login`,
    body: { email, password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("apiExcluirUsuario", (id) => {
  return cy.request({
    method: "DELETE",
    url: `${apiUrl}/usuarios/${id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("apiCriarProduto", (produto, token) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/produtos`,
    headers: { Authorization: token },
    body: produto,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("apiExcluirProduto", (id, token) => {
  return cy.request({
    method: "DELETE",
    url: `${apiUrl}/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("loginUI", (email, password) => {
  cy.session(
    [email],
    () => {
      LoginPage.visitar().login(email, password);
      cy.url().should("include", "/home");
    },
    {
      validate() {
        cy.window().its("localStorage").invoke("getItem", "serverest/userToken").should("exist");
      },
    }
  );
});
