# Month 1 Rubric
Evaluation Preview¶
Your submission will be evaluated on:

Criteria	Points	What Evaluators Look For
Test Coverage	25	80%+ lines, functions, branches covered
Test Quality	25	Descriptive names, AAA pattern, no implementation testing
TDD Process	20	Evidence of red-green-refactor in commits
Bug Fixes	15	All 5 bugs found and properly fixed
Code Quality	10	Clean, readable test code
Documentation	5	Clear bug fix documentation
Starter Code¶
The following components are provided with intentional bugs:


// Button.tsx - Has disabled state bug
export const Button = ({ children, onClick, disabled, variant }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}  // Bug: Called even when disabled
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// More components provided in starter repo...
Tips for Success¶
Start with simple components - Button, Toggle before Modal, Tabs
Use data-testid sparingly - Prefer accessible queries (role, label)
Test behavior, not implementation - Don't test internal state
Write descriptive test names - Should read like documentation
Mock appropriately - Only mock what you need to
Check coverage gaps - Look at uncovered lines in report
Commit frequently - Show TDD progression in git history
Document your bugs - Future you will thank you
Common Mistakes to Avoid¶
Testing implementation details (internal state)
Not testing edge cases (null, undefined, empty)
Missing accessibility tests
Snapshot testing everything
Not mocking timers for async tests
Testing styles instead of behavior
Skipping error state tests
