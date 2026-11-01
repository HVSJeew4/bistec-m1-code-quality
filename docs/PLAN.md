# Month 1 Plan – Code Quality & Testing

> Status: **Approved** (2026-11-01). Ready for Part 1.

## 1. Summary

We have joined a team that owns the "Hearts Component Library", a React 18 + TypeScript library
with 8 UI components and no tests at all. The code contains 5 hidden bugs. The job is to set up
Jest, React Testing Library and Cypress, then write a unit test suite for all 8 components that
reaches at least 80% coverage of lines, functions and branches. The 5 bugs must be found and fixed
with TDD (red → green → refactor), and the git history has to show that process. We finish with at
least 3 integration tests and 1 Cypress end-to-end test, document every bug, and package 4
deliverable files for submission.

## 2. Tech stack

**Source of the starter code:** the `Initial commit` (`96b03d2`) of
<https://github.com/HVSJeew4/Month-1-Challenge>, folder `challenge/`. That commit is the untouched
starter. The later commits in that repo already patched some bugs **without** failing tests first,
so they cannot serve as TDD evidence and are not imported. The old test files are only a reference;
the tests are rewritten here to match the required describe structure.

**Fixed by the starter / brief:**
- React 18.3, TypeScript 5.6 (`strict`), Vite 6 (demo app on `http://localhost:5173`), `"type": "module"`
- Jest, React Testing Library, Cypress
- Config file names `jest.config.js`, `jest.setup.js`, `cypress.config.js`

**Open choices (proposed):**

| Choice | Proposal | Reason | Status |
|---|---|---|---|
| Package manager / runtime | npm 10, Node 22 (already installed) | Nothing extra to install | Approved |
| TypeScript in Jest | `ts-jest` with a small `tsconfig.jest.json` | `tsconfig.json` uses Vite's `moduleResolution: bundler` / `noEmit`, which Jest can't use directly | Approved |
| Jest environment | `jest-environment-jsdom` | Required for `testEnvironment: 'jsdom'` in Jest 29 | Required |
| Interaction library | `@testing-library/user-event` v14 | Simulates real user behaviour (rubric: "test user interactions") | Approved |
| Matchers | `@testing-library/jest-dom` (loaded in `jest.setup.js`) | `toBeDisabled`, `toHaveAccessibleName`, etc. | Required |
| Accessibility checks | `jest-axe` (unit) + `cypress-axe` (E2E) | Brief asks to "check accessibility"; rubric lists missing a11y tests as a common mistake | Approved |
| Lint | ESLint + `eslint-plugin-testing-library` + `eslint-plugin-jest-dom` | Flags implementation-detail testing (Code Quality, Test Quality) | Approved |
| CSS imports in Jest | `moduleNameMapper` → `identity-obj-proxy` | `App.tsx` / `main.tsx` import `styles.css` | Required for integration tests |

## 3. Submission checklist

Naming convention: `[participant-name]-month1-[deliverable]` (e.g. `john-doe-month1-test-suite.zip`).

Required files:
- [ ] `subhash-jeewantha-month1-test-suite.zip` – all test files
- [ ] `subhash-jeewantha-month1-coverage-report.html` – coverage report
- [ ] `subhash-jeewantha-month1-bug-fixes.md` – bug documentation
- [ ] `subhash-jeewantha-month1-tdd-commits.md` – git log showing the TDD process

Setup files (Part 1):
- [ ] `jest.config.js` – `testEnvironment: 'jsdom'`, `setupFilesAfterEnv`, coverage threshold
      80% for lines, functions, branches, `collectCoverageFrom` patterns
- [ ] `jest.setup.js` – Testing Library setup
- [ ] `cypress.config.js` – Cypress configuration

Code requirements:
- [ ] Every component test file follows the minimum structure:
      `describe('ComponentName')` → `describe('rendering')` (default props + custom props),
      `describe('interactions')`, `describe('edge cases')`
- [ ] Tests for all 8 components: Button, Input, Modal, Card, Dropdown, Toggle, Alert, Tabs
- [ ] Descriptive test names, AAA pattern, external dependencies mocked, user interactions tested
      (not implementation), edge cases covered
- [ ] 5 bugs fixed via TDD, each documented in the `## Bug #N: [Title]` format
- [ ] ≥ 3 integration tests, ≥ 1 Cypress E2E test
- [ ] Coverage ≥ 80% lines, functions, branches (enforced by the Jest threshold)

Repo layout (starter files at the repo root, not in a `challenge/` subfolder):

```
src/components/<Name>/<Name>.tsx         # starter, unchanged until Part 3
src/components/<Name>/<Name>.test.tsx    # Part 2
src/App.tsx  src/main.tsx  src/styles.css  index.html   # starter demo app
tests/integration/*.test.tsx             # Part 4
cypress/e2e/*.cy.ts                      # Part 4
docs/BUG-FIXES.md                        # source for subhash-jeewantha-month1-bug-fixes.md
submission/                              # the 4 deliverables (committed)
jest.config.js  jest.setup.js  cypress.config.js  vite.config.ts  tsconfig.json
```

