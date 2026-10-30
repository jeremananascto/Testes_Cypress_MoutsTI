/**
 * Comandos customizados do Cypress.
 * Centralizam interações repetidas com a API do ServeRest,
 * permitindo que os testes de UI preparem massa de dados
 * de forma rápida e independente da interface (boas práticas
 * de automação: evitar que testes de UI dependam de outros
 * testes de UI para gerar estado).
 */

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

/**
 * Autentica um usuário via API e retorna o token.
 */
Cypress.Commands.add("apiLogin", (email, password) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/login`,
    body: { email, password },
    failOnStatusCode: false,
  });
});

/**
 * Remove um usuário via API (rotina de limpeza/teardown).
 */
Cypress.Commands.add("apiExcluirUsuario", (id) => {
  return cy.request({
    method: "DELETE",
    url: `${apiUrl}/usuarios/${id}`,
    failOnStatusCode: false,
  });
});

/**
 * Cadastra um produto via API, autenticado como administrador.
 */
Cypress.Commands.add("apiCriarProduto", (produto, token) => {
  return cy.request({
    method: "POST",
    url: `${apiUrl}/produtos`,
    headers: { Authorization: token },
    body: produto,
    failOnStatusCode: false,
  });
});

/**
 * Remove um produto via API (rotina de limpeza/teardown).
 */
Cypress.Commands.add("apiExcluirProduto", (id, token) => {
  return cy.request({
    method: "DELETE",
    url: `${apiUrl}/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

/**
 * Login pela UI com cache de sessão (cy.session): o login real roda
 * uma única vez por usuário e é restaurado nos testes seguintes.
 */
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
