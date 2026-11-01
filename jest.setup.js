// Adds DOM matchers such as toBeInTheDocument, toBeDisabled, toHaveAccessibleName.
import "@testing-library/jest-dom";
// Adds toHaveNoViolations for automated accessibility checks with axe.
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
