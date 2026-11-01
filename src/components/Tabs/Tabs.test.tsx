import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Tabs } from "./Tabs";

const tabs = [
  { label: "Overview", content: <p>Overview content</p> },
  { label: "Features", content: <p>Features content</p> },
  { label: "Pricing", content: <p>Pricing content</p> },
];

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders every tab and shows the first panel with default props", () => {
      // Arrange & Act
      render(<Tabs tabs={tabs} />);

      // Assert
      expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual([
        "Overview",
        "Features",
        "Pricing",
      ]);
      expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
    });

    it("renders correctly with custom props: starts on defaultIndex", () => {
      // Arrange & Act
      render(<Tabs tabs={tabs} defaultIndex={2} />);

      // Assert
      expect(screen.getByRole("tab", { name: "Pricing" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Pricing content");
    });
  });

  describe("interactions", () => {
    it("switches the visible panel when another tab is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Tabs tabs={tabs} />);

      // Act
      await user.click(screen.getByRole("tab", { name: "Features" }));

      // Assert
      expect(screen.getByRole("tab", { name: "Features" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Features content");
      expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
    });

    it("calls onChange with the zero-based index of the clicked tab", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Tabs tabs={tabs} onChange={handleChange} />);

      // Act
      await user.click(screen.getByRole("tab", { name: "Features" }));

      // Assert
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it("reports the same index it uses for defaultIndex, so the two can round-trip", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Tabs tabs={tabs} onChange={handleChange} />);

      // Act
      await user.click(screen.getByRole("tab", { name: "Pricing" }));
      const reportedIndex = handleChange.mock.calls[0][0];

      // Assert
      expect(tabs[reportedIndex]?.label).toBe("Pricing");
    });

    it("can switch tabs without an onChange handler", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<Tabs tabs={tabs} />);

      // Act
      await user.click(screen.getByRole("tab", { name: "Pricing" }));

      // Assert
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Pricing content");
    });
  });

  describe("edge cases", () => {
    it("renders an empty tab list and panel when there are no tabs", () => {
      // Arrange & Act
      render(<Tabs tabs={[]} />);

      // Assert
      expect(screen.queryByRole("tab")).not.toBeInTheDocument();
      expect(screen.getByRole("tabpanel")).toBeEmptyDOMElement();
    });

    it("renders an empty panel when defaultIndex is out of range", () => {
      // Arrange & Act
      render(<Tabs tabs={tabs} defaultIndex={5} />);

      // Assert
      expect(screen.getByRole("tabpanel")).toBeEmptyDOMElement();
      screen.getAllByRole("tab").forEach((tab) => {
        expect(tab).toHaveAttribute("aria-selected", "false");
      });
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(<Tabs tabs={tabs} />);

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
