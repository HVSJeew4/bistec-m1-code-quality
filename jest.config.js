/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // ts-jest compiles TS/TSX (and jest.setup.js) using the Jest-specific tsconfig.
  transform: {
    "^.+\\.[jt]sx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
  // Components import plain CSS; Jest cannot parse it, so map it to a stub.
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/tests/**/*.test.{ts,tsx}",
  ],

  // Coverage is measured on the component library only. App.tsx / main.tsx are
  // the demo harness used by Cypress, not shipped library code.
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "!src/components/**/*.test.{ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
    },
  },
  coverageReporters: ["text", "html", "lcov"],
};
