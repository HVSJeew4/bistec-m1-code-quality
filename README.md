# Month 1 – Code Quality & Testing

## Overview

BISTEC Academy Engineer Track, Month 1. The "Hearts Component Library" is a React component
library with 8 UI components, 0% test coverage and 5 hidden bugs. This repo adds a Jest + React
Testing Library + Cypress test setup, a unit test suite, TDD bug fixes, and integration / E2E tests.

The starter code comes unchanged from the `Initial commit` of
[HVSJeew4/Month-1-Challenge](https://github.com/HVSJeew4/Month-1-Challenge) (see commit
`chore: add starter component library`). The original starter README is kept in
[docs/STARTER-README.md](docs/STARTER-README.md).

## Tech Stack

- React 18, TypeScript 5.6 (strict), Vite 6 (demo app)
- Jest 29 + `ts-jest`, `jest-environment-jsdom`
- React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`
- `jest-axe` / `cypress-axe` for accessibility checks
- Cypress 13 for E2E tests
- ESLint 9 with `typescript-eslint`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`

## Getting Started

Prerequisites: Node 22, npm 10.

```bash
npm install
npm run dev        # demo app on http://localhost:5173
```

No environment variables are needed.

## Running Tests

| Command | What it does |
|---|---|
| `npm test` | Run all unit and integration tests |
| `npm run test:watch` | Re-run tests on file change |
| `npm run test:coverage` | Run tests with coverage; fails below 80% lines / functions / branches. HTML report in `coverage/lcov-report/index.html` |
| `npm run lint` | ESLint over source, tests and config |
| `npm run build` | Type-check (`tsc -b`) and build the demo app |
| `npm run cypress:open` / `npm run cypress:run` | E2E tests (start `npm run dev` first, in another terminal) |

## Project Structure

```
src/components/<Name>/<Name>.tsx   # the 8 library components
src/App.tsx, src/main.tsx          # demo app (used by Cypress)
tests/                             # setup smoke test, integration tests
cypress/                           # E2E specs and support files
docs/                              # challenge, rubric, plan, bug fixes
jest.config.js, jest.setup.js, cypress.config.js
```

## Design Decisions

- **`ts-jest` with a separate `tsconfig.jest.json`.** The app's `tsconfig.json` is set up for Vite
  (`moduleResolution: bundler`, ES modules). Jest 29 runs CommonJS, so the Jest config extends the
  app config and only switches the module settings.
- **Config files are `.js` with `export default`.** The brief requires these exact file names, and
  `package.json` has `"type": "module"`, so Node loads them as ES modules.
- **Coverage measures `src/components/` only.** The library is the product under test; `App.tsx` and
  `main.tsx` are the demo harness for Cypress.
- **CSS imports are mapped to `identity-obj-proxy`.** Jest cannot parse CSS, and tests check behaviour,
  not styles.
- **Test types are listed in `tsconfig.json`** (`jest`, `@testing-library/jest-dom`, `jest-axe`) so the
  editor and `tsc -b` both understand the test files. Cypress has its own `cypress/tsconfig.json` so
  Cypress's `expect` (Chai) does not clash with Jest's.

## Challenge Coverage

- [x] Part 1 – Testing environment setup
- [x] Part 2 – Unit test suite (all 8 components)
- [x] Part 3 – Bug discovery & TDD fixes: 5 bugs, documented in [docs/BUG-FIXES.md](docs/BUG-FIXES.md)
- [ ] Part 4 – Integration & E2E tests

Current status: 95 tests, 100% statements / branches / functions / lines on `src/components/`.

## TDD Process

Each bug has its own commits: `test: failing test for …` (red, the only commits with a failing test),
then `fix: …` (green), then `refactor: …` where useful. See `git log --oneline` and the commit table in
[docs/BUG-FIXES.md](docs/BUG-FIXES.md).

## Known Limitations

Found while testing but outside the 5 hinted bugs, so not fixed (details in
[docs/BUG-FIXES.md](docs/BUG-FIXES.md#other-findings-not-fixed)):

- `Input` without a `label` does not link its error message (`aria-describedby="undefined-error"`).
- `Dropdown` has no arrow-key navigation between options.
- `Modal` does not trap focus or restore it on close.
- `Alert` is not announced by screen readers (no `role="alert"` / `status`).
- `Button` has no `type`, so it submits forms by default.
- The starter has no Alert icons and no controlled mode for Tabs, so those brief items are not tested.
- E2E tests need the dev server started manually before running Cypress.
