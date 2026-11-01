import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Input } from "./Input";

// Parent component that owns the value, the way Input is used in a real form.
function ControlledInput() {
  const [value, setValue] = useState("");
  return (
    <Input label="Email" value={value} onChange={(e) => setValue(e.target.value)} />
  );
}

describe("Input", () => {
  describe("rendering", () => {
    it("renders an empty, valid text input with default props", () => {
      // Arrange & Act
      render(<Input />);

      // Assert
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveValue("");
      expect(input).not.toBeRequired();
      expect(input).not.toBeInvalid();
    });

    it("renders correctly with custom props: label, placeholder and value", () => {
      // Arrange & Act
      render(
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value="Ada"
          onChange={() => {}}
        />,
      );

      // Assert
      const input = screen.getByRole("textbox", { name: "Full name" });
      expect(input).toHaveAttribute("placeholder", "Jane Doe");
      expect(input).toHaveValue("Ada");
    });

    it("shows an error message linked to the input", () => {
      // Arrange & Act
      render(<Input label="Email" error="Email is required" />);

      // Assert
      const input = screen.getByRole("textbox", { name: "Email" });
      expect(input).toBeInvalid();
      expect(input).toHaveAccessibleDescription("Email is required");
      expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
    });

    it("marks a required field in the label and on the input", () => {
      // Arrange & Act
      render(<Input label="Email" required />);

      // Assert
      expect(screen.getByRole("textbox", { name: /Email/ })).toBeRequired();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it.each([
      ["email", "textbox"],
      ["search", "searchbox"],
      ["number", "spinbutton"],
    ])("supports type=%s", (type, role) => {
      // Arrange & Act
      render(<Input label="Field" type={type} />);

      // Assert
      expect(screen.getByRole(role, { name: "Field" })).toHaveAttribute(
        "type",
        type,
      );
    });

    it("supports type=password (not exposed as a textbox)", () => {
      // Arrange & Act
      render(<Input label="Password" type="password" />);

      // Assert
      expect(screen.getByLabelText("Password")).toHaveAttribute(
        "type",
        "password",
      );
    });
  });

  describe("interactions", () => {
    it("updates its value as the user types (controlled by a parent)", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ControlledInput />);

      // Act
      await user.type(screen.getByRole("textbox", { name: "Email" }), "a@b.co");

      // Assert
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("a@b.co");
    });

    it("calls onChange for every character typed", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input label="Code" onChange={handleChange} />);

      // Act
      await user.type(screen.getByRole("textbox", { name: "Code" }), "abc");

      // Assert
      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("calls onFocus and onBlur as the user tabs in and out", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      render(<Input label="Email" onFocus={handleFocus} onBlur={handleBlur} />);

      // Act
      await user.tab();

      // Assert
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(handleBlur).not.toHaveBeenCalled();

      // Act
      await user.tab();

      // Assert
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("builds a valid id from a label containing spaces", () => {
      // Arrange & Act
      render(<Input label="First   Name" />);

      // Assert
      expect(screen.getByLabelText("First Name")).toHaveAttribute(
        "id",
        "input-first-name",
      );
    });

    it("does not show an error for an empty error string", () => {
      // Arrange & Act
      render(<Input label="Email" error="" />);

      // Assert
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Email" })).not.toBeInvalid();
    });

    it("has no detectable accessibility violations with a label and an error", async () => {
      // Arrange
      const { container } = render(
        <Input label="Email" error="Email is required" required />,
      );

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
