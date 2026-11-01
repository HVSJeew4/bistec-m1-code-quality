import { FormEvent, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../src/components/Input/Input";
import { Button } from "../../src/components/Button/Button";
import { Alert } from "../../src/components/Alert/Alert";

// A small sign-up form built only from library components, the way a consuming app would use them.
function SignupForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSubmitted(true);
    onSubmit(email);
  };

  return (
    // noValidate: the form shows its own error through Input instead of the browser's popup.
    <form onSubmit={handleSubmit} aria-label="Sign up" noValidate>
      <Input
        label="Email"
        type="email"
        required
        value={email}
        error={error}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button disabled={submitted}>Sign up</Button>
      {submitted && <Alert variant="success">Thanks for signing up!</Alert>}
    </form>
  );
}

describe("Form submission flow (Input + Button + Alert)", () => {
  it("shows a validation error and does not submit an invalid email", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<SignupForm onSubmit={handleSubmit} />);

    // Act
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Assert
    expect(screen.getByRole("textbox", { name: /Email/ })).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("clears the error, submits once and confirms after the user corrects the email", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<SignupForm onSubmit={handleSubmit} />);
    const email = screen.getByRole("textbox", { name: /Email/ });
    await user.type(email, "ada");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Act
    await user.type(email, "@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Assert
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("ada@example.com");
    expect(email).not.toBeInvalid();
    expect(screen.getByText("Thanks for signing up!")).toBeInTheDocument();
  });

  it("disables the submit button after a successful submit, so it cannot be sent twice", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<SignupForm onSubmit={handleSubmit} />);
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Act
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    // Assert
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
