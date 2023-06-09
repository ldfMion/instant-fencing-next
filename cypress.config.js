const { defineConfig } = require("cypress");

module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: "http://localhost:3000",
		viewportWidth: 414,
		viewportHeight: 896,
	},
    env: {
        googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
        googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      },
});
