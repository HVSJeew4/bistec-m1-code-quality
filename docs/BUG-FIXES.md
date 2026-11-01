# Month 1 – Bug Fixes

The five hinted bugs in the Hearts Component Library starter, plus two more found by the Part 4
integration and E2E tests. Each was found by a test and fixed with TDD (red → green → refactor).
Line numbers refer to the original starter code (commit `11ec4fa chore: add starter component library`).

| # | Bug | Hint category | Red | Green | Refactor |
|---|---|---|---|---|---|
| 1 | Button calls `onClick` when disabled | Event handler (disabled state) | `fa8abe6` | `12dd4e1` | – |
| 2 | Tabs `onChange` reports an off-by-one index | Off-by-one in pagination | `3d750d1` | `f695ca3` | – |
| 3 | Toggle never calls `onChange` | Event handler not called / state not updating | `ee7b503` | `5eaec6a` | – |
| 4 | Dropdown combobox has no accessible name | Accessibility issue | `cb6c32e` | `96a5974` | – |
| 5 | Dropdown and Tabs crash when their list is missing | Missing null check causing crash | `e270bbe` | `42c8910` | `f6b1e6a` |
| 6 | Modal steals focus from its fields on every re-render | Extra – found by integration test | `2e319de` | `675a81b` | – |
| 7 | Danger button and error text fail colour contrast | Extra – found by Cypress + axe | `5da680b` | `38efd6e` | – |

## Bug #1: Button calls onClick when disabled

- **Location:** `src/components/Button/Button.tsx:21-24` (the `<button>` element; `onClick` on line 23)
- **Symptom:** A `<Button disabled>` looks disabled (grey `btn-disabled` style) but clicking it or
  pressing Enter still runs `onClick`, e.g. submitting a form twice. Screen readers announce it as an
  active button.
- **Root Cause:** The `disabled` prop was only used to build the CSS class. It was never passed to the
  native `<button>` element, so the browser did not know the button was disabled.
- **Test Written:** `Button › edge cases › is exposed as disabled when the disabled prop is set`
  (`toBeDisabled()`) and `does not call onClick when disabled` (user clicks; `onClick` must not be
  called). Red: "Received element is not disabled" and "Received number of calls: 1".
- **Fix Applied:** Added `disabled={disabled}` to the `<button>`. A native disabled button blocks mouse
  and keyboard activation and is reported as disabled to assistive technology, so no extra guard in
  the click handler is needed.

## Bug #2: Tabs onChange reports an off-by-one index

- **Location:** `src/components/Tabs/Tabs.tsx:19`
- **Symptom:** Clicking the second tab calls `onChange(2)` instead of `onChange(1)`. A parent that stores
  the index, or passes it back as `defaultIndex`, ends up one tab too far, or past the last tab.
- **Root Cause:** `handleTabClick` called `onChange?.(index + 1)`, converting the zero-based index to a
  one-based "page number", while `defaultIndex` and the internal state are zero-based.
- **Test Written:** `Tabs › interactions › calls onChange with the zero-based index of the clicked tab`
  and `reports the same index it uses for defaultIndex, so the two can round-trip`.
  Red: "Expected: 1, Received: 2" and "Expected: "Pricing", Received: undefined".
- **Fix Applied:** Changed the call to `onChange?.(index)`, so the reported index matches `defaultIndex`
  and the tabs array.

## Bug #3: Toggle never calls onChange

- **Location:** `src/components/Toggle/Toggle.tsx:12` (`onChange` destructured but unused) and `:22`
  (`handleClick` only updates internal state)
- **Symptom:** A parent never hears about changes. A controlled toggle
  (`checked={value} onChange={setValue}`), as used by "Dark mode" in the demo app, never switches.
- **Root Cause:** `handleClick` only called `setInternalChecked`. In controlled mode the displayed value
  comes from the `checked` prop, which the parent never updates because `onChange` is never called.
  ESLint's `no-unused-vars` had already flagged `onChange` in Part 1.
- **Test Written:** `Toggle › interactions › calls onChange with the new checked state` and
  `switches when controlled by a parent that stores the new state`. A guard test,
  `stays unchanged when controlled by a parent that ignores the change`, makes sure the fix respects
  controlled mode. Red: "Received number of calls: 0" and "Received element is not checked".
- **Fix Applied:** `handleClick` now computes `next = !isChecked`, updates internal state only when
  uncontrolled (`checked` is `undefined`), and calls `onChange?.(next)`. Removed the temporary
  `eslint-disable` comment.

## Bug #4: Dropdown combobox has no accessible name

- **Location:** `src/components/Dropdown/Dropdown.tsx:56` (label `<span>`) and `:57-64` (the
  `role="combobox"` trigger)
