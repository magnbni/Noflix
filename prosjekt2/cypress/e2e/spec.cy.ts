describe("Test Basics", () => {
  it("Visits Noflix", () => {
    cy.visit("/");
    cy.get(".searchHeader").type("lord of the rings{enter}");
    cy.url().should("include", "/search/lord%20of%20the%20rings");
  });

  it("Return back to home page", () => {
    cy.visit("/search/lord%20of%20the%20rings");
    cy.get(".logoAndTitle");
    cy.url().should("include", "/");
  });

  it("Visit Login Page", () => {
    cy.visit("/");
    cy.get('.hammiIconOpen').click();
    cy.url().should("include", "/login");
  });
});

describe("Test Sorting", () => {
  it("Sort After Search", () => {
    cy.visit("/");
    //Make a search
    cy.get(".searchHeader").type("test{enter}");
    //Open sort menu
    cy.get('[aria-label="open drawer"] > .hammiIconOpen').click();
    //Sort by title
    cy.get('.MuiFormGroup-root > :nth-child(2) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("A Colbert");
    //Flip switch
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("ZZ Top");
    //Sort by year
    cy.get('.MuiFormGroup-root > :nth-child(3) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Rat");
    //Flip switch
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Test Pilot");
    //Sort by rating
    cy.get(':nth-child(4) > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Neil Diamond");
    //Flip switch
    cy.get('[style="padding: 10px;"] > :nth-child(2) > .MuiFormControlLabel-root > .MuiTypography-root').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Eurythmics");
  });
});