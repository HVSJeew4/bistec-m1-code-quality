import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders its message as an info alert with default props", () => {
      // Arrange & Act
      render(<Alert>Profile saved</Alert>);

      // Assert
      expect(screen.getByText("Profile saved")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Dismiss alert" }),
      ).not.toBeInTheDocument();
    });

    it.each(["info", "success", "warning", "error"] as const)(
      "renders correctly with custom props: the %s variant",
      (variant) => {
        // Arrange & Act
        const { container } = render(
          <Alert variant={variant}>Profile saved</Alert>,
        );

        // Assert
        // The alert root has no role to query by; its class is the variant's public contract.
        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toHaveClass("alert", `alert-${variant}`);
      },
    );

    it("shows a dismiss button when dismissible", () => {
      // Arrange & Act
      render(<Alert dismissible>Profile saved</Alert>);

      // Assert
      expect(
        screen.getByRole("button", { name: "Dismiss alert" }),
      ).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("disappears and calls onDismiss when the dismiss button is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleDismiss = jest.fn();
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Profile saved
        </Alert>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Dismiss alert" }));

      // Assert
      expect(screen.queryByText("Profile saved")).not.toBeInTheDocument();
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("can be dismissed without an onDismiss handler", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Alert dismissible>Profile saved</Alert>);

      // Act
      await user.click(screen.getByRole("button", { name: "Dismiss alert" }));

      // Assert
      expect(screen.queryByText("Profile saved")).not.toBeInTheDocument();
    });

    it("renders rich content, not just text", () => {
      // Arrange & Act
      render(
        <Alert>
          <strong>Heads up:</strong> check your email
        </Alert>,
      );

      // Assert
      expect(screen.getByText("Heads up:")).toBeInTheDocument();
      expect(screen.getByText(/check your email/)).toBeInTheDocument();
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(<Alert dismissible>Profile saved</Alert>);

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
