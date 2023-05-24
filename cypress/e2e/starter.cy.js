describe('Testing start page', () => {
  it('passes', () => {
    cy.visit('/event/BTq5i7G5kX3ENGw6Wqto/starter')
    cy.contains("Starter")
    cy.contains("Lorenzo Mion")
  })
})