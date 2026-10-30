class CadastroUsuarioPage {
  elements = {
    campoNome: () => cy.get('[data-testid="nome"]'),
    campoEmail: () => cy.get('[data-testid="email"]'),
    campoPassword: () => cy.get('[data-testid="password"]'),
    checkboxAdministrador: () => cy.get('[data-testid="checkbox"]'),
    botaoCadastrar: () => cy.get('[data-testid="cadastrar"]'),
    
    mensagemAlerta: () => cy.get('.alert[role="alert"]'),
  };

  visitar() {
    cy.visit("/cadastrarusuarios");
    return this;
  }

  preencherFormulario({ nome, email, password, administrador }) {
    this.elements.campoNome().clear().type(nome);
    this.elements.campoEmail().clear().type(email);
    this.elements.campoPassword().clear().type(password, { log: false });
    if (administrador) {
      this.elements.checkboxAdministrador().check({ force: true });
    }
    return this;
  }

  cadastrar() {
    this.elements.botaoCadastrar().click();
    return this;
  }
}

export default new CadastroUsuarioPage();
