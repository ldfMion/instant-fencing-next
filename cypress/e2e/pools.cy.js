describe('Pools index page', () => {
  it('passes', () => {
    cy.visit('/event/BTq5i7G5kX3ENGw6Wqto/pools')
    cy.contains("Pools")
    cy.contains("Lorenzo Mion")
  })
})