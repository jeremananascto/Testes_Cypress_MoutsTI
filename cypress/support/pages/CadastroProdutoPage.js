class CadastroProdutoPage {
  elements = {
    campoNome: () => cy.get('[data-testid="nome"]'),
    campoPreco: () => cy.get('[data-testid="preco"]'),
    campoDescricao: () => cy.get('[data-testid="descricao"]'),
    campoQuantidade: () => cy.get('[data-testid="quantity"]'),
    botaoCadastrar: () => cy.get('[data-testid="cadastarProdutos"]'),
    mensagemAlerta: () => cy.get('.alert[role="alert"]'),
  };

  visitar() {
    cy.visit("/admin/cadastrarprodutos");
    return this;
  }

  preencherFormulario({ nome, preco, descricao, quantidade }) {
    this.elements.campoNome().clear().type(nome);
    this.elements.campoPreco().clear().type(preco);
    this.elements.campoDescricao().clear().type(descricao);
    this.elements.campoQuantidade().clear().type(quantidade);
    return this;
  }

  cadastrar() {
    this.elements.botaoCadastrar().click();
    return this;
  }
}

export default new CadastroProdutoPage();
