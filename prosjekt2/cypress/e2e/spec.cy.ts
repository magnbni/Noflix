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

describe("Test Sorting", () => {
  it("Sort After Search", () => {
    cy.visit("/");
    cy.get(".searchHeader").type("test{enter}");
    cy.get('[aria-label="open drawer"] > .hammiIconOpen').click();
    cy.get('.MuiFormGroup-root > :nth-child(2) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("A Colbert");
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("ZZ Top");
    cy.get('.MuiFormGroup-root > :nth-child(3) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Rat");
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Test Pilot");
    cy.get(':nth-child(4) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Neil Diamond");
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Eurythmics");
  });
});
