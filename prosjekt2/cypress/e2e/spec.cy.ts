import { describe, it } from "node:test";

describe("Test Search", () => {
  it("Visits Noflix", () => {
    cy.visit("/");
    cy.get(".searchHeader").type("lord of the rings{enter}");
    cy.url().should("include", "/search/lord%20of%20the%20rings");
  });
});

describe("Test Home Button", () => {
  it("Return back to home page", () => {
    cy.visit("/search/lord%20of%20the%20rings");
    cy.get(".logoAndTitle");
    cy.url().should("include", "/");
  });
});
