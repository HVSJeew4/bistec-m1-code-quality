# Month 1 – TDD Commit History

Generated from `git log` by `npm run submission`.
Repository: https://github.com/HVSJeew4/bistec-m1-code-quality

Every bug was fixed with red → green → refactor:

- 🔴 **RED** – `test: failing test for …` commits a test that fails because of the bug (the only
  commits in the history with a failing test).
- 🟢 **GREEN** – `fix: …` makes that test pass with the smallest change; all tests pass.
- 🔵 **REFACTOR** – `refactor: …` cleans up with tests still green (only where useful).

## TDD cycles

| Commit | Phase | Message |
|---|---|---|
| `fa8abe6` | 🔴 RED | test: failing test for Button calling onClick when disabled |
| `12dd4e1` | 🟢 GREEN | fix: pass disabled through to the native Button element |
| `3d750d1` | 🔴 RED | test: failing test for Tabs onChange reporting an off-by-one index |
| `f695ca3` | 🟢 GREEN | fix: report zero-based tab index from Tabs onChange |
| `ee7b503` | 🔴 RED | test: failing test for Toggle never calling onChange |
| `5eaec6a` | 🟢 GREEN | fix: call Toggle onChange so controlled toggles can update |
| `cb6c32e` | 🔴 RED | test: failing test for Dropdown combobox missing an accessible name |
| `96a5974` | 🟢 GREEN | fix: label the Dropdown combobox with aria-labelledby |
| `e270bbe` | 🔴 RED | test: failing test for Dropdown and Tabs crashing when their list is missing |
| `42c8910` | 🟢 GREEN | fix: default Dropdown items and Tabs tabs to an empty list |
| `f6b1e6a` | 🔵 REFACTOR | refactor: make Dropdown items and Tabs tabs optional to match their defaults |
| `2e319de` | 🔴 RED | test: failing test for Modal stealing focus from its fields on re-render |
| `675a81b` | 🟢 GREEN | fix: focus the Modal only when it opens, not on every re-render |
| `5da680b` | 🔴 RED | test: failing test for low colour contrast on danger button and error text |
| `38efd6e` | 🟢 GREEN | fix: darken danger and error reds to meet WCAG AA contrast |

## Full history

| Commit | Date | Message |
|---|---|---|
| `59be68a` | 2026-11-01 | chore: scaffold month 1 |
| `728148c` | 2026-11-01 | docs: add challenge plan |
| `11ec4fa` | 2026-11-01 | chore: add starter component library |
| `aed9546` | 2026-11-01 | chore: set up Jest, Testing Library, Cypress and ESLint |
| `4cfd9e2` | 2026-11-01 | test: add Button unit tests |
| `a1a73a7` | 2026-11-01 | test: add Toggle unit tests |
| `6d6b530` | 2026-11-01 | test: add Alert unit tests |
| `f577edc` | 2026-11-01 | test: add Card unit tests |
| `9274044` | 2026-11-01 | test: add Input unit tests |
| `0c7a319` | 2026-11-01 | test: add Dropdown unit tests |
| `b408542` | 2026-11-01 | test: add Modal unit tests |
| `716a3e7` | 2026-11-01 | test: add Tabs unit tests |
| `cf08821` | 2026-11-01 | docs: update plan and README for Part 2 |
| `fa8abe6` | 2026-11-01 | test: failing test for Button calling onClick when disabled |
| `12dd4e1` | 2026-11-01 | fix: pass disabled through to the native Button element |
| `3d750d1` | 2026-11-01 | test: failing test for Tabs onChange reporting an off-by-one index |
| `f695ca3` | 2026-11-01 | fix: report zero-based tab index from Tabs onChange |
| `ee7b503` | 2026-11-01 | test: failing test for Toggle never calling onChange |
| `5eaec6a` | 2026-11-01 | fix: call Toggle onChange so controlled toggles can update |
| `cb6c32e` | 2026-11-01 | test: failing test for Dropdown combobox missing an accessible name |
| `96a5974` | 2026-11-01 | fix: label the Dropdown combobox with aria-labelledby |
| `e270bbe` | 2026-11-01 | test: failing test for Dropdown and Tabs crashing when their list is missing |
| `42c8910` | 2026-11-01 | fix: default Dropdown items and Tabs tabs to an empty list |
| `f6b1e6a` | 2026-11-01 | refactor: make Dropdown items and Tabs tabs optional to match their defaults |
| `64d1db7` | 2026-11-01 | docs: document Part 3 bug fixes |
| `2e319de` | 2026-11-01 | test: failing test for Modal stealing focus from its fields on re-render |
| `675a81b` | 2026-11-01 | fix: focus the Modal only when it opens, not on every re-render |
| `5da680b` | 2026-11-01 | test: failing test for low colour contrast on danger button and error text |
| `38efd6e` | 2026-11-01 | fix: darken danger and error reds to meet WCAG AA contrast |
| `14ea33d` | 2026-11-01 | test: add integration tests and submission script |
| `02e5fc3` | 2026-11-01 | test: name Modal default-props case to match the required structure |

To reproduce: `git log --oneline`. To see any red step fail: `git checkout <red hash> && npm test`.
