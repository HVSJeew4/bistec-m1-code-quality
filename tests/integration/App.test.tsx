import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../../src/App";

// The demo app wires the library components to shared state, so one component's
// interaction changes what another part of the page shows.
describe("Demo app (components affecting each other)", () => {
  it("shows the framework chosen in the Dropdown elsewhere on the page", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    await user.click(screen.getByRole("option", { name: "Vue" }));

    // Assert
    expect(screen.getByRole("combobox", { name: "Framework" })).toHaveTextContent("Vue");
    expect(screen.getByText("Selected: vue")).toBeInTheDocument();
  });

  it("updates the dark mode status text when the Toggle is switched", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Dark mode: OFF")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("switch", { name: "Dark mode" }));

    // Assert
    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeChecked();
    expect(screen.getByText("Dark mode: ON")).toBeInTheDocument();
  });

  it("clears the Email field's error once a Name is entered", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveAccessibleDescription(
      "Name is required",
    );

    // Act
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");

    // Assert
    const email = screen.getByRole("textbox", { name: /Email/ });
    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(email).not.toHaveAccessibleDescription();
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  it("reports the selected tab index through the Tabs onChange handler", async () => {
    // Arrange
    const user = userEvent.setup();
    // The demo logs tab changes; mock console.log so the test can assert on it without noise.
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<App />);

    // Act
    await user.click(screen.getByRole("tab", { name: "Pricing" }));

    // Assert
    expect(logSpy).toHaveBeenCalledWith("Tab index:", 2);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("This is the pricing tab content.");
    logSpy.mockRestore();
  });
});
