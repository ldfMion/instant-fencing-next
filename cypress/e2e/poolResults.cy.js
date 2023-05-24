describe("Check pool results", () => {
    it("passes", () => {
        cy.visit("/event/BTq5i7G5kX3ENGw6Wqto/pool-results");
        cy.contains("Pool Results")
        cy.contains("Lorenzo Mion")
    })
})