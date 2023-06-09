describe('Pools index page', () => {
    it('passes', () => {
      cy.visit('/event/BTq5i7G5kX3ENGw6Wqto/pools/8dMJ1ZpmIP3vGdOrDWRR')
      cy.contains("Bouts")
      cy.contains("Lorenzo Mion")

      cy.get("input[type=number]").eq(1).type("3")
    })
  })