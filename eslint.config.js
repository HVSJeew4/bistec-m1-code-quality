import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import cypress from "eslint-plugin-cypress/flat";

export default tseslint.config(
  { ignores: ["dist", "coverage", "submission", "node_modules"] },

  // App and test source
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Unit / integration tests: flag implementation-detail testing and weak assertions
  {
    files: ["**/*.test.{ts,tsx}"],
    ...testingLibrary.configs["flat/react"],
    languageOptions: { globals: globals.jest },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    ...jestDom.configs["flat/recommended"],
  },

  // Cypress E2E
  {
    files: ["cypress/**/*.ts"],
    ...cypress.configs.recommended,
  },

  // Root config files and Node scripts
  {
    files: ["*.js", "scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },
);
