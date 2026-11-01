# Month 1 Challenge
Challenge Brief¶
Role: You are a developer joining a team with an untested codebase Time: 4 hours (in-session) + ongoing offline work Deliverables: 4 artifacts

Context¶
Project Profile¶

Project: React Component Library
Components: 8 UI components
Test Coverage: 0% (no tests exist)
Known Issues: 5 intentional bugs hidden in code
Tech Stack: React 18, TypeScript, Jest, Cypress
Component List¶

1. Button - Click handling, variants, disabled state
2. Input - Text input, validation, error states
3. Modal - Open/close, backdrop, focus trap
4. Card - Layout, image handling, actions
5. Dropdown - Selection, keyboard navigation
6. Toggle - On/off state, accessibility
7. Alert - Variants, dismissible, icons
8. Tabs - Tab switching, controlled/uncontrolled
Current Pain Points¶
No test coverage means bugs reach production
Developers afraid to refactor
No confidence in releases
Manual testing is time-consuming
Hidden bugs causing customer issues
Challenge Tasks¶
Part 1: Testing Environment Setup (20 min)¶
Configure Jest + React Testing Library:


// jest.config.js requirements:
- testEnvironment: 'jsdom'
- setupFilesAfterEnv for testing-library
- Coverage thresholds: 80% (lines, functions, branches)
- collectCoverageFrom patterns
Expected Setup Files: 1. jest.config.js - Jest configuration 2. jest.setup.js - Testing library setup 3. cypress.config.js - Cypress configuration

Part 2: Unit Test Suite (60 min)¶
Write tests for all 8 components:

Button Component Tests:


// Test cases to cover:
- Renders with correct text
- Handles click events
- Shows loading state
- Respects disabled prop
- Applies variant styles
- Supports custom className
Input Component Tests:


// Test cases to cover:
- Renders with placeholder
- Updates value on change
- Shows error message
- Validates required field
- Handles focus/blur
- Supports different types
Continue for all 8 components...

Test Quality Requirements: - Descriptive test names - AAA pattern (Arrange, Act, Assert) - Mock external dependencies - Test user interactions, not implementation - Edge cases covered

Part 3: Bug Discovery & TDD Fix (25 min)¶
Find and fix 5 hidden bugs using TDD:

TDD Process: 1. Red: Write a failing test that exposes the bug 2. Green: Fix the code to make the test pass 3. Refactor: Clean up if needed

Bug Categories (hints): - Off-by-one error in pagination - Missing null check causing crash - Event handler not called - State not updating correctly - Accessibility issue

Documentation Required:


## Bug #1: [Title]
- **Location:** [file:line]
- **Symptom:** [What goes wrong]
- **Root Cause:** [Why it happens]
- **Test Written:** [Test description]
- **Fix Applied:** [Solution]
Part 4: Integration & E2E Tests (15 min)¶
Integration Tests (3 minimum):


// Example: Form with multiple components
- Test form submission flow
- Test modal with form inside
- Test dropdown affecting other components
Cypress E2E Test (1 minimum):


// Example: Complete user flow
- Navigate to component demo
- Interact with multiple components
- Verify state changes
- Check accessibility
Submission Requirements¶
File Naming Convention¶

[participant-name]-month1-[deliverable].md
Example: john-doe-month1-test-suite.zip
Required Files¶
[name]-month1-test-suite.zip - All test files
[name]-month1-coverage-report.html - Coverage report
[name]-month1-bug-fixes.md - Bug documentation
[name]-month1-tdd-commits.md - Git log showing TDD process
Code Requirements¶

// Minimum test structure per component:
describe('ComponentName', () => {
  describe('rendering', () => {
    it('renders correctly with default props', () => {});
    it('renders correctly with custom props', () => {});
  });

  describe('interactions', () => {
    it('handles user interaction', () => {});
  });

  describe('edge cases', () => {
    it('handles edge case scenario', () => {});
  });
});
