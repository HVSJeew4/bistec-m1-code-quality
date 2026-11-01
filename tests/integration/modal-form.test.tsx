import { FormEvent, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../../src/components/Modal/Modal";
import { Input } from "../../src/components/Input/Input";
import { Button } from "../../src/components/Button/Button";

// A profile page that edits the display name in a modal form.
function ProfilePage() {
  const [name, setName] = useState("Ada");
  const [draft, setDraft] = useState(name);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setDraft(name);
    setIsOpen(true);
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    setName(draft);
    setIsOpen(false);
  };

  return (
    <>
      <p>Display name: {name}</p>
      <Button onClick={open}>Edit name</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit name">
        <form onSubmit={save}>
          <Input label="Name" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Button>Save</Button>
        </form>
      </Modal>
    </>
  );
}

describe("Modal with a form inside (Modal + Input + Button)", () => {
  it("opens a dialog pre-filled with the current value", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Act
    await user.click(screen.getByRole("button", { name: "Edit name" }));

    // Assert
    expect(screen.getByRole("dialog", { name: "Edit name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  });

  it("saves the edited value and closes the dialog on submit", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: "Edit name" }));
    const nameInput = screen.getByRole("textbox", { name: "Name" });

    // Act
    await user.clear(nameInput);
    await user.type(nameInput, "Grace");
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Display name: Grace")).toBeInTheDocument();
  });

  it("submits with the Enter key from inside the input", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: "Edit name" }));

    // Act
    await user.type(screen.getByRole("textbox", { name: "Name" }), " Lovelace{Enter}");

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Display name: Ada Lovelace")).toBeInTheDocument();
  });

  it("discards unsaved changes when the dialog is closed with Escape", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProfilePage />);
    await user.click(screen.getByRole("button", { name: "Edit name" }));
    await user.type(screen.getByRole("textbox", { name: "Name" }), " (draft)");

    // Act
    await user.keyboard("{Escape}");

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Display name: Ada")).toBeInTheDocument();
  });
});