## 4. Part-by-part plan

### Part 1 – Testing Environment Setup (20 min)

Rubric: Test Coverage (threshold enforcement), Code Quality

- [x] Import the starter from `96b03d2:challenge/` (no `__MACOSX` files), check that
      `npm run build` works, and commit **unchanged** as `chore: add starter component library`
- [x] Add test dev dependencies and scripts (`test`, `test:coverage`, `lint`, `cypress:open`, `cypress:run`)
- [x] `jest.config.js` (ESM `export default`, because the package is `"type": "module"`) with all four required settings;
      `collectCoverageFrom: ['src/components/**/*.{ts,tsx}', '!src/components/**/*.test.{ts,tsx}']`
      (library code only; `App.tsx` / `main.tsx` are the demo harness)
- [x] `jest.setup.js` importing `@testing-library/jest-dom` (and `jest-axe`)
- [x] `cypress.config.js` with `baseUrl: 'http://localhost:5173'` (+ `cypress/support/e2e.ts` loading `cypress-axe`)
- [x] ESLint config (`eslint.config.js`, flat config)
- [x] One smoke test (`tests/setup.test.tsx`) to prove the setup runs; `npm test`, `npm run lint`, `npm run build` pass
- [x] Update `.gitignore` (`cypress/videos`, `cypress/screenshots`, `cypress/downloads`) and README
      Getting Started / Running Tests

