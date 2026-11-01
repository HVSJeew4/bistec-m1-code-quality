import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  describe("rendering", () => {
    it("renders an unchecked switch with default props", () => {
      // Arrange & Act
      render(<Toggle />);

      // Assert
      const toggle = screen.getByRole("switch");
      expect(toggle).not.toBeChecked();
      expect(toggle).toHaveAttribute("tabindex", "0");
    });

    it("renders correctly with custom props: label and checked", () => {
      // Arrange & Act
      render(<Toggle label="Dark mode" checked />);

      // Assert
      expect(screen.getByRole("switch", { name: "Dark mode" })).toBeChecked();
      expect(screen.getByText("Dark mode")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("switches on and off when clicked (uncontrolled)", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Toggle label="Dark mode" />);
      const toggle = screen.getByRole("switch", { name: "Dark mode" });

      // Act
      await user.click(toggle);

      // Assert
      expect(toggle).toBeChecked();

      // Act
      await user.click(toggle);

      // Assert
      expect(toggle).not.toBeChecked();
    });

    it.each(["{Enter}", " "])(
      "switches when %p is pressed while focused",
      async (key) => {
        // Arrange
        const user = userEvent.setup();
        render(<Toggle label="Dark mode" />);

        // Act
        await user.tab();
        await user.keyboard(key);

        // Assert
        expect(screen.getByRole("switch", { name: "Dark mode" })).toBeChecked();
      },
    );

    it("ignores other keys", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Toggle label="Dark mode" />);

      // Act
      await user.tab();
      await user.keyboard("a");

      // Assert
      expect(
        screen.getByRole("switch", { name: "Dark mode" }),
      ).not.toBeChecked();
    });
  });

  describe("edge cases", () => {
    it("does not switch when disabled", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Toggle label="Dark mode" disabled />);
      const toggle = screen.getByRole("switch", { name: "Dark mode" });

      // Act
      await user.click(toggle);

      // Assert
      expect(toggle).not.toBeChecked();
    });

    it("is removed from the tab order when disabled", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Toggle label="Dark mode" disabled />);

      // Act
      await user.tab();

      // Assert
      expect(
        screen.getByRole("switch", { name: "Dark mode" }),
      ).not.toHaveFocus();
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(<Toggle label="Dark mode" />);

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
