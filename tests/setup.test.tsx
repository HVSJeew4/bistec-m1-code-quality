import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

// Smoke test: proves jsdom, Testing Library, jest-dom, user-event and jest-axe
// are wired up. Component behaviour is tested in src/components/*.
describe("test environment", () => {
  it("renders into jsdom and supports jest-dom matchers", () => {
    // Arrange
    render(<button type="button">Save</button>);

    // Assert
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("simulates user interaction with user-event", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <button type="button" onClick={handleClick}>
        Save
      </button>,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("runs axe accessibility checks", async () => {
    // Arrange
    const { container } = render(<button type="button">Save</button>);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
