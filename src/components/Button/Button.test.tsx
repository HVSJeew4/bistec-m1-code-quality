import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders its children as the accessible label with default props", () => {
      // Arrange & Act
      render(<Button>Save</Button>);

      // Assert
      const button = screen.getByRole("button", { name: "Save" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("btn", "btn-primary");
    });

    it.each(["primary", "secondary", "danger"] as const)(
      "applies the %s variant style",
      (variant) => {
        // Arrange & Act
        render(<Button variant={variant}>Save</Button>);

        // Assert
        expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
          `btn-${variant}`,
        );
      },
    );

    it("renders correctly with custom props: keeps a custom className alongside its own", () => {
      // Arrange & Act
      render(
        <Button variant="danger" className="wide">
          Delete
        </Button>,
      );

      // Assert
      expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
        "btn",
        "btn-danger",
        "wide",
      );
    });

    it("shows a loading indicator instead of its label while loading", () => {
      // Arrange & Act
      render(<Button loading>Save</Button>);

      // Assert
      expect(
        screen.getByRole("button", { name: "Loading..." }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onClick once when clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Save</Button>);

      // Act
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be activated with the keyboard", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Save</Button>);

      // Act
      await user.tab();
      await user.keyboard("{Enter}");

      // Assert
      expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("is exposed as disabled when the disabled prop is set", () => {
      // Arrange & Act
      render(<Button disabled>Save</Button>);

      // Assert
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    it("does not call onClick when disabled", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Save
        </Button>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Assert
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not throw when clicked without an onClick handler", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Button>Save</Button>);

      // Act & Assert
      await expect(
        user.click(screen.getByRole("button", { name: "Save" })),
      ).resolves.not.toThrow();
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(<Button>Save</Button>);

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
