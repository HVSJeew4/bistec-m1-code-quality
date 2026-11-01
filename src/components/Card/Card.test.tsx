import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Card } from "./Card";

describe("Card", () => {
  describe("rendering", () => {
    it("renders only its body content with default props", () => {
      // Arrange & Act
      render(<Card>Body text</Card>);

      // Assert
      expect(screen.getByText("Body text")).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders correctly with custom props: title, image, actions and className", () => {
      // Arrange & Act
      const { container } = render(
        <Card
          title="Mountain trip"
          image="/mountain.jpg"
          actions={<button type="button">Book</button>}
          className="featured"
        >
          Three days in the hills
        </Card>,
      );

      // Assert
      expect(
        screen.getByRole("heading", { name: "Mountain trip" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Mountain trip" })).toHaveAttribute(
        "src",
        "/mountain.jpg",
      );
      expect(screen.getByText("Three days in the hills")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
      // The card root has no role to query by; className is applied to it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass("card", "featured");
    });
  });

  describe("interactions", () => {
    it("lets the user trigger an action rendered in the card", async () => {
      // Arrange
      const user = userEvent.setup();
      const handleBook = jest.fn();
      render(
        <Card
          title="Mountain trip"
          actions={
            <button type="button" onClick={handleBook}>
              Book
            </button>
          }
        >
          Three days in the hills
        </Card>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: "Book" }));

      // Assert
      expect(handleBook).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("treats an image without a title as decorative (empty alt text)", () => {
      // Arrange & Act
      render(<Card image="/pattern.png">Body text</Card>);

      // Assert
      // An <img alt=""> is presentational, so it has no "img" role.
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByRole("presentation")).toHaveAttribute(
        "src",
        "/pattern.png",
      );
    });

    it("does not render an image for an empty image URL", () => {
      // Arrange & Act
      render(
        <Card title="No image" image="">
          Body text
        </Card>,
      );

      // Assert
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("has no detectable accessibility violations", async () => {
      // Arrange
      const { container } = render(
        <Card title="Mountain trip" image="/mountain.jpg">
          Three days in the hills
        </Card>,
      );

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
