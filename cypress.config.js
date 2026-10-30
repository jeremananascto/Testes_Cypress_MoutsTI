const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  retries: { runMode: 1, openMode: 0 },
  viewportWidth: 1366,
  viewportHeight: 768,
  video: false,
  screenshotOnRunFailure: true,

  e2e: {
    // Sobrescrevíveis via CYPRESS_BASE_URL / CYPRESS_apiUrl (ver .env.example)
    baseUrl: "https://front.serverest.dev",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    env: {
      apiUrl: "https://serverest.dev",
    },
  },
});
