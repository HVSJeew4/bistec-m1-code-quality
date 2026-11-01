import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Dropdown } from "./Dropdown";

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

describe("Dropdown", () => {
  describe("rendering", () => {
    it("renders a closed combobox showing the placeholder with default props", () => {
      // Arrange & Act
      render(<Dropdown items={frameworks} />);

      // Assert
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveTextContent("Select...");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("renders correctly with custom props: label, placeholder and selected value", () => {
      // Arrange & Act
      render(
        <Dropdown
          items={frameworks}
          label="Framework"
          placeholder="Pick one"
          value="vue"
        />,
      );

      // Assert
      expect(screen.getByText("Framework")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveTextContent("Vue");
    });

    it("lists every item and marks the selected one when opened", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={frameworks} value="vue" />);

      // Act
      await user.click(screen.getByRole("combobox"));

      // Assert
      const options = screen.getAllByRole("option");
      expect(options.map((o) => o.textContent)).toEqual([
        "React",
        "Vue",
        "Svelte",
      ]);
      expect(screen.getByRole("option", { name: "Vue" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("option", { name: "React" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });
  });

  describe("interactions", () => {
    it("opens and closes when the trigger is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={frameworks} />);
      const trigger = screen.getByRole("combobox");

      // Act
      await user.click(trigger);

      // Assert
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // Act
      await user.click(trigger);

      // Assert
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("calls onChange with the chosen value and closes", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Dropdown items={frameworks} onChange={handleChange} />);

      // Act
      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByRole("option", { name: "Svelte" }));

      // Assert
      expect(handleChange).toHaveBeenCalledWith("svelte");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it.each(["{Enter}", " "])(
      "opens with the %p key when focused",
      async (key) => {
        // Arrange
        const user = userEvent.setup();
        render(<Dropdown items={frameworks} />);

        // Act
        await user.tab();
        await user.keyboard(key);

        // Assert
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      },
    );

    it("closes with the Escape key", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={frameworks} />);
      await user.click(screen.getByRole("combobox"));

      // Act
      await user.keyboard("{Escape}");

      // Assert
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes when the user clicks outside it", async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <>
          <Dropdown items={frameworks} />
          <button type="button">Elsewhere</button>
        </>,
      );
      await user.click(screen.getByRole("combobox"));

      // Act
      await user.click(screen.getByRole("button", { name: "Elsewhere" }));

      // Assert
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("stays open when the user clicks inside the menu without choosing", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={frameworks} />);
      await user.click(screen.getByRole("combobox"));

      // Act
      await user.click(screen.getByRole("listbox"));

      // Assert
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("uses its label as the combobox's accessible name", () => {
      // Arrange & Act
      render(<Dropdown items={frameworks} label="Framework" />);

      // Assert
      expect(
        screen.getByRole("combobox", { name: "Framework" }),
      ).toBeInTheDocument();
    });

    it("has no detectable accessibility violations when labelled", async () => {
      // Arrange
      const { container } = render(
        <Dropdown items={frameworks} label="Framework" />,
      );

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });

    it("renders the placeholder instead of crashing when items is missing", async () => {
      // Arrange
      const user = userEvent.setup();
      // e.g. data from an API that has not loaded yet
      render(<Dropdown items={undefined} />);

      // Act
      await user.click(screen.getByRole("combobox"));

      // Assert
      expect(screen.getByRole("combobox")).toHaveTextContent("Select...");
      expect(screen.getByRole("listbox")).toBeEmptyDOMElement();
    });

    it("opens an empty list when there are no items", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={[]} />);

      // Act
      await user.click(screen.getByRole("combobox"));

      // Assert
      expect(screen.getByRole("listbox")).toBeEmptyDOMElement();
    });

    it("shows the placeholder when the value matches no item", () => {
      // Arrange & Act
      render(<Dropdown items={frameworks} value="angular" />);

      // Assert
      expect(screen.getByRole("combobox")).toHaveTextContent("Select...");
    });

    it("can choose an item without an onChange handler", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Dropdown items={frameworks} />);
      await user.click(screen.getByRole("combobox"));

      // Act
      await user.click(screen.getByRole("option", { name: "React" }));

      // Assert
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });
});
