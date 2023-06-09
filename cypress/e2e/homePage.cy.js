describe("template spec", () => {
	it("passes", () => {
		cy.visit("/home");
		cy.contains("Log In").click();

		cy.contains("Log In With Google")//.click();
	});
});
