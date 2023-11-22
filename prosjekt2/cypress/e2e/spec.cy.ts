describe('Test Search', () => {
  it('Visits Noflix', () => {
    cy.visit('/')
    cy.get('.searchHeader').type('lord of the rings{enter}')
    cy.url().should('include', '/search/lord%20of%20the%20rings')
  })
})