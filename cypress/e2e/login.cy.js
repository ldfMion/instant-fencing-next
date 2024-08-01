describe("template spec", () => {
	it("passes", () => {
		cy.visit("/home");
		cy.contains("Continue with Google").click();
	});
});
