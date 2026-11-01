import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // The Vite demo app (npm run dev) must be running before Cypress starts.
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
  },
  video: false,
});
