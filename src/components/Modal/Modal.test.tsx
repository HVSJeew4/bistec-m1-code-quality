import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Modal } from "./Modal";

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  const onClose = jest.fn();
  render(
    <Modal isOpen onClose={onClose} title="Confirm delete" {...props}>
      <p>This cannot be undone.</p>
    </Modal>,
  );
  return { onClose };
}

describe("Modal", () => {
  describe("rendering", () => {
    it("renders nothing while closed", () => {
      // Arrange & Act
      renderModal({ isOpen: false });

      // Assert
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders a labelled modal dialog with its content when open", () => {
      // Arrange & Act
      renderModal();

      // Assert
      const dialog = screen.getByRole("dialog", { name: "Confirm delete" });
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(
        screen.getByRole("heading", { name: "Confirm delete" }),
      ).toBeInTheDocument();
      expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("renders correctly with custom props: no title means no heading", () => {
      // Arrange & Act
      renderModal({ title: undefined });

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it("moves focus into the dialog when it opens", () => {
      // Arrange & Act
      renderModal();

      // Assert
      expect(screen.getByRole("dialog")).toHaveFocus();
    });
  });

  describe("interactions", () => {
    it("calls onClose when the close button is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal();

      // Act
      await user.click(screen.getByRole("button", { name: "Close" }));

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape is pressed", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal();

      // Act
      await user.keyboard("{Escape}");

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the backdrop is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal();
      // The backdrop is purely visual, so it has no role or label to query by.
      // eslint-disable-next-line testing-library/no-node-access
      const backdrop = screen.getByRole("dialog").parentElement!;

      // Act
      await user.click(backdrop);

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when the user clicks inside the dialog", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal();

      // Act
      await user.click(screen.getByText("This cannot be undone."));

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("ignores keys other than Escape", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal();

      // Act
      await user.keyboard("{Enter}a");

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });

    it("does not react to Escape while closed", async () => {
      // Arrange
      const user = userEvent.setup();
      const { onClose } = renderModal({ isOpen: false });

      // Act
      await user.keyboard("{Escape}");

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });

    it("stops reacting to Escape after it is closed by the parent", async () => {
      // Arrange
      const user = userEvent.setup();
      const onClose = jest.fn();
      const { rerender } = render(
        <Modal isOpen onClose={onClose} title="Confirm delete">
          Body
        </Modal>,
      );
      rerender(
        <Modal isOpen={false} onClose={onClose} title="Confirm delete">
          Body
        </Modal>,
      );

      // Act
      await user.keyboard("{Escape}");

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });

    it("keeps focus on a field inside the dialog when the parent re-renders", async () => {
      // Arrange
      const user = userEvent.setup();
      // Parents commonly pass an inline arrow function, so onClose is a new function every render.
      const { rerender } = render(
        <Modal isOpen onClose={() => {}} title="Edit name">
          <input aria-label="Name" />
        </Modal>,
      );
      await user.click(screen.getByRole("textbox", { name: "Name" }));

      // Act
      rerender(
        <Modal isOpen onClose={() => {}} title="Edit name">
          <input aria-label="Name" />
        </Modal>,
      );

      // Assert
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(
        <Modal isOpen onClose={() => {}} title="Confirm delete">
          <p>This cannot be undone.</p>
        </Modal>,
      );

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
