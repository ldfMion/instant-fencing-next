import styles from "../styles/LogPrompt.module.css";

import LoginButton from "./LoginButton.jsx";
import NavBar from "./NavBar.jsx";

export function LoggedOut() {
	return (
		<>
			<NavBar />
			<div className="mainContent">
				<h2>Log in or create an account with Google</h2>
				<p className="fail-text">You are currently logged out.</p>
				<LoginButton />
			</div>
		</>
	);
}