- **Symptom:** With `label="Framework"`, the label is shown on screen but a screen reader announces only
  "combobox" with no name. axe reports `aria-input-field-name: ARIA input fields must have an
  accessible name`.
- **Root Cause:** The label was a plain `<span>` with no id, and the combobox had no `aria-label` or
  `aria-labelledby`, so nothing connected the two.
- **Test Written:** `Dropdown › edge cases › uses its label as the combobox's accessible name`
  (`getByRole("combobox", { name: "Framework" })`) and
  `has no detectable accessibility violations when labelled` (jest-axe).
  Red: "Unable to find an accessible element with the role "combobox" and name "Framework"" and the
  axe violation above.
- **Fix Applied:** Generated a unique id with React's `useId()`, set it on the label `<span>`, and added
  `aria-labelledby={label ? labelId : undefined}` to the combobox. `useId` stays unique when several
  dropdowns share a page.

## Bug #5: Dropdown and Tabs crash when their list is missing

- **Location:** `src/components/Dropdown/Dropdown.tsx:26` (`items.find`) and `:70` (`items.map`);
  `src/components/Tabs/Tabs.tsx:25` (`tabs.map`)
- **Symptom:** Rendering `<Dropdown items={undefined} />` or `<Tabs tabs={undefined} />`, for example
  while data is still loading from an API, crashes the whole React tree with
  `TypeError: Cannot read properties of undefined (reading 'find' / 'map')`.
- **Root Cause:** Both components called array methods on the prop without checking it exists.
  TypeScript marked the prop as required, but that only protects typed callers at compile time, not
  runtime data.
- **Test Written:** `Dropdown › edge cases › renders the placeholder instead of crashing when items is
  missing` and `Tabs › edge cases › renders an empty tab list instead of crashing when tabs is missing`.
  Red: the `TypeError`s above.
- **Fix Applied:** Default parameters `items = []` and `tabs = []`. **Refactor:** made both props
  optional in their TypeScript interfaces to match the new default, which removed the
  `undefined as unknown as []` cast from the tests.

## Bug #6: Modal steals focus from its fields on every re-render

- **Location:** `src/components/Modal/Modal.tsx:13-24` (the `useEffect` that both focuses the dialog
  and registers the Escape listener; `focus()` on line 20)
- **Symptom:** In a modal containing a form, the user can type only one character. After the first
  keystroke, focus jumps from the input back to the dialog, so the rest of the typing is lost. The
  demo app hides this because its modal has no input.
- **Root Cause:** One effect did two jobs with dependencies `[isOpen, onClose]`. Parents usually pass
  an inline `onClose={() => setOpen(false)}`, which is a new function on every render. Each keystroke
  re-renders the parent, the effect re-runs, and `modalRef.current.focus()` moves focus to the dialog.
- **Test Written:** `Modal › edge cases › keeps focus on a field inside the dialog when the parent
  re-renders` (unit) and the `Modal with a form inside` integration tests (save, Enter to submit).
  Red: "Expected element with focus: <input …> Received element with focus: <div role="dialog" …>".
- **Fix Applied:** Split the effect. Focusing the dialog now depends only on `[isOpen]`, so it runs once
  when the modal opens. The Escape listener keeps `[isOpen, onClose]` so it always calls the latest
  handler.

## Bug #7: Danger button and error text fail colour contrast

- **Location:** `src/styles.css:96` (`.btn-danger` background) and `:154` (`.input-error-text` color)
- **Symptom:** White text on the danger button and red error text on white have a contrast ratio of
  3.76:1. WCAG AA needs 4.5:1 for normal-size text, so users with low vision may not be able to read
  them.
- **Root Cause:** Both used Tailwind red-500 `#ef4444`, which is too light for text at this size. jsdom
  does no real rendering, so `jest-axe` cannot measure contrast; only a real browser can.
- **Test Written:** Cypress `Component demo page › has no detectable accessibility violations on load`
  (`cy.checkA11y()`). Red: axe `color-contrast` on `.btn-danger` and `#input-email-error`. The disabled
  toggle is excluded because WCAG 1.4.3 exempts inactive controls.
- **Fix Applied:** Changed both colours to red-600 `#dc2626` (4.83:1). The danger button's hover, which
  already used `#dc2626`, moved one shade darker to `#b91c1c` so it stays visibly different.

## Other findings (not fixed)

Found while testing, outside the 5 hinted bugs. Listed in the README under Known Limitations:

- `Input` without a `label` but with an `error` renders `aria-describedby="undefined-error"`, so the
  error is not linked (axe: `label-title-only`).
- `Dropdown` has no arrow-key navigation between options.
- `Modal` does not trap focus inside the dialog, and does not return focus on close.
- `Alert` has no `role="alert"` / `role="status"`, so screen readers do not announce it.
- `Button` has no `type`, so inside a `<form>` it defaults to `type="submit"`.
