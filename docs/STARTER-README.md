# Hearts Component Library

A React component library with **8 UI components**, **0% test coverage**, and **5 hidden bugs**.

Your mission: set up testing, write comprehensive tests, find all the bugs, and fix them using TDD.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the component demos.

## Components

| # | Component | Location | Description |
|---|-----------|----------|-------------|
| 1 | Button | `src/components/Button/` | Click handling, variants, disabled, loading |
| 2 | Input | `src/components/Input/` | Text input, validation, error states |
| 3 | Modal | `src/components/Modal/` | Open/close, backdrop click, Escape key |
| 4 | Card | `src/components/Card/` | Layout, image, actions |
| 5 | Dropdown | `src/components/Dropdown/` | Selection, keyboard nav, click-outside |
| 6 | Toggle | `src/components/Toggle/` | On/off state, accessibility |
| 7 | Alert | `src/components/Alert/` | Variants, dismissible |
| 8 | Tabs | `src/components/Tabs/` | Tab switching, controlled/uncontrolled |

## Challenge Tasks

### Part 1: Testing Environment Setup (20 min)
- Configure Jest with `jsdom` test environment
- Set up React Testing Library
- Configure coverage thresholds at 80%
- Create `jest.config.js`, `jest.setup.js`, `cypress.config.js`

### Part 2: Unit Tests (60 min)
- Write tests for all 8 components
- Test rendering, interactions, and edge cases
- Use accessible queries (`getByRole`, `getByLabelText`)

### Part 3: Bug Hunting with TDD (25 min)
- Find 5 hidden bugs through testing
- Fix each using Red-Green-Refactor
- Document each bug fix

### Part 4: Integration & E2E (15 min)
- Write 3 integration tests
- Write 1 Cypress E2E test
- Verify 80%+ coverage

## Deliverables

1. Complete test suite (`.test.tsx` files)
2. Coverage report (80%+ lines, branches, functions)
3. Bug fix documentation (Markdown)
4. TDD commit history (git log showing red-green-refactor)
