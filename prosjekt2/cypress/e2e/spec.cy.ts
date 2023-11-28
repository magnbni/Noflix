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

describe("Test Login", () => {
  it("User Login", () => {
    cy.visit("/login");
    //Test user credentials
    cy.get('#email').type("asdf@gmail.com");
    cy.get('#password').type("asdf1234");
    //Login button
    cy.get('.MuiBox-root > .MuiButtonBase-root').click();
    //Sent back to home page
    cy.url().should("include", "/");
    //Visit user page
    cy.get('[aria-label="User page"] > .hammiIconOpen').click();
    cy.url().should("include", "/user");
    //Check if the last rated movie is correct
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Night Train");
    //Log out
    cy.get('[aria-label="Log out"] > .hammiIconOpen').click();
    //Check that user is logged out by checking if user page button exists
    cy.url().should("include", "/");
    cy.get('[aria-label="User page"] > .hammiIconOpen').should("not.exist");
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

describe("Test Filtration", () => {
  it("Filter after search", () => {
    cy.visit("/");
    //Make a search
    cy.get(".searchHeader").type("the{enter}");
    cy.url().should("include", "/search/the");
    //Open filter menu
    cy.get('[aria-label="open drawer"] > .hammiIconOpen').click();
    //Select crime
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Crime"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Regeneration");
    //Select drama
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Drama"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Sealed Room");
    //Select family
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Family"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Patchwork Girl");
    //Select adventure
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Adventure"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Wonderful Wiz");
    //Select history
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="History"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Sealed Room");
    //Select animation
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Animation"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Alice the Toreador");
    //Select comedy
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Comedy"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Magician's Cave");
    //Select documentary
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Documentary"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Panoramic View of");
    //Select fantasy
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Fantasy"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Magician's Cave");
    //Select romance
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Romance"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Ball Player and");
    //Select TV movie
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="TV Movie"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Alphabet");
    //Select war
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="War"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Birth of a");
    //Select western
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Western"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("Algie, the Miner");
    //Select action
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Action"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Perils of Pauli");
    //Select horror
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Horror"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Sealed Room");
    //Select music
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Music"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Cocoanuts");
    //Select mystery
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Mystery"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Master Mystery");
    //Select science fiction
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Science Fiction"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("20,000 Leagues");
    //Select thriller
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="Thriller"]').click();
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-h5').contains("The Sealed Room");
  });
});