Files: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.jest.json`, `jest.config.js`,
`jest.setup.js`, `cypress.config.js`, `cypress/support/e2e.ts`, `cypress/tsconfig.json`,
`eslint.config.js`, `tests/setup.test.tsx`, `.gitignore`, `README.md`

Notes:
- Lint flagged the unused `onChange` in `Toggle.tsx` (bug candidate #3). A single explained
  `eslint-disable-next-line` keeps lint green without changing behaviour; the Part 3 fix removes it.
- `npm run test:coverage` fails the 80% threshold until Part 2/3 tests exist. This is expected.
- The Cypress config is only exercised once the first E2E spec exists (Part 4).

### Part 2 – Unit Test Suite (60 min)

Rubric: Test Coverage, Test Quality, Code Quality

Order follows the rubric tip (simple first). Every file uses the required describe structure,
role/label queries over `data-testid`, `user-event` for interactions, fake timers where needed.
**Behaviour that turns out to be broken is not tested or fixed here.** It is written down as a bug
candidate and saved for a Part 3 red test, so Part 2 commits are always green and the TDD history
stays clean.

- [x] Button – renders text, handles click (mouse + keyboard), loading state, variant, custom className
      (disabled → Part 3, Bug candidate 1)
- [x] Toggle – on/off state, keyboard (Enter/Space), `role="switch"` / `aria-checked`, disabled
      (`onChange` / controlled mode → Part 3, candidate 3)
- [x] Alert – variants, dismissible (callback fires, alert removed), not dismissible by default
- [x] Card – title, body, image present/missing/decorative, actions, custom className
- [x] Input – placeholder, value change, error message (`role="alert"`, `aria-invalid`, description),
      required, focus/blur, types (no label + error → Part 3, candidate 4)
- [x] Dropdown – open/select, click outside closes, Escape, keyboard open, placeholder vs selected label
      (accessible name, arrow keys, missing `items` → Part 3, candidates 4/5)
- [x] Modal – closed renders nothing, open, backdrop click, Escape, close button, focus on open
      (focus trap → Part 3 candidate)
- [x] Tabs – switching, default index, `aria-selected`, panel content, empty / out-of-range
      (`onChange` argument → Part 3, candidate 2)
- [x] Run coverage and close gaps: **100% lines/functions, 98.7% branches** (84 tests); the only
      uncovered branch is Button `disabled`, the Bug 1 path
- [x] One commit per component (`test: add Button unit tests`, …)

Files: `src/components/*/*.test.tsx`

Notes:
- `axe` checks are in every suite except Dropdown, which fails axe today (candidate 4).
- Three explained `eslint-disable testing-library/no-node-access` lines: Modal backdrop, Alert variant
  class, Card className. These elements have no role or label to query by.
- No fake timers were needed: none of the components use timers.

### Part 3 – Bug Discovery & TDD Fix (25 min)

Rubric: TDD Process, Bug Fixes, Documentation

Per bug, separate commits so the red-green-refactor sequence shows in the history:
1. `test: failing test for <bug>` – red (the only commit allowed to have a failing test)
2. `fix: <bug>` – green, all tests pass
3. `refactor: <cleanup>` – only if there is something to clean up

Candidates from reading the code and Part 2 probing. **Each one is only confirmed once a red test fails:**

| # | Hint category | Candidate | Evidence so far | Location |
|---|---|---|---|---|
| 1 | Event handler / disabled bug | `disabled` never reaches the `<button>`, so `onClick` fires when disabled | Rubric starter snippet; only uncovered branch | `Button.tsx` |
| 2 | Off-by-one in pagination | `onChange(index + 1)` reports the wrong tab index | Code reading | `Tabs.tsx` |
| 3 | Event handler not called / state not updating | `onChange` never called, so a controlled Toggle never changes | ESLint `no-unused-vars` | `Toggle.tsx` |
| 4 | Accessibility issue | Dropdown combobox has no accessible name, even with `label` | axe: `aria-input-field-name` | `Dropdown.tsx` |
| 5 | Missing null check causing crash | `items` / `tabs` undefined → `TypeError` (`reading 'find'` / `reading 'map'`) | Probe render crashed | `Dropdown.tsx`, `Tabs.tsx` |

Other findings (fix if time allows, otherwise list in Known Limitations): Input without a label but
with an error (`aria-describedby="undefined-error"`, axe `label-title-only`); no Dropdown arrow-key
navigation; no Modal focus trap; Alert has no `role="alert"` / `status`.

- [ ] Bug #1 … Bug #5: red → green → (refactor), one documented entry each
- [ ] `docs/BUG-FIXES.md` in the exact format (Location, Symptom, Root Cause, Test Written, Fix Applied)
- [ ] Coverage threshold passes with all tests green

Files: affected `src/components/*/*.tsx` and `*.test.tsx`, `docs/BUG-FIXES.md`

### Part 4 – Integration & E2E Tests (15 min)

Rubric: Test Quality, Test Coverage

- [ ] Integration 1 – form flow: Input + Button submit (validation error → valid submit)
- [ ] Integration 2 – Modal containing a form (open → fill → submit → modal closes)
- [ ] Integration 3 – Dropdown selection affecting another component (using the starter `App`)
- [ ] Cypress E2E – visit demo → use several components → assert state changes → `cy.checkA11y()`
- [ ] Generate the 4 submission files:
  - [ ] `subhash-jeewantha-month1-test-suite.zip` (all `*.test.tsx`, `cypress/e2e`, config files)
  - [ ] `subhash-jeewantha-month1-coverage-report.html` (from `coverage/lcov-report/index.html`)
  - [ ] `subhash-jeewantha-month1-bug-fixes.md` (copy of `docs/BUG-FIXES.md`)
  - [ ] `subhash-jeewantha-month1-tdd-commits.md` (`git log` of Part 3, annotated red/green/refactor)
- [ ] README complete: design decisions, coverage numbers, known limitations

Files: `tests/integration/*.test.tsx`, `cypress/e2e/*.cy.ts`, `cypress/support/*`, `submission/*`, `README.md`

## 5. Rubric map

| Criterion (points) | Evidence in the repo | Tasks |
|---|---|---|
| Test Coverage (25) | `coverageThreshold` 80% in `jest.config.js`; `subhash-jeewantha-month1-coverage-report.html` | P1 config, P2 all components, P3 bug-path tests, P4 integration |
| Test Quality (25) | `src/components/*/*.test.tsx`, `tests/integration/`: descriptive names, AAA, role/label queries, `user-event` | P2, P4 |
| TDD Process (20) | Git history `test:` (red) → `fix:` (green) → `refactor:` per bug; `subhash-jeewantha-month1-tdd-commits.md` | P3 |
| Bug Fixes (15) | 5 fixes in `src/components/`, each with a regression test | P3 |
| Code Quality (10) | ESLint (testing-library rules) passing; small shared helpers; no snapshot-everything | P1 lint, P2–P4 |
| Documentation (5) | `docs/BUG-FIXES.md` / `subhash-jeewantha-month1-bug-fixes.md`; README | P3, P4 |

## 6. Risks and questions

**Decisions (2026-11-01):**
1. **Participant name** – `subhash-jeewantha`.
2. **Deliverables** – the 4 files are committed in `submission/`.
3. **Tech stack** – all proposed choices in section 2 approved.
4. **Starting point** – import the untouched `Initial commit` (`96b03d2`) versions with the bugs and
   redo the tests and fixes with TDD.

**Ambiguities / risks:**
- **Bug #5 is not yet identified.** The "missing null check" bug is not obvious from reading the code;
  edge-case tests in Part 2 should reveal it. If several candidates turn up, we pick the 5 that best
  match the hint categories and list any extras in Known Limitations.
- **Config file names** – the brief requires `.js`. Because the package is `"type": "module"`, these
  files use ESM `export default` (the old attempt used `jest.config.cjs`, which doesn't match the name).
- **Coverage while bugs exist** – some branches may only be reachable once a bug is fixed, so the 80%
  threshold may fail at the end of Part 2. It must pass by the end of Part 3.
- **Cypress needs the dev server running** – E2E runs against `npm run dev`; we document this in the
  README rather than adding a server-start helper unless you want one.
- **`coverage/` is gitignored** – the HTML report is copied to `submission/` instead of committing the
  whole folder.
