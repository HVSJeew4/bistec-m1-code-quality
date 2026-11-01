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
| `npm run submission` | Rebuild the 4 deliverables in `submission/` (run after committing) |

Running Cypress from a process started by a VS Code extension can fail with
`Cypress.exe: bad option: --smoke-test`, because VS Code sets `ELECTRON_RUN_AS_NODE=1`. Use a normal
terminal, or clear the variable first (`env -u ELECTRON_RUN_AS_NODE npm run cypress:run` in Git Bash).

## Project Structure

```
src/components/<Name>/<Name>.tsx       # the 8 library components
src/components/<Name>/<Name>.test.tsx  # unit tests (rendering / interactions / edge cases)
src/App.tsx, src/main.tsx              # demo app (used by integration tests and Cypress)
tests/setup.test.tsx                   # smoke test for the test environment
tests/integration/                     # 3 integration test files (components working together)
cypress/e2e/component-demo.cy.ts       # E2E user journey + accessibility check
scripts/make-submission.mjs            # builds the submission/ deliverables
submission/                            # the 4 subhash-jeewantha-month1-* files
docs/                                  # challenge, rubric, plan, bug fixes
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
- **Tests query by role and label, and interact through `user-event`.** They check what a user sees and
  does, not component internals, and they double as accessibility checks. No snapshot tests.
- **Integration tests use small realistic parents** (a sign-up form, a profile page with an edit modal)
  built only from library components, plus the real demo `App`. `console.log` in the demo is mocked so
  tabs can be asserted without noise.
- **Accessibility is checked twice.** `jest-axe` runs on each component in jsdom. `cypress-axe` runs on
  the real page, where it can also measure colour contrast, which jsdom cannot.
- **Submission files are generated, not hand-made.** `npm run submission` builds the zip with
  `git archive` (exactly the committed files), inlines the coverage report into one HTML file, and
  writes the TDD log from `git log`, so they always match the repo.

## Challenge Coverage

- [x] Part 1 – Testing environment setup
- [x] Part 2 – Unit test suite (all 8 components)
- [x] Part 3 – Bug discovery & TDD fixes: 5 bugs, documented in [docs/BUG-FIXES.md](docs/BUG-FIXES.md)
- [x] Part 4 – 3 integration test files (11 tests) and 1 Cypress E2E spec (2 tests); 2 more bugs found
      and fixed with TDD

Current status: 107 Jest tests + 2 Cypress tests, 100% statements / branches / functions / lines on
`src/components/`. 7 bugs fixed with TDD.

## TDD Process

Each bug has its own commits: `test: failing test for …` (red, the only commits with a failing test),
then `fix: …` (green), then `refactor: …` where useful. See `git log --oneline` and the commit table in
[docs/BUG-FIXES.md](docs/BUG-FIXES.md).

## Known Limitations

Found while testing but not fixed (details in
[docs/BUG-FIXES.md](docs/BUG-FIXES.md#other-findings-not-fixed)):

- `Input` without a `label` does not link its error message (`aria-describedby="undefined-error"`).
- `Dropdown` has no arrow-key navigation between options.
- `Modal` does not trap focus or restore it on close.
- `Alert` is not announced by screen readers (no `role="alert"` / `status`).
- `Button` has no `type`, so it submits forms by default.
- The starter has no Alert icons and no controlled mode for Tabs, so those brief items are not tested.
- E2E tests need the dev server started manually before running Cypress.
