import "./commands";

// Ignora apenas ruídos conhecidos e inofensivos do navegador;
// qualquer outro erro da aplicação continua falhando o teste.
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("ResizeObserver loop")) {
    return false;
  }
});
