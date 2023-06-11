describe('Testing start page', () => {
  it('passes', () => {
    cy.visit('/event/BTq5i7G5kX3ENGw6Wqto/participants')
    cy.contains("Participants")
    cy.contains("Lorenzo Mion")
  })
})