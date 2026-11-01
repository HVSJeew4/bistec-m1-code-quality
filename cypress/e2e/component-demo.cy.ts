// Complete user flow through the component demo page, run in a real browser.
describe("Component demo page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("lets a user fill in the form, pick options and use the modal", () => {
    // Input: entering a name clears the Email field's error
    cy.contains("Name is required").should("be.visible");
    cy.get("#input-name").type("Ada");
    cy.contains("Name is required").should("not.exist");

    // Button: the click counter updates; the disabled button cannot be clicked
    cy.contains("button", "Primary (clicked 0x)").click();
    cy.contains("button", "Primary (clicked 1x)").should("exist");
    cy.contains("button", "Disabled").should("be.disabled");

    // Dropdown: choosing a framework updates the page
    cy.get('[role="combobox"]').click();
    cy.contains('[role="option"]', "Svelte").click();
    cy.get('[role="combobox"]').should("contain.text", "Svelte");
    cy.contains("Selected: svelte").should("be.visible");

    // Toggle: the controlled Dark mode switch updates its status text
    cy.contains("Dark mode: OFF").should("be.visible");
    cy.get('[role="switch"][aria-label="Dark mode"]').click();
    cy.get('[role="switch"][aria-label="Dark mode"]').should(
      "have.attr",
      "aria-checked",
      "true",
    );
    cy.contains("Dark mode: ON").should("be.visible");

    // Tabs: switching shows the matching panel
    cy.contains('[role="tab"]', "Features").click();
    cy.get('[role="tabpanel"]').should("contain.text", "features tab content");

    // Modal: opens with focus inside, closes with Escape
    cy.contains("button", "Open Modal").click();
    cy.get('[role="dialog"]').should("be.visible").and("have.focus");
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");

    // Alert: a dismissible alert can be closed
    cy.contains("Operation completed successfully!").should("be.visible");
    cy.get('[aria-label="Dismiss alert"]').first().click();
    cy.contains("Operation completed successfully!").should("not.exist");
  });

  it("has no detectable accessibility violations on load", () => {
    // Disabled controls are exempt from WCAG 1.4.3 contrast, so the disabled toggle is excluded.
    cy.checkA11y({ exclude: [".toggle-disabled"] });
  });
});
