import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    specPattern: 'cypress/e2e/**/*{.js,jsx,ts,tsx}',
    excludeSpecPattern: [
      '**/1-getting-started/**',
      '**/2-advanced-examples/**'
    ]
  },
  defaultCommandTimeout: 5000,
});
