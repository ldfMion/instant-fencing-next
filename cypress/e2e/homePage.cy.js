describe("opening the homepage", () => {
	it("passes", () => {
		cy.visit("/home");
		cy.contains("My Events")
        cy.contains("many pools test")
	});
});
