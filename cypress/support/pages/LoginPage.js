/**
 * Page Object referente à tela de Login (/login).
 * Encapsula seletores e ações da página, evitando que os
 * testes conheçam detalhes de implementação da UI.
 */
class LoginPage {
  elements = {
    campoEmail: () => cy.get('[data-testid="email"]'),
    campoSenha: () => cy.get('[data-testid="senha"]'),
    botaoEntrar: () => cy.get('[data-testid="entrar"]'),
    linkCadastrar: () => cy.get('[data-testid="cadastrar"]'),
    // Confirmado via inspeção real do DOM: <div class="alert alert-secondary
    // alert-dismissible" role="alert"><span>texto</span></div>
    mensagemAlerta: () => cy.get('.alert[role="alert"]'),
  };

  visitar() {
    cy.visit("/login");
    return this;
  }

  preencherEmail(email) {
    this.elements.campoEmail().clear().type(email);
    return this;
  }

  preencherSenha(senha) {
    this.elements.campoSenha().clear().type(senha, { log: false });
    return this;
  }

  clicarEmEntrar() {
    this.elements.botaoEntrar().click();
    return this;
  }

  irParaCadastro() {
    this.elements.linkCadastrar().click();
    return this;
  }

  login(email, senha) {
    this.preencherEmail(email);
    this.preencherSenha(senha);
    this.clicarEmEntrar();
    return this;
  }
}

export default new LoginPage();
